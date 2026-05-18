package com.gamity.gamity_api.repository;

import com.gamity.gamity_api.domain.entity.TournamentTeam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TournamentTeamRepository extends JpaRepository<TournamentTeam, Integer> {

    List<TournamentTeam> findByTournamentIdOrderBySeedAsc(Integer tournamentId);

    // Encontrar el equipo de un usuario en un torneo
    @Query("SELECT t FROM TournamentTeam t " +
           "JOIN TournamentTeamMember m ON m.teamId = t.id " +
           "WHERE t.tournamentId = :tournamentId AND m.userId = :userId")
    Optional<TournamentTeam> findByTournamentIdAndUserId(Integer tournamentId, Long userId);
}
