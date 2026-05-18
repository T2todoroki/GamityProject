package com.gamity.gamity_api.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "tournament_teams")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TournamentTeam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "tournament_id", nullable = false)
    private Integer tournamentId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "captain_id")
    private Long captainId;

    // Seed para el bracket (1 = mejor rango medio)
    @Column
    private Integer seed;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
