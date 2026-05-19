package com.gamity.gamity_api.repository;

import com.gamity.gamity_api.domain.entity.TournamentTeamChat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TournamentTeamChatRepository extends JpaRepository<TournamentTeamChat, Integer> {

    List<TournamentTeamChat> findByTeamIdOrderByCreatedAtAsc(Integer teamId);
}
