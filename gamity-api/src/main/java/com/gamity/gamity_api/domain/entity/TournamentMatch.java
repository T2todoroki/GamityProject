package com.gamity.gamity_api.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tournament_matches")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TournamentMatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "tournament_id", nullable = false)
    private Integer tournamentId;

    // round 1 = cuartos, 2 = semis, 3 = final (o 1=final si solo 2 equipos)
    @Column(nullable = false)
    private Integer round;

    @Column(name = "match_order", nullable = false)
    private Integer matchOrder;

    @Column(name = "team1_id")
    private Integer team1Id;

    @Column(name = "team2_id")
    private Integer team2Id;

    @Column(name = "winner_id")
    private Integer winnerId;

    @Column(name = "team1_reported_winner")
    private Integer team1ReportedWinner;

    @Column(name = "team2_reported_winner")
    private Integer team2ReportedWinner;

    // pending, awaiting_reports, validated, disputed
    @Column(nullable = false, length = 20)
    private String status;

    @Column(name = "next_match_id")
    private Integer nextMatchId;
}
