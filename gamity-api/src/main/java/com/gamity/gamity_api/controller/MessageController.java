package com.gamity.gamity_api.controller;

import com.gamity.gamity_api.domain.dto.MessageDTO;
import com.gamity.gamity_api.domain.dto.MessageRequestDTO;
import com.gamity.gamity_api.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @GetMapping("/history/{user1}/{user2}")
    public ResponseEntity<?> getConversation(@PathVariable Long user1, @PathVariable Long user2) {
        try {
            List<MessageDTO> messages = messageService.getConversation(user1, user2);
            return ResponseEntity.ok(Map.of("success", true, "messages", messages));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody MessageRequestDTO request) {
        try {
            messageService.sendMessage(request.getSender_id(), request.getReceiver_id(), request.getContent());
            return ResponseEntity.ok(Map.of("success", true, "message", "Enviado correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", e.getMessage()));
        }
    }
}
