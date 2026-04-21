package com.gamity.gamity_api.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FriendshipResponseDTO {
    private Long id;
    private Long senderId;
    private String senderUsername;
    private String senderAvatar;
    private String senderMainGame;
    private String senderGameRank;
    private String status;
    private String sentAt;
}