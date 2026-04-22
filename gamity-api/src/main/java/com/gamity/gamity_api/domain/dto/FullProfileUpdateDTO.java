package com.gamity.gamity_api.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FullProfileUpdateDTO {
    private String avatar;
    private String bio;
    private String main_game;
    private String game_rank;
    private String attitude;
}
