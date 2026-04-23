package com.gamity.gamity_api.controller;

import com.gamity.gamity_api.domain.dto.AvatarUpdateDTO;
import com.gamity.gamity_api.domain.entity.User;
import com.gamity.gamity_api.repository.UserRepository;
import com.gamity.gamity_api.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    @PostMapping("/{id}/avatar")
    public ResponseEntity<?> updateAvatar(@PathVariable Long id, @RequestBody AvatarUpdateDTO dto) {
        try {
            userService.updateAvatar(id, dto.getAvatar());
            return ResponseEntity.ok().body(Map.of("success", true, "message", "Avatar actualizado a " + dto.getAvatar()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/profile")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody com.gamity.gamity_api.domain.dto.FullProfileUpdateDTO dto) {
        try {
            userService.updateProfile(id, dto);
            return ResponseEntity.ok().body(Map.of("success", true, "message", "Perfil actualizado correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    @GetMapping("/{id}/profile")
    public ResponseEntity<?> getProfile(@PathVariable Long id) {
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
            java.util.Map<String, Object> profileData = new java.util.HashMap<>();
            profileData.put("email", user.getEmail());
            profileData.put("avatar", user.getAvatar());
            if(user.getProfile() != null) {
                profileData.put("bio", user.getProfile().getBio());
                profileData.put("main_game", user.getProfile().getMainGame());
                profileData.put("game_rank", user.getProfile().getGameRank());
                profileData.put("attitude", user.getProfile().getAttitude());
            }
            
            return ResponseEntity.ok(java.util.Map.of("success", true, "profile", profileData));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("success", false, "error", e.getMessage()));
        }
    }

    @GetMapping("/{id}/role")
    public ResponseEntity<?> getUserRole(@PathVariable Long id) {
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            return ResponseEntity.ok(Map.of("success", true, "role", user.getRole()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", e.getMessage()));
        }
    }
}
