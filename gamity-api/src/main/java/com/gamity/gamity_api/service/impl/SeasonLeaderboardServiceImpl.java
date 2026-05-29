package com.gamity.gamity_api.service.impl;

import com.gamity.gamity_api.domain.entity.User;
import com.gamity.gamity_api.domain.entity.UserBadge;
import com.gamity.gamity_api.repository.UserBadgeRepository;
import com.gamity.gamity_api.repository.UserRepository;
import com.gamity.gamity_api.service.SeasonLeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SeasonLeaderboardServiceImpl implements SeasonLeaderboardService {

    private final UserRepository userRepository;
    private final UserBadgeRepository badgeRepository;

    @Override
    public List<Map<String, Object>> getTopPlayers() {

        List<User> topUsers = userRepository.findAll().stream()
                .filter(u -> "user".equals(u.getRole()) || "demo".equals(u.getRole()))
                .sorted((u1, u2) -> Integer.compare(
                        u2.getPremierWins() != null ? u2.getPremierWins() : 0,
                        u1.getPremierWins() != null ? u1.getPremierWins() : 0))
                .limit(10)
                .collect(Collectors.toList());

        return topUsers.stream()
                .filter(u -> u.getPremierWins() != null && u.getPremierWins() > 0)
                .filter(u -> !u.getUsername().startsWith("Bot_"))
                .map(u -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("username", u.getUsername());
                    map.put("avatar", u.getAvatar() != null ? u.getAvatar() : "img/default.png");
                    map.put("premier_wins", u.getPremierWins());
                    
                    List<UserBadge> badges = badgeRepository.findByUserId(u.getId());
                    List<String> badgeTypes = badges.stream().map(UserBadge::getBadgeType).collect(Collectors.toList());
                    map.put("badges", badgeTypes);
                    
                    return map;
                }).collect(Collectors.toList());
    }

    /**
     * Se ejecuta el día 1 de cada mes a las 00:00.
     * 
     */
    @Override
    @Transactional
    @Scheduled(cron = "0 0 0 1 * ?")
    public void processMonthlySeasonReset() {
        List<User> topUsers = userRepository.findAll().stream()
                .filter(u -> "user".equals(u.getRole()) || "demo".equals(u.getRole()))
                .sorted((u1, u2) -> Integer.compare(
                        u2.getPremierWins() != null ? u2.getPremierWins() : 0,
                        u1.getPremierWins() != null ? u1.getPremierWins() : 0))
                .limit(10)
                .collect(Collectors.toList());

        for (int i = 0; i < topUsers.size(); i++) {
            User user = topUsers.get(i);

            // Si no tiene victorias, no damos medallas
            if (user.getPremierWins() == null || user.getPremierWins() == 0) {
                continue;
            }

            UserBadge badge = new UserBadge();
            badge.setUserId(user.getId());

            // Top 3 = GOLD, 4-10 = SILVER
            if (i < 3) {
                badge.setBadgeType("PREMIER_GOLD");
            } else {
                badge.setBadgeType("PREMIER_SILVER");
            }
            badgeRepository.save(badge);
        }

        // Reiniciar las victorias de todos los usuarios
        List<User> allUsers = userRepository.findAll();
        for (User u : allUsers) {
            if (u.getPremierWins() != null && u.getPremierWins() > 0) {
                u.setPremierWins(0);
                userRepository.save(u);
            }
        }

        System.out.println("Cron ejecutado: Temporada reiniciada y medallas entregadas.");
    }
}
