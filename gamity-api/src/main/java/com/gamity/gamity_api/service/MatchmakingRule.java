package com.gamity.gamity_api.service;

import com.gamity.gamity_api.domain.entity.User;

/**
 * Principio Abierto/Cerrado (OCP): Para añadir nuevas reglas o requisitos
 * para entrar al matchmaking, simplemente se crea una nueva clase que
 * implemente esta interfaz sin modificar el TournamentService.
 */
public interface MatchmakingRule {
    
    /**
     * @param user El usuario que intenta entrar a la cola.
     * @return Un mensaje de error si no cumple la regla, o null si la cumple.
     */
    String validate(User user);
}
