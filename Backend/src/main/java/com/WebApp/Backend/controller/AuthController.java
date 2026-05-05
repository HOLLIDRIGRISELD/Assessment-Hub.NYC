package com.WebApp.Backend.controller;
import com.WebApp.Backend.model.User;
import com.WebApp.Backend.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

// HANDLES USER AUTHENTICATION LOGIC
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://206.81.22.189", "http://206.81.22.189:3000"})
public class AuthController {
    @Autowired
    // PROVIDES ACCESS TO USER DATABASE OPERATIONS
    private UserRepo userRepository;
    @Autowired
    // HANDLES PASSWORD HASHING AND VERIFICATION USING BCRYPT
    private PasswordEncoder passwordEncoder;

    // REGISTERS A NEW USER WITH ENCRYPTED PASSWORD
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {

        // CHECKS IF USERNAME ALREADY EXISTS
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Username already exists!");
        }

        // HASHES PASSWORD BEFORE STORING IN DATABASE
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);

        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    // AUTHENTICATES USER LOGIN USING HASHED PASSWORD COMPARISON
    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody User loginDetails) {

        // FINDS USER BY USERNAME
        Optional<User> user = userRepository.findByUsername(loginDetails.getUsername());

        // VALIDATES PASSWORD AGAINST STORED HASH
        if (user.isPresent() &&
                passwordEncoder.matches(loginDetails.getPassword(), user.get().getPassword())) {
            return ResponseEntity.ok("Login successful");
        }
        return ResponseEntity.badRequest().body("Error: Invalid username or password");
    }
}