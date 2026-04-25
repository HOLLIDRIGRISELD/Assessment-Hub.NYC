package com.WebApp.Backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// MAIN ENTRY POINT FOR SPRING BOOT APPLICATION
@SpringBootApplication
public class BackendApplication {

	// STARTS THE SPRING APPLICATION AND INITIALIZES CONTEXT
	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}