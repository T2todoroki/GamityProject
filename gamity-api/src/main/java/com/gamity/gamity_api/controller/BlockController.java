package com.gamity.gamity_api.controller;

import com.gamity.gamity_api.service.BlockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/blocks")
@RequiredArgsConstructor
public class BlockController {

    private final BlockService blockService;

    @PostMapping("/{blockerId}/{blockedId}")
    public ResponseEntity<Map<String, Object>> blockUser(
            @PathVariable Long blockerId,
            @PathVariable Long blockedId) {
        return ResponseEntity.ok(blockService.blockUser(blockerId, blockedId));
    }

    @DeleteMapping("/{blockerId}/{blockedId}")
    public ResponseEntity<Map<String, Object>> unblockUser(
            @PathVariable Long blockerId,
            @PathVariable Long blockedId) {
        return ResponseEntity.ok(blockService.unblockUser(blockerId, blockedId));
    }

    @GetMapping("/status/{userId1}/{userId2}")
    public ResponseEntity<Map<String, Object>> getBlockStatus(
            @PathVariable Long userId1,
            @PathVariable Long userId2) {
        return ResponseEntity.ok(blockService.getBlockStatus(userId1, userId2));
    }
}
