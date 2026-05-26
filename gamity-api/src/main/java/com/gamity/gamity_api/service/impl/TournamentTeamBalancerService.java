package com.gamity.gamity_api.service.impl;

import com.gamity.gamity_api.domain.entity.*;
import com.gamity.gamity_api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class TournamentTeamBalancerService {

    private final TournamentRepository tournamentRepository;
    private final TournamentRegistrationRepository registrationRepository;
    private final UserRepository userRepository;
    private final TournamentTeamRepository teamRepository;
    private final TournamentTeamMemberRepository memberRepository;
    private final NotificationRepository notificationRepository;
    private final TournamentMatchRepository matchRepository;

    @Transactional
    public Map<String, Object> closeAndGenerateTeams(Integer tournamentId) {
        Tournament t = tournamentRepository.findById(tournamentId).orElseThrow();
        t.setStatus("closed");

        List<TournamentRegistration> regs = registrationRepository.findByTournamentId(tournamentId);

        // Balanceo: Snake Algorithm basándose en rank de Valorant
        Map<String, Integer> rankValues = new HashMap<>();
        rankValues.put("Radiante", 9);
        rankValues.put("Inmortal", 8);
        rankValues.put("Ascendente", 7);
        rankValues.put("Diamante", 6);
        rankValues.put("Platino", 5);
        rankValues.put("Oro", 4);
        rankValues.put("Plata", 3);
        rankValues.put("Bronce", 2);
        rankValues.put("Hierro", 1);

        regs.sort((r1, r2) -> {
            User u1 = userRepository.findById(r1.getUserId()).orElse(null);
            User u2 = userRepository.findById(r2.getUserId()).orElse(null);
            int v1 = (u1 != null && u1.getProfile() != null && u1.getProfile().getGameRank() != null)
                    ? rankValues.getOrDefault(u1.getProfile().getGameRank(), 0)
                    : 0;
            int v2 = (u2 != null && u2.getProfile() != null && u2.getProfile().getGameRank() != null)
                    ? rankValues.getOrDefault(u2.getProfile().getGameRank(), 0)
                    : 0;

            // prioridad sobre el triger de los bots
            if (u1 != null && !u1.getUsername().startsWith("Bot_"))
                v1 += 1000;
            if (u2 != null && !u2.getUsername().startsWith("Bot_"))
                v2 += 1000;

            return Integer.compare(v2, v1); // Descendente
        });

        int teamCount = Math.max(1, regs.size() / 5);
        List<List<TournamentRegistration>> snakeTeams = new ArrayList<>();
        for (int i = 0; i < teamCount; i++)
            snakeTeams.add(new ArrayList<>());

        for (int i = 0; i < regs.size(); i++) {
            if (i >= teamCount * 5)
                break; // Excluir sobrantes si no completan 5
            int round = i / teamCount;
            int pos = i % teamCount;
            int teamIndex = (round % 2 == 0) ? pos : (teamCount - 1 - pos);
            snakeTeams.get(teamIndex).add(regs.get(i));
        }

        for (int i = 0; i < teamCount; i++) {
            TournamentTeam team = new TournamentTeam();
            team.setTournamentId(tournamentId);
            team.setName("Team " + (i + 1));
            team.setSeed(i + 1);
            team = teamRepository.save(team);

            List<TournamentRegistration> teamRegs = snakeTeams.get(i);
            for (int j = 0; j < teamRegs.size(); j++) {
                TournamentRegistration r = teamRegs.get(j);
                if (j == 0) {
                    team.setCaptainId(r.getUserId());
                    teamRepository.save(team);
                }
                TournamentTeamMember member = new TournamentTeamMember();
                member.setTeamId(team.getId());
                member.setUserId(r.getUserId());
                memberRepository.save(member);

                Notification n = new Notification();
                n.setUserId(r.getUserId());
                n.setType("TEAM_ASSIGNED");
                n.setMessage("¡Tu equipo está listo! Entra a la pestaña Mi Equipo para conocer a tus compañeros.");
                n.setIsRead(false);
                notificationRepository.save(n);
            }
        }

        tournamentRepository.save(t);
        return Map.of("success", true, "teams_generated", teamCount);
    }

    @Transactional
    public Map<String, Object> generateBracket(Integer tournamentId) {
        Tournament t = tournamentRepository.findById(tournamentId).orElseThrow();
        List<TournamentTeam> teams = teamRepository.findByTournamentIdOrderBySeedAsc(tournamentId);

        if (teams.size() >= 2) {

            t.setStatus("active");
            tournamentRepository.save(t);
            createMatch(tournamentId, 1, 1, teams.get(0).getId(), teams.get(1).getId(), null);
        }

        return Map.of("success", true);
    }

    private TournamentMatch createMatch(Integer tId, Integer round, Integer order, Integer t1, Integer t2,
            Integer next) {
        TournamentMatch m = new TournamentMatch();
        m.setTournamentId(tId);
        m.setRound(round);
        m.setMatchOrder(order);
        m.setTeam1Id(t1);
        m.setTeam2Id(t2);
        m.setNextMatchId(next);
        m.setStatus("pending");
        return matchRepository.save(m);
    }
}
