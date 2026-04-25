package com.WebApp.Backend.controller;

import com.WebApp.Backend.model.Applicant;
import com.WebApp.Backend.repository.ApplicantRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
// HANDLES HTTP REQUESTS FOR APPLICANT DATA
@RequestMapping("/api/applicants")
// DEFINES BASE API ROUTE FOR APPLICANTS
@CrossOrigin(origins = "*")
// ALLOWS REQUESTS FROM ANY FRONTEND ORIGIN

public class ApplicantController {

    @Autowired
    // INJECTS APPLICANT REPOSITORY FOR DATABASE OPERATIONS
    private ApplicantRepo applicantRepo;

    // CREATES A NEW APPLICANT RECORD IN DATABASE
    @PostMapping
    public Applicant createApplicant(@RequestBody Applicant applicant) {
        return applicantRepo.save(applicant);
    }

    // RETRIEVES ALL APPLICANTS FROM DATABASE
    @GetMapping
    public List<Applicant> getAllApplicants() {
        return applicantRepo.findAll();
    }

    // RETRIEVES A SINGLE APPLICANT BY ID
    @GetMapping("/{id}")
    public Applicant getApplicantById(@PathVariable Long id) {
        return applicantRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Applicant not found with id: " + id));
    }

    // UPDATES EXISTING APPLICANT DATA BY ID
    @PutMapping("/{id}")
    public Applicant updateApplicant(@PathVariable Long id, @RequestBody Applicant applicantDetails) {
        Applicant applicant = applicantRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Applicant not found with id: " + id));

        // SETS UPDATED FIELD VALUES
        applicant.setName(applicantDetails.getName());
        applicant.setAnnualIncome(applicantDetails.getAnnualIncome());
        applicant.setCreditScore(applicantDetails.getCreditScore());
        applicant.setLoanAmount(applicantDetails.getLoanAmount());
        applicant.setStatus(applicantDetails.getStatus());

        return applicantRepo.save(applicant);
    }

    // DELETES APPLICANT RECORD BY ID
    @DeleteMapping("/{id}")
    public String deleteApplicant(@PathVariable Long id) {
        applicantRepo.deleteById(id);
        return "Applicant deleted successfully!";
    }
}