package com.gamity.gamity_api.repository;

import com.gamity.gamity_api.domain.entity.FriendshipRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FriendshipRequestRepository extends JpaRepository<FriendshipRequest, Long> {

    // Solicitudes pendientes para un usuario (él es el receptor)
    List<FriendshipRequest> findByReceiverIdAndStatus(Long receiverId, String status);

    // Amistades aceptadas (para saber con quién puede chatear)
    List<FriendshipRequest> findBySenderIdAndStatusOrReceiverIdAndStatus(
            Long senderId, String status1, Long receiverId, String status2);

    // Consulta para validar si dos usuarios concretos son amigos
    @org.springframework.data.jpa.repository.Query("SELECT COUNT(f) FROM FriendshipRequest f WHERE ((f.senderId = :user1 AND f.receiverId = :user2) OR (f.senderId = :user2 AND f.receiverId = :user1)) AND f.status = 'accepted'")
    long countAcceptedFriendship(@org.springframework.data.repository.query.Param("user1") Long user1, @org.springframework.data.repository.query.Param("user2") Long user2);
}