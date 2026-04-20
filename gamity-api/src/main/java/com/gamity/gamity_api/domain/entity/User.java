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

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(columnDefinition = "varchar(20) default 'user'")
    private String role;

    @Column(columnDefinition = "varchar(255) default 'img/default.png'")
    private String avatar;

    @Column(columnDefinition = "varchar(20) default 'offline'")
    private String status;

    // TAREA 1. SOLUCIÓN BUG #2: Relación OneToOne con CascadeType.ALL garantiza que el perfil 
    // se persista siempre junto al usuario. Ningún usuario se quedará en el limbo.
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private UserProfile profile;

    public void setProfile(UserProfile profile) {
        if (profile != null) {
            profile.setUser(this);
        }
        this.profile = profile;
    }
}
