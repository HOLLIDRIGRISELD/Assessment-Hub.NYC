package com.WebApp.Backend.model;
import jakarta.persistence.*;

// DEFINES ENTITY MAPPED TO USERS TABLE IN DATABASE
@Entity
@Table(name = "users")
public class User {

    // PRIMARY KEY WITH AUTO-INCREMENT STRATEGY
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // STORES UNIQUE USERNAME (REQUIRED FIELD)
    @Column(nullable = false, unique = true)
    private String username;

    // STORES USER PASSWORD (REQUIRED FIELD)
    @Column(nullable = false)
    private String password;

    // GETTERS AND SETTERS FOR ACCESSING AND MODIFYING USER DATA
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}