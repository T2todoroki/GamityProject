package com.gamity.gamity_api.service.impl;

import com.gamity.gamity_api.domain.dto.UserDTO;
import com.gamity.gamity_api.domain.entity.User;
import com.gamity.gamity_api.repository.UserRepository;
import com.gamity.gamity_api.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchServiceImpl implements MatchService {

    private final UserRepository userRepository;

    @Override
    // Este método se encarga de obtener los posibles matches para un usuario dado, aplicando filtros opcionales
    public List<UserDTO> getPotentialMatches(Long currentUserId, String game, String rankGroup, String attitude) {
        
        List<String> ranks = null;
        if (rankGroup != null && !rankGroup.isEmpty()) {
            ranks = switch (rankGroup.toLowerCase()) {
                case "low" -> List.of("Hierro", "Bronce", "Plata");
                case "mid" -> List.of("Oro", "Platino", "Diamante");
                case "high" -> List.of("Ascendente", "Inmortal", "Radiante/Global", "Top / Global Elite");
                default -> List.of(rankGroup);
            };
        }
            //Llamamos al repositorio para obtener los usuarios que cumplen con los criterios de búsqueda, asegurándonos de manejar los filtros correctamente
        List<User> users = userRepository.findPotentialMatches(
                currentUserId, 
                game != null && game.isEmpty() ? null : game, 
                ranks, 
                attitude != null && attitude.isEmpty() ? null : attitude
        );

        return users.stream().map(this::mapToDTO).collect(Collectors.toList());
    }
// Este método privado se encarga de convertir una entidad User a un UserDTO, extrayendo solo los campos necesarios para el feed
    private UserDTO mapToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .avatar(user.getAvatar())
                .game(user.getProfile() != null ? user.getProfile().getMainGame() : null)
                .rank(user.getProfile() != null ? user.getProfile().getGameRank() : null)
                .attitude(user.getProfile() != null ? user.getProfile().getAttitude() : null)
                .build();
    }
}
