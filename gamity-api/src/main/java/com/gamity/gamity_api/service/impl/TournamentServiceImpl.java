package com.gamity.gamity_api.service.impl;

import com.gamity.gamity_api.domain.entity.*;
import com.gamity.gamity_api.repository.*;
import com.gamity.gamity_api.service.TournamentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;
import org.springframework.scheduling.annotation.Scheduled;

@Service
@RequiredArgsConstructor
public class TournamentServiceImpl implements TournamentService {

    private final TournamentRepository tournamentRepository;
    private final TournamentRegistrationRepository registrationRepository;
    private final TournamentTeamRepository teamRepository;
    private final TournamentTeamMemberRepository memberRepository;
    private final TournamentMatchRepository matchRepository;
    private final TournamentTeamChatRepository chatRepository;
    private final NotificationRepository notificationRepository;
    private final UserBadgeRepository badgeRepository;
    private final UserRepository userRepository;
    private final FriendshipRequestRepository friendshipRequestRepository;

    @Override
    public Map<String, Object> getActiveTournament(Long userId) {
        List<TournamentRegistration> userRegs = registrationRepository.findByUserId(userId);
        Optional<Tournament> activeMatch = userRegs.stream()
                .map(r -> tournamentRepository.findById(r.getTournamentId()).orElse(null))
                .filter(t -> t != null && ("active".equals(t.getStatus()) || "awaiting_reports".equals(t.getStatus())))
                .findFirst();

        if (activeMatch.isPresent()) {
            return Map.of("active", true, "tournament", activeMatch.get(), "registered", true, "current_players", 10);
        }

        Optional<Tournament> opt = tournamentRepository.findAll().stream()
                .filter(t -> "open".equals(t.getStatus()))
                .findFirst();

        Tournament t;
        if (opt.isEmpty()) {
            t = new Tournament();
            t.setName("Matchmaking 5v5");
            t.setStatus("open");
            t.setMaxPlayers(10);
            t.setRegistrationOpensAt(java.time.LocalDateTime.now());
            t.setRegistrationClosesAt(java.time.LocalDateTime.now().plusDays(1));
            t.setStartsAt(java.time.LocalDateTime.now().plusDays(1));
            t.setFormat("final");
            t = tournamentRepository.save(t);
        } else {
            t = opt.get();
        }

        boolean registered = registrationRepository.existsByTournamentIdAndUserId(t.getId(), userId);
        int count = registrationRepository.countByTournamentId(t.getId());

        return Map.of("active", true, "tournament", t, "registered", registered, "current_players", count);
    }

    @Override
    public Map<String, Object> registerUser(Integer tournamentId, Long userId) {
        Tournament t = tournamentRepository.findById(tournamentId).orElseThrow();
        if (!"open".equals(t.getStatus())) {
            return Map.of("success", false, "message", "La cola ya no está abierta");
        }

        if (registrationRepository.existsByTournamentIdAndUserId(tournamentId, userId)) {
            return Map.of("success", false, "message", "Ya estás en la cola");
        }

        int count = registrationRepository.countByTournamentId(tournamentId);
        if (count >= 10) {
            return Map.of("success", false, "message", "La partida ya está llena");
        }

        TournamentRegistration reg = new TournamentRegistration();
        reg.setTournamentId(tournamentId);
        reg.setUserId(userId);
        registrationRepository.save(reg);

        count++;
        if (count >= 10) {
            this.closeAndGenerateTeams(tournamentId);
            this.generateBracket(tournamentId);
        }

        return Map.of("success", true, "message", "Registrado correctamente");
    }

    @Override
    @Transactional
    public Map<String, Object> unregisterUser(Integer tournamentId, Long userId) {
        Tournament t = tournamentRepository.findById(tournamentId).orElse(null);
        if (t == null) {
            return Map.of("success", false, "message", "Torneo no encontrado");
        }
        if (!"open".equals(t.getStatus())) {
            return Map.of("success", false, "message", "El matchmaking ya ha comenzado, no puedes cancelar.");
        }

        TournamentRegistration reg = registrationRepository.findByTournamentIdAndUserId(tournamentId, userId)
                .orElse(null);
        if (reg != null) {
            registrationRepository.delete(reg);
            return Map.of("success", true, "message", "Búsqueda cancelada correctamente.");
        }

        return Map.of("success", false, "message", "No estabas en la cola.");
    }

