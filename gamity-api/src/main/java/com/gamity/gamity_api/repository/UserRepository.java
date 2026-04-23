package com.gamity.gamity_api.repository;

import com.gamity.gamity_api.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    //'SELECT DISTINCT' elimina los usuarios repetidos debido a cruces de tablas múltiples.
    //Además, usamos subquerys controladas para asegurar que no nos devuelva usuarios que ya hemos cruzado o solicitado.
    @Query("SELECT DISTINCT u FROM User u " +
           "LEFT JOIN u.profile p " +
           "WHERE u.id != :currentUserId " +
           "AND u.role = 'user' " +
           "AND (:game IS NULL OR p.mainGame LIKE %:game%) " +
           "AND (:ranks IS NULL OR p.gameRank IN :ranks) " +
           "AND (:attitude IS NULL OR p.attitude = :attitude) " +
           "AND u.id NOT IN (SELECT f.receiverId FROM FriendshipRequest f WHERE f.senderId = :currentUserId) " +
           "AND u.id NOT IN (SELECT f.senderId FROM FriendshipRequest f WHERE f.receiverId = :currentUserId)")
           
    List<User> findPotentialMatches(
            @Param("currentUserId") Long currentUserId,
            @Param("game") String game,
            @Param("ranks") List<String> ranks,
            @Param("attitude") String attitude
    );

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    List<User> findByStatus(String status);
}
