package com.gamity.gamity_api.repository;

import com.gamity.gamity_api.domain.entity.TournamentTeamMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TournamentTeamMemberRepository extends JpaRepository<TournamentTeamMember, Integer> {

    List<TournamentTeamMember> findByTeamId(Integer teamId);

    boolean existsByTeamIdAndUserId(Integer teamId, Long userId);
}
