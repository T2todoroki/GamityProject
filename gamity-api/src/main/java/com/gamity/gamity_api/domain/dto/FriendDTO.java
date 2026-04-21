package com.gamity.gamity_api.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO que representa un amigo aceptado.
 * Contiene la información necesaria para mostrar en el listado de amigos
 * y en la barra lateral del chat.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FriendDTO {
    private Long id;           // ID del usuario amigo
    private String username;
    private String avatar;
    private String status;     // "online" / "offline"
    private String mainGame;
    private String gameRank;
}