    @Override
    @Transactional
    public Map<String, Object> forceMatchmaking(Long userId) {
        Map<String, Object> activeInfo = getActiveTournament(userId);
        Tournament t = (Tournament) activeInfo.get("tournament");
        if (!"open".equals(t.getStatus())) {
            return Map.of("success", false, "message", "No hay ninguna cola abierta");
        }

        if (!registrationRepository.existsByTournamentIdAndUserId(t.getId(), userId)) {
            TournamentRegistration reg = new TournamentRegistration();
            reg.setTournamentId(t.getId());
            reg.setUserId(userId);
            registrationRepository.save(reg);
        }

        int count = registrationRepository.countByTournamentId(t.getId());
        int max = t.getMaxPlayers() != null ? t.getMaxPlayers() : 10;
        int needed = max - count;

        for (int i = 0; i < needed; i++) {
            User dummy = new User();
            String randomStr = UUID.randomUUID().toString();
            dummy.setUsername("Bot_" + randomStr.substring(0, 8));
            dummy.setEmail("bot_" + randomStr + "@bot.com");
            dummy.setPassword("bot");
            dummy.setRole("user");
            dummy.setAvatar("img/default.png");
            dummy.setStatus("offline");

            UserProfile profile = new UserProfile();
            profile.setGameRank("Platino");
            dummy.setProfile(profile);

            dummy = userRepository.save(dummy);

            TournamentRegistration reg = new TournamentRegistration();
            reg.setTournamentId(t.getId());
            reg.setUserId(dummy.getId());
            registrationRepository.save(reg);
        }

        this.closeAndGenerateTeams(t.getId());
        this.generateBracket(t.getId());
        return Map.of("success", true, "message", "Partida generada!");
    }

    @Override
    public Map<String, Object> getMyTeam(Integer tournamentId, Long userId) {
        Optional<TournamentTeam> opt = teamRepository.findByTournamentIdAndUserId(tournamentId, userId);
        if (opt.isEmpty())
            return Map.of("has_team", false);

        TournamentTeam team = opt.get();
        List<TournamentTeamMember> members = memberRepository.findByTeamId(team.getId());

        List<Map<String, Object>> membersInfo = new ArrayList<>();
        for (TournamentTeamMember m : members) {
            User u = userRepository.findById(m.getUserId()).orElse(null);
            if (u != null) {
                membersInfo.add(Map.of(
                        "id", u.getId(),
                        "username", u.getUsername(),
                        "avatar", u.getAvatar() != null ? u.getAvatar() : "img/default.png"));
            }
        }

        return Map.of(
                "has_team", true,
                "team", team,
                "members", membersInfo);
    }

    @Override
    public Map<String, Object> changeTeamName(Integer teamId, Long userId, String newName) {
        TournamentTeam team = teamRepository.findById(teamId).orElseThrow();
        if (!team.getCaptainId().equals(userId)) {
            return Map.of("success", false, "message", "Only captain can change name");
        }
        team.setName(newName);
        teamRepository.save(team);
        return Map.of("success", true);
    }

    @Override
    public Map<String, Object> getBracket(Integer tournamentId) {
        List<TournamentMatch> matches = matchRepository.findByTournamentIdOrderByRoundAscMatchOrderAsc(tournamentId);
        return Map.of("matches", matches);
    }

