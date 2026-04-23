package com.gamity.gamity_api.service;

import com.gamity.gamity_api.domain.dto.UserDTO;

import java.util.List;

//Servicio de Match limpio: Solo expone lo necesario para el Feed, delegando la lógica de filtrado al repositorio.
public interface MatchService {
    List<UserDTO> getPotentialMatches(Long currentUserId, String game, String rankGroup, String attitude);
}
