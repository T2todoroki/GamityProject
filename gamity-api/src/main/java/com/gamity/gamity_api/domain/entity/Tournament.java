package com.gamity.gamity_api.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "tournaments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tournament {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String name;

    // open, closed, in_progress, completed, cancelled
    @Column(nullable = false, length = 20)
    private String status;

    @Column(name = "max_players", nullable = false)
    private Integer maxPlayers;

    @Column(name = "registration_opens_at", nullable = false)
    private LocalDateTime registrationOpensAt;

    @Column(name = "registration_closes_at", nullable = false)
    private LocalDateTime registrationClosesAt;

    @Column(name = "starts_at", nullable = false)
    private LocalDateTime startsAt;

    // final, semifinals, quarterfinals
    @Column(length = 20)
    private String format;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
