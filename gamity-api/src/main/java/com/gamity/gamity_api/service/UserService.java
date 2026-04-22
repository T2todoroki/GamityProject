package com.gamity.gamity_api.service;

public interface UserService {
    void updateAvatar(Long userId, String avatarPath);
    void updateProfile(Long userId, com.gamity.gamity_api.domain.dto.FullProfileUpdateDTO dto);
    void registerUser(com.gamity.gamity_api.domain.dto.RegisterDTO dto);
}
