-- ============================================
-- GAMITY PREMIER - Sistema de Torneos Valorant 5v5
-- Script SQL para ejecutar en phpMyAdmin
-- ============================================

-- 1. Tabla de Torneos
CREATE TABLE IF NOT EXISTS `tournaments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'open',
  `max_players` int NOT NULL DEFAULT 40,
  `registration_opens_at` datetime NOT NULL,
  `registration_closes_at` datetime NOT NULL,
  `starts_at` datetime NOT NULL,
  `format` varchar(20) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- status: open, closed, in_progress, completed, cancelled

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

-- 6. Tabla de Chats de Equipo
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

-- 7. Tabla de Notificaciones
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

-- ============================================
-- TORNEO DE PRUEBA (cierra inscripciones en 2 días, empieza en 3)
-- ============================================
INSERT INTO `tournaments` (`name`, `status`, `max_players`, `registration_opens_at`, `registration_closes_at`, `starts_at`)
VALUES (
  'Gamity Premier #1 - Valorant 5v5',
  'open',
  10,
  NOW(),
  DATE_ADD(NOW(), INTERVAL 2 DAY),
  DATE_ADD(NOW(), INTERVAL 3 DAY)
);