    @Override
    public Map<String, Object> reportResult(Integer matchId, Long userId, Integer winnerTeamId) {
        TournamentMatch match = matchRepository.findById(matchId).orElseThrow();
        TournamentTeam team = teamRepository.findByTournamentIdAndUserId(match.getTournamentId(), userId).orElseThrow();

        if (team.getId().equals(match.getTeam1Id())) {
            match.setTeam1ReportedWinner(winnerTeamId);
            // TFG Demo shortcut: auto-confirm from the other side to prevent getting stuck
            // waiting for bots
            if (match.getTeam2ReportedWinner() == null) {
                match.setTeam2ReportedWinner(winnerTeamId);
            }
        } else if (team.getId().equals(match.getTeam2Id())) {
            match.setTeam2ReportedWinner(winnerTeamId);
            // TFG Demo shortcut: auto-confirm from the other side to prevent getting stuck
            // waiting for bots
            if (match.getTeam1ReportedWinner() == null) {
                match.setTeam1ReportedWinner(winnerTeamId);
            }
        } else {
            return Map.of("success", false, "message", "Not in this match");
        }

        match.setStatus("awaiting_reports");

        // Validate if both reported same
        if (match.getTeam1ReportedWinner() != null && match.getTeam2ReportedWinner() != null) {
            if (match.getTeam1ReportedWinner().equals(match.getTeam2ReportedWinner())) {
                match.setStatus("validated");
                match.setWinnerId(match.getTeam1ReportedWinner());

                // Avanzar al ganador
                if (match.getNextMatchId() != null) {
                    TournamentMatch next = matchRepository.findById(match.getNextMatchId()).orElseThrow();
                    if (next.getTeam1Id() == null)
                        next.setTeam1Id(match.getWinnerId());
                    else
                        next.setTeam2Id(match.getWinnerId());
                    matchRepository.save(next);
                } else {
                    // Final match! Tournament over
                    Tournament t = tournamentRepository.findById(match.getTournamentId()).orElseThrow();
                    t.setStatus("finished");
                    tournamentRepository.save(t);

                    // Award badges and +1 premier_wins
                    List<TournamentTeamMember> winners = memberRepository.findByTeamId(match.getWinnerId());
                    for (TournamentTeamMember w : winners) {
                        User user = userRepository.findById(w.getUserId()).orElse(null);
                        if (user != null) {
                            if (user.getPremierWins() == null)
                                user.setPremierWins(0);
                            user.setPremierWins(user.getPremierWins() + 1);
                            userRepository.save(user);
                        }

                        UserBadge badge = new UserBadge();
                        badge.setUserId(w.getUserId());
                        badge.setBadgeType("CHAMPION");
                        badge.setTournamentId(t.getId());
                        badgeRepository.save(badge);

                        Notification n = new Notification();
                        n.setUserId(w.getUserId());
                        n.setType("TOURNAMENT_WIN");
                        n.setMessage("🏆 ¡Has ganado la partida Premier \"" + t.getName() + "\"! +1 victoria.");
                        n.setIsRead(false);
                        notificationRepository.save(n);
                    }
                }
            } else {
                match.setStatus("disputed");
            }
        }

        matchRepository.save(match);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("matchStatus", match.getStatus());
        response.put("winnerId", match.getWinnerId());
        
        if ("validated".equals(match.getStatus())) {
            Tournament t = tournamentRepository.findById(match.getTournamentId()).orElse(null);
            response.put("tournamentFinished", t != null && "finished".equals(t.getStatus()));
        } else {
            response.put("tournamentFinished", false);
        }
        
        return response;
    }

    @Override
    public List<Map<String, Object>> getUserHistory(Long userId) {
        List<Tournament> history = tournamentRepository.findTournamentsByUserId(userId);
        return history.stream().map(t -> {
            Map<String, Object> map = new HashMap<>();
            map.put("tournament", t);
            teamRepository.findByTournamentIdAndUserId(t.getId(), userId).ifPresent(team -> {
                map.put("team", team);
            });
            return map;
        }).collect(Collectors.toList());
    }

