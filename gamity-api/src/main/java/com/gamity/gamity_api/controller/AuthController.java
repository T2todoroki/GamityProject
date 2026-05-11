package com.gamity.gamity_api.controller;

import com.gamity.gamity_api.domain.dto.RegisterDTO;
import com.gamity.gamity_api.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDTO dto) {
        try {
            userService.registerUser(dto);
            return ResponseEntity.ok().body(Map.of("success", true, "message", "Registro completado con éxito"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody com.gamity.gamity_api.domain.dto.LoginDTO dto) {
        try {
            com.gamity.gamity_api.domain.dto.LoginResponseDTO response = userService.loginUser(dto);
            return ResponseEntity.ok().body(Map.of("success", true, "user", response));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(Map.of("success", false, "error", e.getMessage()));
        }
    }
}