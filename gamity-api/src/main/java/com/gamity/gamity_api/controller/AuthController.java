package com.gamity.gamity_api.controller;

import com.gamity.gamity_api.domain.dto.RegisterDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDTO dto) {
        //Conectar con la base de datos (UserService) más adelante
        System.out.println("Petición de registro recibida para el email: " + dto.getEmail());
        
        return ResponseEntity.ok().body(Map.of(
            "success", true, 
            "message", "Simulación: Endpoint de registro funcionando"
        ));
    }
}