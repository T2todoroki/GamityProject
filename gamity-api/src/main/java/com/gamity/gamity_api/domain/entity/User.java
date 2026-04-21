package com.gamity.gamity_api.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    //creacion de la tabla user con sus atributos y relaciones con profile  
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //creacion de las columnas de la tabla user con sus restricciones y valores por defecto
    @Column(unique = true, nullable = false)
    private String username;

    //Creacion de la columna email con restricciones no nula y unica
    private String email;

    //Creacion de la columna password con restriccion no nula
    @Column(nullable = false)
    private String password;

    //Creacion de la columna role con valor por defecto 'user'
    @Column(columnDefinition = "varchar(20) default 'user'")
    private String role;

    //Creacion de la columna avatar con valor por defecto 'img/default.png'
    @Column(columnDefinition = "varchar(255) default 'img/default.png'")
    private String avatar;

    //Creacion de la columna status con valor por defecto 'offline'
    @Column(columnDefinition = "varchar(20) default 'offline'")
    private String status;


    //Bi-directional one-to-one relationship with UserProfile
    //Relación OneToOne con CascadeType.ALL garantiza que el perfil 
    //se persista siempre junto al usuario. Ningún usuario se quedará en el limbo.

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private UserProfile profile;

    public void setProfile(UserProfile profile) {
        if (profile != null) {
            profile.setUser(this);
        }
        this.profile = profile;
    }
}
