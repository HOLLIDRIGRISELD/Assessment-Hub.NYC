# Assessment-Hub:

Assessment-Hub is a fully containerized, distributed full-stack application designed to process loan applications and utilize Machine Learning to predict approval statuses. 

This project demonstrates enterprise-grade microservice architecture, secure database management, and automated machine learning deployment.

## Architecture Overview

The system is composed of four isolated Docker containers communicating across a custom Docker bridge network:

1. **Frontend (React + Nginx):** A dynamic Single Page Application built with React and Material UI. Served via a custom-configured Nginx web server to handle client-side routing.
2. **Backend API (Java Spring Boot):** The core business logic and REST API, handling secure database transactions and bridging the gap between the frontend and the AI service.
3. **AI Microservice (Python + Flask):** A standalone machine learning engine. It trains a `scikit-learn` Random Forest model dynamically during the Docker build process to ensure 100% environment compatibility, exposing a `/api/predict` endpoint for the Java backend.
4. **Database (MySQL):** A persistent relational database securely storing applicant data and AI predictions, protected by Docker volumes.

## Technical Highlights
* **Dynamic ML Training:** The AI model (`loan_model.pkl`) is not hardcoded; it is dynamically generated inside the container during the build phase using `train_model.py` to prevent environment version mismatches.
* **Routing Support:** The frontend utilizes a custom `nginx.conf` with `try_files` directives to prevent 404 errors upon browser refresh, a common pitfall in containerized React apps.
* **Persistent Authentication:** Utilizes browser `localStorage` to persist user sessions across page reloads.
* **Security Audited:** The application has undergone dynamic application security testing (DAST) via OWASP ZAP. Check the `Security-Audit` folder for the full PDF report and summary.

---

## Start Guide

### Prerequisites
* [Docker](https://www.docker.com/products/docker-desktop) and Docker Compose installed.
* Git installed.

### 1. Environment Setup
Create a file named `.env` in the root directory to store secure database credentials. It should contain exactly this (Passwords may be altered):

MYSQL_DATABASE=assess_ai
MYSQL_USER=springuser
MYSQL_PASSWORD= A Password
MYSQL_ROOT_PASSWORD= A Password

