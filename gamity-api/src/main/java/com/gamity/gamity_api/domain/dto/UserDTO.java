package com.gamity.gamity_api.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    // TAREA 1. DTO limpio: Protege la contraseña, email y status, enviando solo datos públicos requeridos para el Feed.
    private Long id;
    private String username;
    private String avatar;
    private String game;
    private String rank;
    private String attitude;
}
