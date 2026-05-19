package com.gamity.gamity_api.repository;

import com.gamity.gamity_api.domain.entity.UserBadge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserBadgeRepository extends JpaRepository<UserBadge, Integer> {

    List<UserBadge> findByUserId(Long userId);

    int countByUserIdAndBadgeType(Long userId, String badgeType);

    boolean existsByUserIdAndBadgeTypeAndTournamentId(Long userId, String badgeType, Integer tournamentId);
}
