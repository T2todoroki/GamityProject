package com.gamity.gamity_api.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_badges")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserBadge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    // CHAMPION, TRIPLE_CROWN, VETERAN
    @Column(name = "badge_type", nullable = false, length = 50)
    private String badgeType;

    @CreationTimestamp
    @Column(name = "awarded_at", nullable = false, updatable = false)
    private LocalDateTime awardedAt;

    @Column(name = "tournament_id")
    private Integer tournamentId;
}
