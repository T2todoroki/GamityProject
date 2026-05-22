package com.gamity.gamity_api.service;

import com.gamity.gamity_api.domain.dto.MessageDTO;
import java.util.List;

public interface MessageService {
    void sendMessage(Long senderId, Long receiverId, String content);
    List<MessageDTO> getConversation(Long userId1, Long userId2);
    void clearConversation(Long userId, Long otherId);
    void markMessagesAsRead(Long senderId, Long receiverId);
    void markMessagesAsDelivered(Long receiverId);
    long getUnreadCount(Long userId);
}
