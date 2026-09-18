 🩸 BloodConnect — Blood Donation Network & Emergency Matching

BloodConnect is a full-stack web application that connects voluntary blood donors with patients who have an urgent need for blood. When a patient raises an emergency request, the system automatically finds compatible, available donors and ranks them by real-world distance — so the nearest, most suitable donor is shown first.

---

## ✨ Features

- 🔐 **Secure authentication** — signup/login with BCrypt-hashed passwords, role-based (Donor / Patient)
- 🩸 **Donor profiles** — blood group, location and availability
- 🚨 **Emergency blood requests** — blood group, units needed, hospital, urgency level
- 🎯 **Smart matching engine** — blood-group compatibility matrix + Haversine distance formula + match scoring
- 📊 **Live dashboards** — patients see matched donors in real time; donors see nearby compatible requests
- 🎨 Clean, responsive UI

---

## 🛠️ Tech Stack

| Layer      | Technology                                  |
|------------|----------------------------------------------|
| Backend    | Java 17, Spring Boot 3.3, Spring Data JPA, Maven |
| Database   | MySQL 8.0                                     |
| Security   | Spring Security Crypto (BCrypt)               |
| Frontend   | React 19, Vite, React Router, Axios           |

---

## 📐 Architecture

React Frontend (5173) --Axios/JSON--> Spring Boot API (8080) --JPA--> MySQL
Login / Register Controller → Service → Repository users
Patient Dashboard donor_profiles
Donor Dashboard blood_requests
Emergency Request


---

## 🎯 How Matching Works

1. A patient submits a request with a blood group and location.
2. A compatibility matrix determines which donor blood groups can safely donate (e.g. `O-` is a universal donor, `AB+` is a universal recipient).
3. Every **available** donor with a compatible blood group has their distance calculated using the **Haversine formula**.
4. Each donor gets a `matchScore = (100 − distanceKm) + (10 if exact blood-group match)`.
5. Results are sorted by score — nearest and most exact match first.

The same engine also works in reverse: a donor's dashboard shows pending requests they're compatible with, nearest first.

Full endpoint reference: [`docs/API_DOCUMENTATION.md`](docs/API_DOCUMENTATION.md)
Full flow / package structure: [`docs/PROJECT_FLOW.md`](docs/PROJECT_FLOW.md)

---

## 📂 Project Structure

Blood Donation/
├── backend/ Spring Boot REST API
│ └── src/main/java/com/blooddonation/backend/
│ ├── config/ (BCrypt password encoder)
│ ├── controller/
│ ├── service/
│ ├── repository/
│ ├── entity/
│ └── dto/
├── frontend/ React (Vite) SPA
│ └── src/
│ ├── pages/ Login, Register, PatientDashboard, DonorDashboard, EmergencyRequest
│ ├── components/ Navbar, ProtectedRoute
│ ├── context/ AuthContext
│ └── services/api.js
└── docs/ API & flow documentation


---

## 🚀 Getting Started

### Prerequisites
- Java 17+, Maven
- Node.js + npm
- MySQL 8.0 (running locally)

### 1. Database
```sql
CREATE DATABASE blooddonation;
```

### 2. Backend
```bash
cd backend
# set your MySQL username/password in src/main/resources/application.properties
./mvnw spring-boot:run
```
Runs on `http://localhost:8080`

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173`

---

## 🧪 Test Accounts (development)

| Name  | Email             | Password | Role    |
|-------|-------------------|----------|---------|
| Arun  | arun@test.com     | test123  | Donor   |
| Priya | priya@test.com    | test123  | Donor   |
| Kumar | kumar@test.com    | test123  | Patient |

---
---

## 🔮 Future Enhancements

- Donation-eligibility rules (90/120-day gap since last donation)
- Real-time SMS/email notifications to matched donors
- Automatic geocoding of hospital address → latitude/longitude
- Hospital/Admin role with request-fulfilment tracking
- JWT-based authentication

---

## 👤 Arun karthic

Capstone Project — Blood Donation Network & Emergency Matching
