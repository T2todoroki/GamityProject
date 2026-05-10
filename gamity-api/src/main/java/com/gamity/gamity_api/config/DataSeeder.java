package com.gamity.gamity_api.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

/**
 * DataSeeder desactivado intencionalmente.
 * Los datos de prueba se cargan desde init.sql via Docker entrypoint.
 * Mantener un doble seeding causaba crashes por entradas duplicadas al arrancar.
 */
@Configuration
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    @Override
    public void run(String... args) {
        // Seeding gestionado por init.sql — no hacer nada aqui.
    }
}
