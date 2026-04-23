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

    @PostMapping("/{requestId}/respond")
    public ResponseEntity<?> respondToRequest(
            @PathVariable Long requestId,
            @RequestBody Map<String, String> body) {
        try {
            String decision = body.get("decision"); // "accepted" o "rejected"
            friendshipService.respondToRequest(requestId, decision);
            return ResponseEntity.ok(Map.of("success", true, "message", "Solicitud " + decision));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendRequest(@RequestBody Map<String, Long> body) {
        try {
            friendshipService.sendRequest(body.get("senderId"), body.get("receiverId"));
            return ResponseEntity.ok(Map.of("success", true, "message", "Solicitud enviada"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", e.getMessage()));
        }
    }

}