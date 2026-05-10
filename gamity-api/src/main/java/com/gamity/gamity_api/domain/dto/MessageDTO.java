package com.gamity.gamity_api.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageDTO {
    private Long id;
    
    @JsonProperty("sender_id")
    private Long senderId;
    
    @JsonProperty("receiver_id")
    private Long receiverId;
    
    @JsonProperty("sender_name")
    private String senderName;
    
    private String content;
    
    @JsonProperty("created_at")
    private LocalDateTime createdAt;
}
