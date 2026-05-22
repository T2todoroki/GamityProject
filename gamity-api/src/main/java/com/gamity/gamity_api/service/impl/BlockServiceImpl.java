package com.gamity.gamity_api.service.impl;

import com.gamity.gamity_api.domain.entity.Block;
import com.gamity.gamity_api.repository.BlockRepository;
import com.gamity.gamity_api.service.BlockService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BlockServiceImpl implements BlockService {

    private final BlockRepository blockRepository;
    private final com.gamity.gamity_api.repository.UserRepository userRepository;

    @Override
    public Map<String, Object> blockUser(Long blockerId, Long blockedId) {
        Map<String, Object> response = new HashMap<>();

        if (blockRepository.existsByBlockerIdAndBlockedId(blockerId, blockedId)) {
            response.put("success", false);
            response.put("message", "User is already blocked");
            return response;
        }

        Block block = Block.builder()
                .blockerId(blockerId)
                .blockedId(blockedId)
                .build();

        blockRepository.save(block);

        response.put("success", true);
        response.put("message", "User blocked successfully");
        return response;
    }

    @Override
    public Map<String, Object> unblockUser(Long blockerId, Long blockedId) {
        Map<String, Object> response = new HashMap<>();

        Optional<Block> blockOptional = blockRepository.findByBlockerIdAndBlockedId(blockerId, blockedId);

        if (blockOptional.isPresent()) {
            blockRepository.delete(blockOptional.get());
            response.put("success", true);
            response.put("message", "User unblocked successfully");
        } else {
            response.put("success", false);
            response.put("message", "User is not blocked");
        }

        return response;
    }

    @Override
    public Map<String, Object> getBlockStatus(Long userId1, Long userId2) {
        Map<String, Object> response = new HashMap<>();

        boolean user1BlockedUser2 = blockRepository.existsByBlockerIdAndBlockedId(userId1, userId2);
        boolean user2BlockedUser1 = blockRepository.existsByBlockerIdAndBlockedId(userId2, userId1);

        String friendStatus = userRepository.findById(userId2)
                .map(com.gamity.gamity_api.domain.entity.User::getStatus)
                .orElse("offline");

        response.put("isBlockedByMe", user1BlockedUser2);
        response.put("hasBlockedMe", user2BlockedUser1);
        response.put("friendStatus", friendStatus);

        return response;
    }
}
