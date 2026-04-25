package com.WebApp.Backend.controller;
import com.WebApp.Backend.model.User;
import com.WebApp.Backend.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

// HANDLES LOGIN AND REGISTER
@RestController
// DEFINES BASE API ROUTE FOR AUTHENTICATION
@RequestMapping("/api/auth")
// ALLOWS REQUESTS FROM REACT FRONTEND
@CrossOrigin(origins = "*")


public class AuthController {
    @Autowired
    // INJECTS USER REPOSITORY FOR DATABASE ACCESS
    private UserRepo userRepository;

    // REGISTERS A NEW USER ACCOUNT
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {

        // CHECKS IF USERNAME ALREADY EXISTS
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Username already exists!");
        }

        // SAVES NEW USER TO DATABASE
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    // AUTHENTICATES USER LOGIN CREDENTIALS
    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody User loginDetails) {

        // RETRIEVES USER BY USERNAME
        Optional<User> user = userRepository.findByUsername(loginDetails.getUsername());

        // VALIDATES USERNAME AND PASSWORD
        if (user.isPresent() && user.get().getPassword().equals(loginDetails.getPassword())) {
            return ResponseEntity.ok("Login successful!");
        }

        // RETURNS ERROR IF AUTHENTICATION FAILS
        return ResponseEntity.badRequest().body("Error: Invalid username or password!");
    }
}