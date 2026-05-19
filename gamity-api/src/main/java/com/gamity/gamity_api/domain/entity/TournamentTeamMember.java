package com.gamity.gamity_api.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tournament_team_members",
       uniqueConstraints = @UniqueConstraint(columnNames = {"team_id", "user_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TournamentTeamMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "team_id", nullable = false)
    private Integer teamId;

    @Column(name = "user_id", nullable = false)
    private Long userId;
}
