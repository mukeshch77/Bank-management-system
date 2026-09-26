package com.bank.management.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;

/**
 * DataInitializer - App start hone pe schema aur sample data load karta hai.
 * Sirf tab run hota hai jab tables exist nahi karte.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        try {
            // Check karo users table exist karti hai ya nahi
            Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM users", Integer.class
            );
            log.info("Database already initialized with {} users", count);
        } catch (Exception e) {
            // Table nahi hai - schema run karo
            log.info("Initializing database schema...");
            try {
                ClassPathResource resource = new ClassPathResource("schema.sql");
                String sql = new String(resource.getInputStream().readAllBytes(),
                    StandardCharsets.UTF_8);

                // Multiple statements run karo
                for (String statement : sql.split(";")) {
                    String trimmed = statement.trim();
                    if (!trimmed.isEmpty() && !trimmed.startsWith("--")) {
                        try {
                            jdbcTemplate.execute(trimmed);
                        } catch (Exception ex) {
                            log.warn("Statement skipped: {}", ex.getMessage());
                        }
                    }
                }
                log.info("Database schema initialized successfully!");
            } catch (Exception ex) {
                log.error("Failed to initialize schema: {}", ex.getMessage());
            }
        }
    }
}