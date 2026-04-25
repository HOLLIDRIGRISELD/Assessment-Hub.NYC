package com.WebApp.Backend.controller;
import com.WebApp.Backend.model.Applicant;
import com.WebApp.Backend.repository.ApplicantRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
//Api communicator for the frontend
@RequestMapping("/api/applicants")
@CrossOrigin(origins = "*")

public class ApplicantController {
    @Autowired
    private ApplicantRepo applicantRepo;
    //ALL CRUD MECHANICS FOR THE APPLICANTS TABLE
    //CREATE
    @PostMapping
    public Applicant createApplicant(@RequestBody Applicant applicant) {
        return applicantRepo.save(applicant);
    }
    //READ
    @GetMapping
    public List<Applicant> getAllApplicants() {
        return applicantRepo.findAll();
    }
    //READ (BUT ONlY ONE FOR ID)
    @GetMapping("/{id}")
    public Applicant getApplicantById(@PathVariable Long id) {
        return applicantRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Applicant not found with id: " + id));
    }
    //WRITE
    @PutMapping("/{id}")
    public Applicant updateApplicant(@PathVariable Long id, @RequestBody Applicant applicantDetails) {
        Applicant applicant = applicantRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Applicant not found with id: " + id));
        applicant.setName(applicantDetails.getName());
        applicant.setAnnualIncome(applicantDetails.getAnnualIncome());
        applicant.setCreditScore(applicantDetails.getCreditScore());
        applicant.setLoanAmount(applicantDetails.getLoanAmount());
        applicant.setStatus(applicantDetails.getStatus());
        return applicantRepo.save(applicant);
    }
    //DELETE
    @DeleteMapping("/{id}")
    public String deleteApplicant(@PathVariable Long id) {
        applicantRepo.deleteById(id);
        return "Applicant deleted successfully!";
    }
}