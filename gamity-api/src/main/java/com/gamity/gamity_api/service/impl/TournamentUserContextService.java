package com.gamity.gamity_api.service.impl;

import com.gamity.gamity_api.domain.entity.*;
import com.gamity.gamity_api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TournamentUserContextService {

    private final TournamentRepository tournamentRepository;
    private final TournamentTeamRepository teamRepository;
    private final UserBadgeRepository badgeRepository;
    private final NotificationRepository notificationRepository;

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

    public void markNotificationRead(Integer notificationId, Long userId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            if (n.getUserId().equals(userId)) {
                n.setIsRead(true);
                notificationRepository.save(n);
            }
        });
    }
}