    @Override
    public List<Map<String, Object>> getUserBadges(Long userId) {
        return badgeRepository.findByUserId(userId).stream().map(b -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", b.getId());
            map.put("badge_type", b.getBadgeType());
            map.put("awarded_at", b.getAwardedAt());
            if (b.getTournamentId() != null) {
                tournamentRepository.findById(b.getTournamentId())
                        .ifPresent(t -> map.put("tournament_name", t.getName()));
            }
            return map;
        }).collect(Collectors.toList());
    }

    @Override
    public List<Map<String, Object>> getRecentChampions() {
        List<Tournament> history = tournamentRepository.findByStatusOrderByStartsAtDesc("finished");
        return history.stream().limit(10).map(t -> {
            Map<String, Object> map = new HashMap<>();
            map.put("tournament_name", t.getName());
            map.put("date", t.getStartsAt());

            // Find winner match
            List<TournamentMatch> matches = matchRepository.findByTournamentIdOrderByRoundAscMatchOrderAsc(t.getId());
            if (!matches.isEmpty()) {
                TournamentMatch finalMatch = matches.get(matches.size() - 1);
                if (finalMatch.getWinnerId() != null) {
                    teamRepository.findById(finalMatch.getWinnerId()).ifPresent(team -> {
                        map.put("winner_team", team.getName());
                    });
                }
            }
            return map;
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public Map<String, Object> addTeamFriends(Integer teamId, Long userId) {
        List<TournamentTeamMember> members = memberRepository.findByTeamId(teamId);
        int count = 0;
        for (TournamentTeamMember m : members) {
            if (!m.getUserId().equals(userId)) {
                // Simplified friendship request logic for demo
                FriendshipRequest req = new FriendshipRequest();
                req.setSenderId(userId);
                req.setReceiverId(m.getUserId());
                req.setStatus("pending");
                friendshipRequestRepository.save(req);
                count++;
            }
        }
        return Map.of("success", true, "sent", count);
    }

    @Override
    public List<Map<String, Object>> getTeamChat(Integer teamId, Long userId) {
        if (!memberRepository.existsByTeamIdAndUserId(teamId, userId)) {
            throw new RuntimeException("Not in this team");
        }
        return chatRepository.findByTeamIdOrderByCreatedAtAsc(teamId).stream().map(c -> {
            User u = userRepository.findById(c.getUserId()).orElse(null);
            Map<String, Object> map = new HashMap<>();
            map.put("id", c.getId());
            map.put("content", c.getContent());
            map.put("created_at", c.getCreatedAt());
            map.put("user_id", c.getUserId());
            map.put("username", u != null ? u.getUsername() : "Unknown");
            map.put("avatar", u != null && u.getAvatar() != null ? u.getAvatar() : "img/default.png");
            return map;
        }).collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> sendTeamMessage(Integer teamId, Long userId, String content) {
        if (!memberRepository.existsByTeamIdAndUserId(teamId, userId)) {
            return Map.of("success", false, "message", "Not in this team");
        }
        TournamentTeamChat chat = new TournamentTeamChat();
        chat.setTeamId(teamId);
        chat.setUserId(userId);
        chat.setContent(content);
        chatRepository.save(chat);
        return Map.of("success", true);
    }

    @Override
    public List<Map<String, Object>> getNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream().map(n -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", n.getId());
            map.put("type", n.getType());
            map.put("message", n.getMessage());
            map.put("is_read", n.getIsRead());
            map.put("created_at", n.getCreatedAt());
            map.put("link", n.getLink() != null ? n.getLink() : "");
            return map;
        }).collect(Collectors.toList());
    }

    @Override
    public void markNotificationRead(Integer notificationId, Long userId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            if (n.getUserId().equals(userId)) {
                n.setIsRead(true);
                notificationRepository.save(n);
            }
        });
    }

    @Override
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

    @Override
    @Transactional
    public Map<String, Object> generateBracket(Integer tournamentId) {
        Tournament t = tournamentRepository.findById(tournamentId).orElseThrow();
        List<TournamentTeam> teams = teamRepository.findByTournamentIdOrderBySeedAsc(tournamentId);

        if (teams.size() >= 2) {
            t.setFormat("final");
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

    @Scheduled(cron = "0 0 * * * *") // Cada hora en punto
    public void scheduledTournamentTask() {
        Optional<Tournament> active = tournamentRepository.findActiveTournament();
        if (active.isPresent() && "open".equals(active.get().getStatus())) {
            Tournament t = active.get();
            // Verifica si falta 1 hora o menos para el inicio del torneo
            if (java.time.LocalDateTime.now().plusHours(1).isAfter(t.getStartsAt())
                    || java.time.LocalDateTime.now().plusHours(1).isEqual(t.getStartsAt())) {
                this.closeAndGenerateTeams(t.getId());
                this.generateBracket(t.getId());
                System.out.println("Cron ejecutado: Torneo " + t.getId()
                        + " cerrado y generado bracket mediante Snake Algorithm.");
            }
        }
    }
}
