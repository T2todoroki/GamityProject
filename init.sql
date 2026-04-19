CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(20) DEFAULT 'user',
  `avatar` varchar(255) DEFAULT 'img/default.png',
  `status` varchar(20) DEFAULT 'offline',
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
(2, 'Competitivo', 'Si no vas a ganar, no me agregues.', 'Diamante', 'Valorant'),
(3, 'Casual', 'A jugar unas normales depsues del curro.', 'Plata', 'League of Legends'),
(4, 'Competitivo', 'Main support buscando duo para subir.', 'Platino', 'Overwatch 2'),
(5, 'Chill', 'Amo construir casitas.', 'Unranked', 'Minecraft'),
(6, 'Tryhard', 'Quiero llegar al mundial este año.', 'Radiante', 'Valorant'),
(7, 'Casual', 'Juego de todo un poco.', 'Oro', 'Apex Legends'),
(8, 'Tryhard', 'Ex-jugador profesional.', 'Challenger', 'League of Legends'),
(9, 'Chill', 'Enseñando a los nuevos a jugar.', 'Plata', 'Counter-Strike 2'),
(10, 'Tóxico', 'Si feedeas te reporto al instante.', 'Hierro', 'League of Legends');
