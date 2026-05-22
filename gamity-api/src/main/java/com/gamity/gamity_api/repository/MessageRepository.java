package com.gamity.gamity_api.repository;

import com.gamity.gamity_api.domain.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("SELECT m FROM Message m WHERE " +
           "((m.senderId = :user1 AND m.receiverId = :user2 AND m.deletedBySender = false) " +
           "OR (m.senderId = :user2 AND m.receiverId = :user1 AND m.deletedByReceiver = false)) " +
           "ORDER BY m.createdAt ASC")
    List<Message> findConversation(@Param("user1") Long user1, @Param("user2") Long user2);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.transaction.annotation.Transactional
    @Query("UPDATE Message m SET m.isDelivered = true WHERE m.receiverId = :receiverId AND m.isDelivered = false")
    void markAsDelivered(@Param("receiverId") Long receiverId);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.transaction.annotation.Transactional
    @Query("UPDATE Message m SET m.isRead = true WHERE m.senderId = :senderId AND m.receiverId = :receiverId AND m.isRead = false")
    void markAsRead(@Param("senderId") Long senderId, @Param("receiverId") Long receiverId);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.transaction.annotation.Transactional
    @Query("UPDATE Message m SET m.deletedBySender = true WHERE m.senderId = :userId AND m.receiverId = :otherId")
    void markAsDeletedBySender(@Param("userId") Long userId, @Param("otherId") Long otherId);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.transaction.annotation.Transactional
    @Query("UPDATE Message m SET m.deletedByReceiver = true WHERE m.receiverId = :userId AND m.senderId = :otherId")
    void markAsDeletedByReceiver(@Param("userId") Long userId, @Param("otherId") Long otherId);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.transaction.annotation.Transactional
    @Query("DELETE FROM Message m WHERE m.deletedBySender = true AND m.deletedByReceiver = true")
    void deletePermanently();

    @Query("SELECT COUNT(DISTINCT m.senderId) FROM Message m WHERE m.receiverId = :userId AND m.isRead = false AND m.deletedByReceiver = false")
    long countUnreadForUser(@Param("userId") Long userId);

    @Query("SELECT COUNT(m) FROM Message m WHERE m.senderId = :senderId AND m.receiverId = :receiverId AND m.isRead = false AND m.deletedByReceiver = false")
    long countUnreadFromUser(@Param("senderId") Long senderId, @Param("receiverId") Long receiverId);
}
