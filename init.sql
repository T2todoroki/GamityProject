CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(20) DEFAULT 'user',
  `avatar` varchar(255) DEFAULT 'img/default.png',
  `status` varchar(20) DEFAULT 'offline',
  `premier_wins` int DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_r43af9ap4edm43mmtq01oddj6` (`username`),
  UNIQUE KEY `UK_6dotkpttghj45a1t9a93wqid8` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `user_profiles` (
  `user_id` bigint NOT NULL,
  `attitude` varchar(50) DEFAULT NULL,
  `bio` text,
  `game_rank` varchar(50) DEFAULT NULL,
  `main_game` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `FK_user_profiles_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `friendship_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `receiver_id` int NOT NULL,
  `sender_id` int NOT NULL,
  `sent_at` datetime(6) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `messages` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `sender_id` bigint NOT NULL,
  `receiver_id` bigint NOT NULL,
  `content` text NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `reports` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `reporter_id` bigint DEFAULT NULL,
  `reported_user_id` bigint DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `created_at` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `avatar`, `status`, `premier_wins`) VALUES
(1, 'administrador', 'admin@gamity.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'img/default.png', 'offline', 0),
-- Usuarios con rol 'demo': pueden usar Forzar Matchmaking en la presentación del TFG
(2, 'juanprueba', 'juanprueba@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'demo', 'img/default.png', 'offline', 0),
(3, 'luisprueba', 'luisprueba@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'demo', 'img/default.png', 'offline', 0),
(4, 'mariaprueba', 'mariaprueba@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'demo', 'img/default.png', 'offline', 0),
(5, 'carlosgamer', 'carlosgamer@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'demo', 'img/default.png', 'offline', 15),
(6, 'abby_alvarez', 'abby@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'demo', 'img/default.png', 'offline', 8),
-- Usuarios normales
(7, 'castillo_18', 'castillo@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'img/default.png', 'offline', 5),
(8, 'proplayer_99', 'pro@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'img/default.png', 'offline', 12),
(9, 'noobmaster', 'noob@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'img/default.png', 'offline', 0),
(10, 'el_maestro', 'maestro@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'img/default.png', 'offline', 0),
(11, 'david_gamer', 'david@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'img/default.png', 'offline', 0),
(12, 'de_ramon', 'ramon@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'img/default.png', 'offline', 0),
(13, 'de_maria', 'demaaria@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'img/default.png', 'offline', 0),
(14, 'elmaspro', 'elmaspro@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'img/default.png', 'offline', 0),
(15, 'aaron_gg', 'aaron@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'img/default.png', 'offline', 0),
(16, 'jugador_oro1', 'oro1@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'img/default.png', 'offline', 11),
(17, 'jugador_oro2', 'oro2@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'img/default.png', 'offline', 9),
(18, 'jugador_oro3', 'oro3@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'img/default.png', 'offline', 7),
(19, 'jugador_oro4', 'oro4@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'img/default.png', 'offline', 6),
(20, 'jugador_plata1', 'plata1@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'img/default.png', 'offline', 4);

INSERT INTO `user_profiles` (`user_id`, `attitude`, `bio`, `game_rank`, `main_game`) VALUES
(1, 'Administrador', 'Cuenta Oficial del Sistema.', 'Admin', 'Gamity'),
(2, 'Competitivo', 'Agregame.', 'Diamante', 'Valorant'),
(3, 'Casual', 'A jugar unas normales depsues del curro.', 'Plata', 'League of Legends'),
(4, 'Competitivo', 'Busco duo.', 'Platino', 'Overwatch 2'),
(5, 'Chill', 'Amo construir casitas.', 'Unranked', 'Minecraft'),
(6, 'Tryhard', 'Reprobe el año ahora juego solamene.', 'Radiante', 'Valorant'),
(7, 'Casual', 'Juego de todo un poco.', 'Oro', 'Apex Legends'),
(8, 'Tryhard', 'Ex-jugador profesional.', 'Challenger', 'League of Legends'),
(9, 'Chill', 'Enseñando a los nuevos a jugar.', 'Plata', 'Counter-Strike 2'),
(10, 'Tóxico', 'feedeame y veras.', 'Hierro', 'League of Legends'),
(11, 'Competitivo', 'El grinding no para.', 'Diamante', 'Valorant'),
(12, 'Casual', 'Solo vengo a pasarla bien.', 'Plata', 'Fortnite'),
(13, 'Chill', 'Gamer de fin de semana.', 'Oro', 'Overwatch 2'),
(14, 'Tryhard', 'Top fragger o nothing.', 'Radiante', 'Valorant'),
(15, 'Competitivo', 'Busco equipo serio.', 'Platino', 'Counter-Strike 2'),
(16, 'Competitivo', 'Siempre oro, nunca inoro.', 'Oro', 'League of Legends'),
(17, 'Chill', 'Jugando para divertirme.', 'Oro', 'Valorant'),
(18, 'Tryhard', 'A por todas.', 'Oro', 'Apex Legends'),
(19, 'Casual', 'GG WP.', 'Oro', 'Fortnite'),
(20, 'Competitivo', 'Subiendo a oro pronto.', 'Plata', 'Valorant');


-- GAMITY PREMIER - Sistema de Torneos Valorant 5v5
-- Script SQL para ejecutar en phpMyAdmin

-- 1. Tabla de Torneos
CREATE TABLE IF NOT EXISTS `tournaments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'open',
  `max_players` int NOT NULL DEFAULT 10,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- 2. Tabla de Inscripciones Individuales
