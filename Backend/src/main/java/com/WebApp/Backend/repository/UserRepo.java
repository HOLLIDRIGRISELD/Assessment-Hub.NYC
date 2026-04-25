package com.WebApp.Backend.repository;

import com.WebApp.Backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

// DEFINES REPOSITORY FOR USER DATABASE OPERATIONS
@Repository
public interface UserRepo extends JpaRepository<User, Long> {

    // RETRIEVES USER BY USERNAME IF EXISTS
    Optional<User> findByUsername(String username);
}