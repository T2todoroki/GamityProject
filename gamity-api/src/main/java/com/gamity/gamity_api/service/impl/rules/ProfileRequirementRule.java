package com.gamity.gamity_api.service.impl.rules;

import com.gamity.gamity_api.domain.entity.User;
import com.gamity.gamity_api.service.MatchmakingRule;
import org.springframework.stereotype.Component;

@Component
public class ProfileRequirementRule implements MatchmakingRule {

    @Override
    public String validate(User user) {
        if (user.getProfile() == null) {
            return "Debes configurar tu perfil antes de jugar en Premier.";
        }
        
        if (user.getProfile().getGameRank() == null || user.getProfile().getGameRank().trim().isEmpty()) {
            return "Es obligatorio establecer tu Rango (ej. Valorant, LoL) en tu perfil para buscar partida.";
        }
        
        if (user.getProfile().getMainGame() == null || user.getProfile().getMainGame().trim().isEmpty()) {
            return "Es obligatorio establecer tu Juego Principal en tu perfil para jugar en Premier.";
        }
        
        return null; // Todo correcto
    }
}
