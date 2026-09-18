# BloodConnect — API Documentation

Base URL: `http://localhost:8080/api`

All request/response bodies are JSON. There is no authentication token required yet — the `login` endpoint simply verifies credentials and returns the user object.

---

## 1. User APIs (`/users`)

### POST `/users/signup`
Registers a new user (donor or patient).

**Request body**
```json
{
  "name": "Arun",
  "email": "arun@test.com",
  "password": "test123",
  "phone": "9876543210",
  "role": "DONOR"
}
```
`role` must be one of: `DONOR`, `PATIENT`, `HOSPITAL`, `ADMIN`.

**Response `200 OK`**
```json
{
  "id": 7,
  "name": "Arun",
  "email": "arun@test.com",
  "password": "$2a$10$...(hashed)",
  "phone": "9876543210",
  "role": "DONOR"
}
```

**Errors**
- `500` — `Email already registered` if the email is already in use.

---

### POST `/users/login`
Authenticates a user.

**Request body**
```json
{
  "email": "arun@test.com",
  "password": "test123"
}
```

**Response `200 OK`** — same shape as signup response.

**Errors**
- `500` — `Invalid email or password`

---

## 2. Donor Profile APIs (`/donors`)

### POST `/donors/profile`
Creates a donor profile for an existing user. Must be called once, after a `DONOR` signs up.

**Request body**
```json
{
  "userId": 7,
  "bloodGroup": "O+",
  "gender": "MALE",
  "latitude": 10.7905,
  "longitude": 78.7047
}
```

**Response `200 OK`**
```json
{
  "id": 1,
  "user": { "id": 7, "name": "Arun", "email": "arun@test.com", "...": "..." },
  "bloodGroup": "O+",
  "lastDonationDate": null,
  "latitude": 10.7905,
  "longitude": 78.7047,
  "isAvailable": true,
  "gender": "MALE"
}
```

---

## 3. Blood Request APIs (`/requests`)

### POST `/requests/create`
Raises a new emergency blood request. Called by a `PATIENT`.

**Request body**
```json
{
  "patientId": 9,
  "bloodGroup": "O+",
  "unitsNeeded": 2,
  "urgencyLevel": "CRITICAL",
  "hospitalName": "Trichy Hospital",
  "latitude": 10.7900,
  "longitude": 78.7000
}
```
`urgencyLevel` must be one of: `CRITICAL`, `URGENT`, `NORMAL`.

**Response `200 OK`**
```json
{
  "id": 4,
  "patient": { "id": 9, "name": "Kumar", "...": "..." },
  "bloodGroup": "O+",
  "unitsNeeded": 2,
  "urgencyLevel": "CRITICAL",
  "hospitalName": "Trichy Hospital",
  "latitude": 10.79,
  "longitude": 78.70,
  "status": "PENDING",
  "createdAt": "2026-09-17T10:39:08"
}
```

### GET `/requests/create`
Returns every blood request in the system (used by the Patient Dashboard, then filtered client-side to the logged-in patient's own requests).

**Response `200 OK`** — array of request objects (same shape as above).

---

## 4. Matching APIs (`/matching`)

### GET `/matching/find/{requestId}`
Returns compatible, available donors for a specific blood request, ranked by match score (best first).

**Response `200 OK`**
```json
[
  {
    "donorId": 1,
    "donorName": "Arun",
    "donorPhone": "9876543210",
    "donorBloodGroup": "O+",
    "distanceKm": 0.0,
    "matchScore": 110.0
  },
  {
    "donorId": 2,
    "donorName": "Priya",
    "donorPhone": "9876543211",
    "donorBloodGroup": "O+",
    "distanceKm": 1.92,
    "matchScore": 108.08
  }
]
```

### GET `/matching/requests-for-donor/{userId}`
Returns pending blood requests that a specific donor is compatible with, ranked by distance (nearest first). Used by the Donor Dashboard.

**Response `200 OK`**
```json
[
  {
    "requestId": 4,
    "patientName": "Kumar",
    "bloodGroup": "O+",
    "unitsNeeded": 2,
    "urgencyLevel": "CRITICAL",
    "hospitalName": "Trichy Hospital",
    "distanceKm": 0.0
  }
]
```

---

## 5. Matching Logic Summary

- **Compatibility** — a fixed blood-group compatibility matrix decides which donor groups may donate to a given patient group (e.g. `O-` can donate to everyone; `AB+` can receive from everyone).
- **Distance** — calculated with the Haversine formula from donor and request latitude/longitude, in kilometres.
- **Score** — `matchScore = (100 - distanceKm) + (10 if exact blood-group match else 0)`, sorted descending.

---

## 6. Quick Test Commands (PowerShell)

```powershell
$body = @{ name="Test"; email="test@test.com"; password="test123"; phone="9999999999"; role="DONOR" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:8080/api/users/signup" -Method Post -Body $body -ContentType "application/json"
```