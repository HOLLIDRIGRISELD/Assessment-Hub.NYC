package com.WebApp.Backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

// CONFIGURES GLOBAL SPRING SECURITY AND CORS SETTINGS
@Configuration
public class SecurityConfig {

    // CREATES PASSWORD ENCODER FOR SECURE PASSWORD HASHING
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // DEFINES SECURITY RULES AND DISABLES AUTHENTICATION FOR ALL REQUESTS
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // ENABLES CUSTOM CORS CONFIGURATION
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // DISABLES CSRF FOR API USAGE
                .csrf(csrf -> csrf.disable())
                // ALLOWS ALL REQUESTS WITHOUT AUTHENTICATION
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
        return http.build();
    }

    // DEFINES ALLOWED ORIGINS, METHODS, AND HEADERS FOR CROSS-ORIGIN REQUESTS
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // ALLOWS FRONTEND ACCESS FROM LOCALHOST AND DROPLET SERVER
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",
            "http://206.81.22.189",
            "http://206.81.22.189:3000"
        ));

        // DEFINES ALLOWED HTTP METHODS
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // DEFINES ALLOWED REQUEST HEADERS
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept"));

        // ENABLES CREDENTIALS FOR SECURE REQUESTS
        configuration.setAllowCredentials(true);

        // APPLIES CORS SETTINGS TO ALL ENDPOINTS
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}