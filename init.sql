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

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `avatar`, `status`) VALUES
(1, 'administrador', 'admin@gamity.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'img/default.png', 'offline'),
(2, 'juanprueba', 'juanprueba@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'img/default.png', 'offline'),
(3, 'luisprueba', 'luisprueba@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'img/default.png', 'offline'),
(4, 'mariaprueba', 'mariaprueba@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'img/default.png', 'offline'),
(5, 'carlosgamer', 'carlosgamer@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'img/default.png', 'offline'),
(6, 'abby_alvarez', 'abby@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'img/default.png', 'offline'),
(7, 'castillo_18', 'castillo@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'img/default.png', 'offline'),
(8, 'proplayer_99', 'pro@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'img/default.png', 'offline'),
(9, 'noobmaster', 'noob@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'img/default.png', 'offline'),
(10, 'el_maestro', 'maestro@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'img/default.png', 'offline');

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
(10, 'Tóxico', 'feedeame y veras.', 'Hierro', 'League of Legends');


-- GAMITY PREMIER - Sistema de Torneos Valorant 5v5
-- Script SQL para ejecutar en phpMyAdmin

-- 1. Tabla de Torneos
CREATE TABLE IF NOT EXISTS `tournaments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'open',
  `max_players` int NOT NULL DEFAULT 40,
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
-- badge_type: CHAMPION, TRIPLE_CROWN, VETERAN
