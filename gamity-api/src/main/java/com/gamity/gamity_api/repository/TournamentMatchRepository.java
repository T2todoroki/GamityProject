package com.gamity.gamity_api.repository;

import com.gamity.gamity_api.domain.entity.TournamentMatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TournamentMatchRepository extends JpaRepository<TournamentMatch, Integer> {

    List<TournamentMatch> findByTournamentIdOrderByRoundAscMatchOrderAsc(Integer tournamentId);

    // Partida pendiente donde participa un equipo
    @Query("SELECT m FROM TournamentMatch m " +
           "WHERE (m.team1Id = :teamId OR m.team2Id = :teamId) " +
           "AND m.status IN ('awaiting_reports', 'pending') " +
           "ORDER BY m.round ASC")
    Optional<TournamentMatch> findPendingMatchByTeamId(Integer teamId);

    // Partidas de una ronda
    List<TournamentMatch> findByTournamentIdAndRoundOrderByMatchOrderAsc(Integer tournamentId, Integer round);
}
