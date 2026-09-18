# BloodConnect — Project Flow

## 1. Overview

BloodConnect connects blood donors with patients who have an emergency need, and automatically ranks donors by blood-group compatibility and distance from the patient.

**Stack:** Spring Boot (Java, Maven) + MySQL backend · React (Vite) frontend · REST APIs over HTTP.

---

## 2. Architecture
React Frontend (localhost:5173)
|
| Axios (baseURL: http://localhost:8080/api)
v
Spring Boot Backend (localhost:8080)
Controller -> Service -> Repository
|
v
MySQL Database (blooddonation)
users | donor_profiles | blood_requests


---

## 3. User Journeys

### 3.1 Donor Journey
1. Donor opens `Register` page, signs up with `role = DONOR` → `POST /users/signup`.
2. Donor's blood group, gender and location are saved via `POST /donors/profile`.
3. Donor logs in (`POST /users/login`) and lands on **Donor Dashboard**.
4. Dashboard calls `GET /matching/requests-for-donor/{userId}` and shows any pending, compatible blood requests near the donor, with distance.

### 3.2 Patient Journey
1. Patient signs up with `role = PATIENT` → `POST /users/signup`.
2. Patient logs in and lands on **Patient Dashboard**.
3. Patient clicks **"Request Blood"** → fills the Emergency Request form (blood group, units, hospital, urgency) → `POST /requests/create`.
4. Patient Dashboard calls `GET /requests/create` (patient's own requests) and, for each request, `GET /matching/find/{requestId}` to show ranked matched donors with phone number and distance.

---

## 4. Backend Package Structure

com.blooddonation.backend
├── config/ SecurityConfig (BCrypt password encoder bean)
├── controller/ UserController, DonorProfileController,
│ BloodRequestController, MatchingController
├── service/ UserService, DonorProfileService,
│ BloodRequestService, MatchingService
├── repository/ UserRepository, DonorProfileRepository,
│ BloodRequestRepository (Spring Data JPA)
├── entity/ User, DonorProfile, BloodRequest
└── dto/ UserSignupRequest, LoginRequest,
DonorProfileRequest, BloodRequestDto


---

## 5. Frontend Structure

frontend/src
├── pages/ Login, Register, PatientDashboard,
│ DonorDashboard, EmergencyRequest
├── components/ Navbar, ProtectedRoute
├── context/ AuthContext (login/logout, localStorage persistence)
├── services/api.js Axios instance, baseURL http://localhost:8080/api
└── App.jsx Route definitions


---

## 6. Matching Engine — How It Works

1. A blood request specifies a `bloodGroup`, `latitude`, `longitude`.
2. The compatibility matrix finds every donor blood group allowed to donate to that group.
3. All **available** donor profiles with a compatible blood group are fetched.
4. For each, distance to the request is computed with the Haversine formula.
5. A match score is calculated (closer + exact blood-group match = higher score).
6. Results are sorted by score, descending, and returned.

The same engine, viewed from the other direction, finds pending requests near a given donor (`requests-for-donor`).

---

## 7. Security

- Passwords are hashed with BCrypt (`spring-security-crypto`) before being stored — never saved or compared in plain text.
- CORS is open (`@CrossOrigin(origins = "*")`) for local development; this should be restricted before any real deployment.

---

## 8. Known Test Accounts (development only)

| Name  | Email             | Password | Role    |
|-------|-------------------|----------|---------|
| Arun  | arun@test.com     | test123  | DONOR   |
| Priya | priya@test.com    | test123  | DONOR   |
| Kumar | kumar@test.com    | test123  | PATIENT |

---

## 9. Future Enhancements

- Donation-eligibility rules (90/120-day gap since last donation)
- Real-time SMS/email notifications to matched donors
- Automatic geocoding of a typed address into latitude/longitude
- Hospital/Admin role and request-fulfilment tracking
- JWT-based authentication