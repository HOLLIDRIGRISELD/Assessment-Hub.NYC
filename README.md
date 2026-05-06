# Assessment-Hub.NYC

Assessment-Hub is a fully containerized, distributed full-stack FinTech application designed to process loan applications and utilize Machine Learning to predict approval statuses.

This project demonstrates enterprise-grade microservice architecture, secure database management, automated machine learning deployment, and cloud infrastructure provisioning.

---

## Architecture & Tech Stack

The system is composed of isolated Docker containers communicating across a custom Docker bridge network:

### Frontend (React.js + Material UI)
- Dynamic Single Page Application (SPA)
- Served via Nginx using a multi-stage Docker build
- Uses try_files to handle client-side routing and prevent 404 errors

### Backend API (Java Spring Boot)
- Core REST API layer
- Handles secure database transactions
- Configured with CORS policies
- Integrates frontend with AI microservice
- Uses JPA/Hibernate for ORM

### AI Microservice (Python + Flask)
- Standalone machine learning service
- Dynamically trains a scikit-learn Random Forest model (loan_model.pkl)
- Avoids environment/version conflicts
- Exposes prediction endpoint for backend

### Database (MySQL)
- Persistent relational database
- Stores applicant data and AI predictions
- Uses Docker volumes for data durability

---

## Local Setup & Installation

### Prerequisites
- Docker
- Docker Compose
- Git

---

### Clone the Repository

    git clone https://github.com/HOLLIDRIGRISELD/Assessment-Hub.NYC.git
    cd Assessment-Hub.NYC

---

### Configure Environment Variables

Create a `.env` file in the root directory:

    nano .env

Add the following:

    MYSQL_DATABASE=assess_ai
    MYSQL_USER=springuser
    MYSQL_PASSWORD=your_password
    MYSQL_ROOT_PASSWORD=your_root_password

---

### Build and Deploy Containers

    docker compose up -d --build

This will:
- Build all services
- Start containers
- Link services via Docker network

---

## Security Implementation (OWASP ZAP)

Security was integrated throughout development. A Dynamic Application Security Testing (DAST) audit was performed using OWASP ZAP.

### Implemented Fixes

- Content Security Policy (CSP)
  - Added strict CSP headers in Nginx
  - Mitigates XSS attacks

- CORS Configuration
  - Backend restricted to trusted frontend origins
  - Prevents unauthorized API access

- Information Leakage Prevention
  - Removed server/technology identifiers from headers

Full report available in:

    /OWASP-ZAP

---

## Cloud Deployment

The production system is hosted on a DigitalOcean Droplet (Ubuntu Linux).

### Key Features
- Provisioned via GitHub Student Developer Pack
- SSH key-based authentication only (no password access)
- Uses Docker Compose for deployment
- Fully mirrors local environment for consistency

---

## Features

- Full-stack microservice architecture
- Real-time AI loan approval predictions
- Secure REST API with database integration
- Dockerized environment for portability
- Native Local and Cloud-ready deployment
- Security-hardened configuration
