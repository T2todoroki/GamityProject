package com.gamity.gamity_api.service;

import java.util.Map;

public interface BlockService {
    Map<String, Object> blockUser(Long blockerId, Long blockedId);
    Map<String, Object> unblockUser(Long blockerId, Long blockedId);
    Map<String, Object> getBlockStatus(Long userId1, Long userId2);
}
