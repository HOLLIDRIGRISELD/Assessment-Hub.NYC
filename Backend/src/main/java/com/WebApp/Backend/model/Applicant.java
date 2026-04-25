package com.WebApp.Backend.model;
import jakarta.persistence.*;

// DEFINES ENTITY MAPPED TO APPLICANTS TABLE IN DATABASE
@Entity
@Table(name = "applicants")
public class Applicant {

    // PRIMARY KEY WITH AUTO-INCREMENT STRATEGY
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // STORES APPLICANT NAME
    @Column(nullable = false)
    private String name;

    // STORES FINANCIAL AND CREDIT INFORMATION
    private Double annualIncome;
    private Integer creditScore;
    private Double loanAmount;

    // STORES AI CLASSIFICATION AND APPLICATION STATUS
    private String aiClassification;
    private String status;

    // GETTERS AND SETTERS FOR ACCESSING AND MODIFYING DATA
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getAnnualIncome() { return annualIncome; }
    public void setAnnualIncome(Double annualIncome) { this.annualIncome = annualIncome; }

    public Integer getCreditScore() { return creditScore; }
    public void setCreditScore(Integer creditScore) { this.creditScore = creditScore; }

    public Double getLoanAmount() { return loanAmount; }
    public void setLoanAmount(Double loanAmount) { this.loanAmount = loanAmount; }

    public String getAiClassification() { return aiClassification; }
    public void setAiClassification(String aiClassification) { this.aiClassification = aiClassification; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}