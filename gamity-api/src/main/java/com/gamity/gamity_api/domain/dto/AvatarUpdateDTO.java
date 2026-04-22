package com.gamity.gamity_api.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvatarUpdateDTO {
    // Solo recibimos lo estrictamente necesario para esta operación
    private String avatar;
}
