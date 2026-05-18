package com.gamity.gamity_api.repository;

import com.gamity.gamity_api.domain.entity.TournamentRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TournamentRegistrationRepository extends JpaRepository<TournamentRegistration, Integer> {

    int countByTournamentId(Integer tournamentId);

    boolean existsByTournamentIdAndUserId(Integer tournamentId, Long userId);

    Optional<TournamentRegistration> findByTournamentIdAndUserId(Integer tournamentId, Long userId);

    List<TournamentRegistration> findByTournamentId(Integer tournamentId);

    List<TournamentRegistration> findByUserId(Long userId);
}
