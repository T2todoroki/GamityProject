package com.gamity.gamity_api.service;

import com.gamity.gamity_api.domain.dto.FriendDTO;
import com.gamity.gamity_api.domain.dto.FriendshipResponseDTO;

import java.util.List;

public interface FriendshipService {

    List<FriendshipResponseDTO> getPendingRequests(Long userId);

    void respondToRequest(Long requestId, String decision);

    void sendRequest(Long senderId, Long receiverId);

    List<FriendDTO> getFriends(Long userId);
}
