package com.gamity.gamity_api.domain.entity;

import jakarta.persistence.*;
import lombok.*;

//Son anotaciones de Lombok que generan automáticamente código como constructores, getters, setters, toString, equals y hashCode.
@Entity
@Table(name = "user_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {

    @Id
    private Long userId;

    //Relación OneToOne con User. El perfil se identifica por el mismo ID que el usuario.
    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User user;

    //Creacion de las columnas de la tabla user_profile con sus restricciones y valores por defecto
    @Column(columnDefinition = "TEXT")
    private String bio;

    //Creacion de la columna main_game con longitud máxima de 100 caracteres
    @Column(name = "main_game", length = 100)
    private String mainGame;

    //Creacion de la columna game_rank con longitud máxima de 50 caracteres
    @Column(name = "game_rank", length = 50)
    private String gameRank;

    //Creacion de la columna attitude con longitud máxima de 50 caracteres
    @Column(length = 50)
    private String attitude;
}
