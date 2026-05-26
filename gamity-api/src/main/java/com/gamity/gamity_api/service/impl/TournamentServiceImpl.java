package com.gamity.gamity_api.service.impl;

import com.gamity.gamity_api.service.TournamentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TournamentServiceImpl implements TournamentService {

    private final TournamentQueueService queueService;
    private final TournamentTeamBalancerService balancerService;
    private final TournamentMatchService matchService;
    private final TournamentTeamInteractionService interactionService;
    private final TournamentUserContextService contextService;

    @Override
    public Map<String, Object> getActiveTournament(Long userId) {
        return queueService.getActiveTournament(userId);
    }

    @Override
    public Map<String, Object> registerUser(Integer tournamentId, Long userId) {
        return queueService.registerUser(tournamentId, userId);
    }

    @Override
    public Map<String, Object> unregisterUser(Integer tournamentId, Long userId) {
        return queueService.unregisterUser(tournamentId, userId);
    }

    @Override
    public Map<String, Object> forceMatchmaking(Long userId) {
        return queueService.forceMatchmaking(userId);
    }

    @Override
    public Map<String, Object> getMyTeam(Integer tournamentId, Long userId) {
        return interactionService.getMyTeam(tournamentId, userId);
    }

    @Override
    public Map<String, Object> changeTeamName(Integer teamId, Long userId, String newName) {
        return interactionService.changeTeamName(teamId, userId, newName);
    }

    @Override
    public Map<String, Object> getBracket(Integer tournamentId) {
        return matchService.getBracket(tournamentId);
    }

    @Override
    public Map<String, Object> reportResult(Integer matchId, Long userId, Integer winnerTeamId) {
        return matchService.reportResult(matchId, userId, winnerTeamId);
    }

    @Override
    public List<Map<String, Object>> getUserHistory(Long userId) {
        return contextService.getUserHistory(userId);
    }

    @Override
    public List<Map<String, Object>> getUserBadges(Long userId) {
        return contextService.getUserBadges(userId);
    }

    @Override
    public Map<String, Object> addTeamFriends(Integer teamId, Long userId) {
        return interactionService.addTeamFriends(teamId, userId);
    }

    @Override
    public List<Map<String, Object>> getTeamChat(Integer teamId, Long userId) {
        return interactionService.getTeamChat(teamId, userId);
    }

    @Override
    public Map<String, Object> sendTeamMessage(Integer teamId, Long userId, String content) {
        return interactionService.sendTeamMessage(teamId, userId, content);
    }

    @Override
    public List<Map<String, Object>> getNotifications(Long userId) {
        return contextService.getNotifications(userId);
    }

    @Override
    public void markNotificationRead(Integer notificationId, Long userId) {
        contextService.markNotificationRead(notificationId, userId);
    }

    @Override
    public Map<String, Object> closeAndGenerateTeams(Integer tournamentId) {
        return balancerService.closeAndGenerateTeams(tournamentId);
    }

    @Override
    public Map<String, Object> generateBracket(Integer tournamentId) {
        return balancerService.generateBracket(tournamentId);
    }
}
