package com.gamity.gamity_api.repository;

import com.gamity.gamity_api.domain.entity.Tournament;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface TournamentRepository extends JpaRepository<Tournament, Integer> {

    // Torneo activo con inscripciones abiertas
    @Query("SELECT t FROM Tournament t WHERE t.status = 'open' AND t.registrationClosesAt > CURRENT_TIMESTAMP ORDER BY t.registrationClosesAt ASC")
    Optional<Tournament> findActiveTournament();

    // Torneos completados (historial)
    List<Tournament> findByStatusOrderByStartsAtDesc(String status);

    // Torneos donde un usuario ha participado (para historial)
    @Query("SELECT DISTINCT t FROM Tournament t " +
            "JOIN TournamentRegistration r ON r.tournamentId = t.id " +
            "WHERE r.userId = :userId AND t.status IN ('completed', 'in_progress', 'finished', 'active', 'awaiting_reports') " +
            "ORDER BY t.startsAt DESC")
    List<Tournament> findTournamentsByUserId(Long userId);
}
