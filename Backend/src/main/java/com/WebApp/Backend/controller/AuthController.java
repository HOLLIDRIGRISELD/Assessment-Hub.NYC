package com.WebApp.Backend.controller;
import com.WebApp.Backend.model.User;
import com.WebApp.Backend.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    @Autowired
    private UserRepo userRepository;

    //REGISTER A NEW USER
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        //CHECK USERNAME AVAILABILITY
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Username already exists!");
        }
        //SAVE NEW USER
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    //LOGIN
    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody User loginDetails) {
        Optional<User> user = userRepository.findByUsername(loginDetails.getUsername());
        //CHECK USERNAME AND PASSWORD
        if (user.isPresent() && user.get().getPassword().equals(loginDetails.getPassword())) {
            return ResponseEntity.ok("Login successful!");
        }
        return ResponseEntity.badRequest().body("Error: Invalid username or password!");
    }
}