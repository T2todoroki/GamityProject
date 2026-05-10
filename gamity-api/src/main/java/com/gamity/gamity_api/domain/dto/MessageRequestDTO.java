package com.gamity.gamity_api.domain.dto;

import lombok.Data;

@Data
public class MessageRequestDTO {
    private Long receiver_id;
    private String content;
    private Long sender_id;
}
