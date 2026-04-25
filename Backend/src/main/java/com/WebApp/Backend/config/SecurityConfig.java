package com.WebApp.Backend.config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

// CONFIGURES SPRING SECURITY SETTINGS FOR THE APPLICATION
@Configuration
public class SecurityConfig {

    // CREATES PASSWORD ENCODER FOR HASHING USER PASSWORDS
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // CONFIGURES SECURITY FILTER CHAIN AND API ACCESS RULES
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // DISABLES CSRF PROTECTION FOR SIMPLIFIED API TESTING
                .csrf(csrf -> csrf.disable())
                // ALLOWS ALL HTTP REQUESTS WITHOUT AUTHENTICATION
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
        return http.build();
    }
}