CREATE TABLE IF NOT EXISTS `tournament_registrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tournament_id` int NOT NULL,
  `user_id` bigint NOT NULL,
  `registered_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_tournament_user` (`tournament_id`, `user_id`),
  KEY `idx_tournament_id` (`tournament_id`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `fk_reg_tournament` FOREIGN KEY (`tournament_id`) REFERENCES `tournaments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_reg_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Tabla de Equipos Generados
CREATE TABLE IF NOT EXISTS `tournament_teams` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tournament_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `captain_id` bigint DEFAULT NULL,
  `seed` int DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_team_tournament` (`tournament_id`),
  CONSTRAINT `fk_team_tournament` FOREIGN KEY (`tournament_id`) REFERENCES `tournaments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_team_captain` FOREIGN KEY (`captain_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Tabla de Miembros de Equipos
CREATE TABLE IF NOT EXISTS `tournament_team_members` (
  `id` int NOT NULL AUTO_INCREMENT,
  `team_id` int NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_team_user` (`team_id`, `user_id`),
  KEY `idx_member_team` (`team_id`),
  KEY `idx_member_user` (`user_id`),
  CONSTRAINT `fk_member_team` FOREIGN KEY (`team_id`) REFERENCES `tournament_teams` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_member_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Tabla de Partidas del Bracket
CREATE TABLE IF NOT EXISTS `tournament_matches` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tournament_id` int NOT NULL,
  `round` int NOT NULL,
  `match_order` int NOT NULL,
  `team1_id` int DEFAULT NULL,
  `team2_id` int DEFAULT NULL,
  `winner_id` int DEFAULT NULL,
  `team1_reported_winner` int DEFAULT NULL,
  `team2_reported_winner` int DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'pending',
  `next_match_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_match_tournament` (`tournament_id`),
  CONSTRAINT `fk_match_tournament` FOREIGN KEY (`tournament_id`) REFERENCES `tournaments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_match_team1` FOREIGN KEY (`team1_id`) REFERENCES `tournament_teams` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_match_team2` FOREIGN KEY (`team2_id`) REFERENCES `tournament_teams` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_match_winner` FOREIGN KEY (`winner_id`) REFERENCES `tournament_teams` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_match_next` FOREIGN KEY (`next_match_id`) REFERENCES `tournament_matches` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- status: pending, awaiting_reports, validated, disputed

-- 6.Tabla de Chats de Equipo
CREATE TABLE IF NOT EXISTS `tournament_team_chats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `team_id` int NOT NULL,
  `user_id` bigint NOT NULL,
  `content` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_chat_team` (`team_id`),
  CONSTRAINT `fk_chat_team` FOREIGN KEY (`team_id`) REFERENCES `tournament_teams` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_chat_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7.Tabla de Notificaciones
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `type` varchar(50) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `link` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_notif_user` (`user_id`),
  KEY `idx_notif_read` (`user_id`, `is_read`),
  CONSTRAINT `fk_notif_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Tabla de Badges de Usuario
CREATE TABLE IF NOT EXISTS `user_badges` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `badge_type` varchar(50) NOT NULL,
  `awarded_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `tournament_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_badge_user` (`user_id`),
  CONSTRAINT `fk_badge_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_badge_tournament` FOREIGN KEY (`tournament_id`) REFERENCES `tournaments` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- badge_type: PREMIER_GOLD, PREMIER_SILVER, CHAMPION, TRIPLE_CROWN, VETERAN

-- Insertar medallas de ejemplo para la presentación
INSERT INTO `user_badges` (`user_id`, `badge_type`, `awarded_at`) VALUES
(5, 'PREMIER_GOLD', DATE_SUB(NOW(), INTERVAL 1 DAY)),  -- carlosgamer
(8, 'PREMIER_GOLD', DATE_SUB(NOW(), INTERVAL 1 DAY)),  -- proplayer_99
(6, 'PREMIER_GOLD', DATE_SUB(NOW(), INTERVAL 1 DAY)),  -- abby_alvarez
(7, 'PREMIER_SILVER', DATE_SUB(NOW(), INTERVAL 1 DAY)),-- castillo_18
(5, 'CHAMPION', DATE_SUB(NOW(), INTERVAL 5 DAY)),      -- carlosgamer (múltiples medallas)
(8, 'VETERAN', DATE_SUB(NOW(), INTERVAL 10 DAY)),      -- proplayer_99
(16, 'PREMIER_GOLD', DATE_SUB(NOW(), INTERVAL 1 DAY)), -- jugador_oro1
(17, 'PREMIER_GOLD', DATE_SUB(NOW(), INTERVAL 1 DAY)), -- jugador_oro2
(18, 'PREMIER_GOLD', DATE_SUB(NOW(), INTERVAL 1 DAY)), -- jugador_oro3
(19, 'PREMIER_GOLD', DATE_SUB(NOW(), INTERVAL 1 DAY)), -- jugador_oro4
(20, 'PREMIER_SILVER', DATE_SUB(NOW(), INTERVAL 1 DAY));-- jugador_plata1
