package com.gamity.gamity_api.service.impl;

import com.gamity.gamity_api.domain.entity.User;
import com.gamity.gamity_api.repository.UserRepository;
import com.gamity.gamity_api.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
// @RequiredArgsConstructor genera un constructor con los campos finales (final) automáticamente, inyectando las dependencias necesarias.
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    // Este método es sencillo, solo actualiza un campo específico (avatar) en la tabla users, sin tocar la tabla relacionada user_profiles.
    public void updateAvatar(Long userId, String avatarPath) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + userId));
        
        // Reglas de negocio: Opcional, validar que avatarPath empiece por img/
        user.setAvatar(avatarPath);
        
        // Al tener @Transactional sucio (dirty checking), Hibernate hace el UPDATE automáticamente al finalizar el método
        userRepository.save(user);
    }

    @Override
    @Transactional
    // Este método es más complejo porque actualiza tanto la tabla users como la tabla user_profiles, que están relacionadas.
    public void updateProfile(Long userId, com.gamity.gamity_api.domain.dto.FullProfileUpdateDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + userId));

        // Campo avatar en tabla users
        if (dto.getAvatar() != null && !dto.getAvatar().isEmpty()) {
            user.setAvatar(dto.getAvatar());
        }

        //Controlar la tabla relacional user_profiles
        com.gamity.gamity_api.domain.entity.UserProfile profile = user.getProfile();
        if (profile == null) {
            profile = new com.gamity.gamity_api.domain.entity.UserProfile();
            user.setProfile(profile);
        }

        profile.setBio(dto.getBio());
        profile.setMainGame(dto.getMain_game());
        profile.setGameRank(dto.getGame_rank());
        profile.setAttitude(dto.getAttitude());

        //@Transactional y cascade = CascadeType.ALL en User, esto guarda ambas tablas a la vez.
        //Si hay un error, se hace Rollback de la imagen y los textos a la vez (Integridad de datos).
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void registerUser(com.gamity.gamity_api.domain.dto.RegisterDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("El correo electrónico ya está registrado");
        }
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new RuntimeException("El nombre de usuario no está disponible");
        }

        //Se crea la entidad inicial base
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));  //encriptamos la contraseña antes de guardarla
        user.setRole("user");
        user.setAvatar("img/default.png");
        user.setStatus("offline");

        // Y se une inseparablemente con un perfil vacío A LA VEZ en el registro, 
        // para evitar que el usuario tenga un perfil nulo y así simplificar la lógica de acceso a datos en el futuro.
        com.gamity.gamity_api.domain.entity.UserProfile profile = new com.gamity.gamity_api.domain.entity.UserProfile();
        user.setProfile(profile);

        userRepository.save(user);
    }
}
