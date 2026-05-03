package com.gamity.gamity_api.service.impl;

import com.gamity.gamity_api.domain.dto.FriendDTO;
import com.gamity.gamity_api.domain.dto.FriendshipResponseDTO;
import com.gamity.gamity_api.domain.entity.FriendshipRequest;
import com.gamity.gamity_api.domain.entity.User;
import com.gamity.gamity_api.domain.entity.UserProfile;
import com.gamity.gamity_api.repository.FriendshipRequestRepository;
import com.gamity.gamity_api.repository.UserRepository;
import com.gamity.gamity_api.service.FriendshipService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FriendshipServiceImpl implements FriendshipService {

    private final FriendshipRequestRepository friendshipRepo;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<FriendshipResponseDTO> getPendingRequests(Long userId) {
        List<FriendshipRequest> pending = friendshipRepo.findByReceiverIdAndStatus(userId, "pending");

        // Mapear cada solicitud a un DTO enriquecido con datos del sender
        return pending.stream().map(req -> {
            // Enriquecer cada solicitud con datos del sender
            User sender = userRepository.findById(req.getSenderId()).orElse(null);
            FriendshipResponseDTO dto = new FriendshipResponseDTO();
            dto.setId(req.getId());
            dto.setSenderId(req.getSenderId());
            dto.setStatus(req.getStatus());
            dto.setSentAt(req.getSentAt() != null ? req.getSentAt().toString() : null);

            if (sender != null) {
                dto.setSenderUsername(sender.getUsername());
                dto.setSenderAvatar(sender.getAvatar());
                UserProfile profile = sender.getProfile();
                if (profile != null) {
                    dto.setSenderMainGame(profile.getMainGame());
                    dto.setSenderGameRank(profile.getGameRank());
                }
            }
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void respondToRequest(Long requestId, String decision) {
        FriendshipRequest request = friendshipRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada con ID: " + requestId));

        if (!"pending".equals(request.getStatus())) {
            throw new RuntimeException("La solicitud ya fue procesada anteriormente");
        }

        // Solo aceptamos "accepted" o "rejected"
        if (!"accepted".equals(decision) && !"rejected".equals(decision)) {
            throw new RuntimeException("Decisión inválida. Usa 'accepted' o 'rejected'");
        }

        request.setStatus(decision);
        friendshipRepo.save(request);
    }

    @Override
    @Transactional
    public void sendRequest(Long senderId, Long receiverId) {
        if (senderId.equals(receiverId)) {
            throw new RuntimeException("No puedes enviarte una solicitud a ti mismo");
        }

        // Verificar que ambos usuarios existen
        if (!userRepository.existsById(senderId)) {
            throw new RuntimeException("El remitente no existe");
        }
        if (!userRepository.existsById(receiverId)) {
            throw new RuntimeException("El destinatario no existe");
        }

        // Verificar que no exista una solicitud pendiente o amistad existente
        FriendshipRequest request = new FriendshipRequest();
        request.setSenderId(senderId);
        request.setReceiverId(receiverId);
        request.setStatus("pending");
        request.setSentAt(LocalDateTime.now());

        friendshipRepo.save(request);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FriendDTO> getFriends(Long userId) {
        // Buscar amistades aceptadas donde el usuario es sender O receiver
        List<FriendshipRequest> accepted = friendshipRepo
                .findBySenderIdAndStatusOrReceiverIdAndStatus(userId, "accepted", userId, "accepted");

        // Mapear cada solicitud aceptada a un DTO de amigo, obteniendo los datos del "otro" usuario
        return accepted.stream().map(req -> {
            // El amigo es el "otro" usuario en la relación
            Long friendId = req.getSenderId().equals(userId) ? req.getReceiverId() : req.getSenderId();
            User friend = userRepository.findById(friendId).orElse(null);

            if (friend == null) return null;

            // Mapear a DTO de amigo con datos enriquecidos
            FriendDTO dto = new FriendDTO();
            dto.setId(friend.getId());
            dto.setUsername(friend.getUsername());
            dto.setAvatar(friend.getAvatar());
            dto.setStatus(friend.getStatus() != null ? friend.getStatus() : "offline");

            // Enriquecer con datos del perfil del amigo
            UserProfile profile = friend.getProfile();
            if (profile != null) {
                dto.setMainGame(profile.getMainGame());
                dto.setGameRank(profile.getGameRank());
            }

            return dto;
        }).filter(dto -> dto != null).collect(Collectors.toList());
    }
}

