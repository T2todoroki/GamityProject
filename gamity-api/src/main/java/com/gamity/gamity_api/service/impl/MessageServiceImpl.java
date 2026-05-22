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
import com.gamity.gamity_api.repository.BlockRepository;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.jdbc.core.JdbcTemplate;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final FriendshipRequestRepository friendshipRepository;
    private final UserRepository userRepository;
    private final BlockRepository blockRepository;
    private final JdbcTemplate jdbcTemplate;

    @EventListener(ApplicationReadyEvent.class)
    public void initDatabase() {
        jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS blocks (" +
                "id BIGINT AUTO_INCREMENT PRIMARY KEY, " +
                "blocker_id BIGINT NOT NULL, " +
                "blocked_id BIGINT NOT NULL, " +
                "created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, " +
                "UNIQUE KEY uk_blocker_blocked (blocker_id, blocked_id))");
        try {
            jdbcTemplate.execute("ALTER TABLE messages ADD COLUMN is_read BOOLEAN NOT NULL DEFAULT FALSE");
            jdbcTemplate.execute("ALTER TABLE messages ADD COLUMN is_delivered BOOLEAN NOT NULL DEFAULT FALSE");
            jdbcTemplate.execute("ALTER TABLE messages ADD COLUMN deleted_by_sender BOOLEAN NOT NULL DEFAULT FALSE");
            jdbcTemplate.execute("ALTER TABLE messages ADD COLUMN deleted_by_receiver BOOLEAN NOT NULL DEFAULT FALSE");
        } catch (Exception e) {
            // Ignorar si ya existen
        }
    }

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

        // VALIDACIÓN DE BLOQUEO
        if (blockRepository.existsByBlockerIdAndBlockedId(senderId, receiverId)) {
            // El usuario remitente ha bloqueado al destinatario. No debería poder enviar mensajes.
            throw new RuntimeException("Has bloqueado a este usuario. Desbloquéalo para enviar mensajes.");
        }
        
        boolean isBlockedByReceiver = blockRepository.existsByBlockerIdAndBlockedId(receiverId, senderId);

        Message message = Message.builder()
                .senderId(senderId)
                .receiverId(receiverId)
                .content(content.trim())
                .isRead(false)
                .isDelivered(false)
                .deletedBySender(false)
                .deletedByReceiver(isBlockedByReceiver) // MAGIA: Si está bloqueado, el mensaje se guarda oculto para el destinatario
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
                    .isRead(msg.isRead())
                    .isDelivered(msg.isDelivered())
                    .build();
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void clearConversation(Long userId, Long otherId) {
        // userId es quien presiona vaciar. Si yo (userId) borro mensajes enviados a otherId, actualizo deleted_by_sender.
        // Si yo (userId) borro mensajes que otherId me envió a mí, actualizo deleted_by_receiver.
        messageRepository.markAsDeletedBySender(userId, otherId);
        messageRepository.markAsDeletedByReceiver(userId, otherId);
        messageRepository.deletePermanently();
    }

    @Override
    @Transactional
    public void markMessagesAsRead(Long senderId, Long receiverId) {
        messageRepository.markAsRead(senderId, receiverId);
    }

    @Override
    @Transactional
    public void markMessagesAsDelivered(Long receiverId) {
        messageRepository.markAsDelivered(receiverId);
    }

    @Override
    public long getUnreadCount(Long userId) {
        return messageRepository.countUnreadForUser(userId);
    }
}
