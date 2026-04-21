package com.gamity.gamity_api.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "friendship_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FriendshipRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sender_id")
    private Long senderId;

    @Column(name = "receiver_id")
    private Long receiverId;

    private String status;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;
}