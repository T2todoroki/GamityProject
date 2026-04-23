package com.gamity.gamity_api.controller;

import com.gamity.gamity_api.domain.dto.FriendDTO;
import com.gamity.gamity_api.domain.dto.FriendshipResponseDTO;
import com.gamity.gamity_api.service.FriendshipService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/friendships")
@RequiredArgsConstructor
public class FriendshipController {

    private final FriendshipService friendshipService;

      @GetMapping("/pending/{userId}")
    public ResponseEntity<List<FriendshipResponseDTO>> getPendingRequests(@PathVariable Long userId) {
        return ResponseEntity.ok(friendshipService.getPendingRequests(userId));
    }

     @GetMapping("/friends/{userId}")
    public ResponseEntity<List<FriendDTO>> getFriends(@PathVariable Long userId) {
        return ResponseEntity.ok(friendshipService.getFriends(userId));
    }

}