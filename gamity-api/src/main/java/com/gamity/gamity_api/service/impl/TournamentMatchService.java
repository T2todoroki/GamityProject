package com.gamity.gamity_api.service.impl;

import com.gamity.gamity_api.domain.entity.*;
import com.gamity.gamity_api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class TournamentMatchService {

    private final TournamentMatchRepository matchRepository;
    private final TournamentTeamRepository teamRepository;
    private final TournamentRepository tournamentRepository;
    private final TournamentTeamMemberRepository memberRepository;
    private final UserRepository userRepository;
    private final UserBadgeRepository badgeRepository;
    private final NotificationRepository notificationRepository;

    public Map<String, Object> getBracket(Integer tournamentId) {
        List<TournamentMatch> matches = matchRepository.findByTournamentIdOrderByRoundAscMatchOrderAsc(tournamentId);
        return Map.of("matches", matches);
    }

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
                        if (user != null && !user.getUsername().startsWith("Bot_")) {
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
}
