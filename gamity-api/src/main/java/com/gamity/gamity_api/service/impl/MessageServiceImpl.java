package com.gamity.gamity_api.service.impl;

import com.gamity.gamity_api.domain.dto.MessageDTO;
import com.gamity.gamity_api.domain.entity.Message;
import com.gamity.gamity_api.domain.entity.User;
import com.gamity.gamity_api.repository.FriendshipRequestRepository;
import com.gamity.gamity_api.repository.MessageRepository;
import com.gamity.gamity_api.repository.UserRepository;
import com.gamity.gamity_api.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final FriendshipRequestRepository friendshipRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public void sendMessage(Long senderId, Long receiverId, String content) {
        if (content == null || content.trim().isEmpty()) {
            throw new RuntimeException("El mensaje no puede estar vacío");
        }

        // VALIDACIÓN DE SEGURIDAD: Comprobar el nivel de amistad
        long friendshipCount = friendshipRepository.countAcceptedFriendship(senderId, receiverId);
        if (friendshipCount == 0) {
            throw new RuntimeException("No puedes enviar mensajes a usuarios que no son tus amigos");
        }

        Message message = Message.builder()
                .senderId(senderId)
                .receiverId(receiverId)
                .content(content.trim())
                .build();
        
        messageRepository.save(message);
    }

    @Override
    public List<MessageDTO> getConversation(Long userId1, Long userId2) {
        List<Message> messages = messageRepository.findConversation(userId1, userId2);
        
        return messages.stream().map(msg -> {
            User sender = userRepository.findById(msg.getSenderId()).orElse(null);
            String senderName = sender != null ? sender.getUsername() : "Unknown";
            
            return MessageDTO.builder()
                    .id(msg.getId())
                    .senderId(msg.getSenderId())
                    .receiverId(msg.getReceiverId())
                    .senderName(senderName)
                    .content(msg.getContent())
                    .createdAt(msg.getCreatedAt())
                    .build();
        }).collect(Collectors.toList());
    }
}
