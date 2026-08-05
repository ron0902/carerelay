# CareRelay API Documentation

Version: 1.0

---

# Overview

This document defines the REST API endpoints for the CareRelay application.

Base URL

```
http://localhost:5000/api
```

All protected endpoints require a valid JWT access token.

Example Header

```http
Authorization: Bearer <JWT_TOKEN>
```

---

# Authentication

## Login

POST /auth/login

Description

Authenticate a user.

Request

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

Response

```json
{
  "token": "...",
  "user": {
    "id": 1,
    "name": "Administrator",
    "role": "Admin"
  }
}
```

---

## Logout

POST /auth/logout

Description

Invalidate the current session.

---

## Get Current User

GET /auth/me

Returns the currently authenticated user.

---

# Dashboard

## Dashboard Statistics

GET /dashboard

Returns dashboard summary.

Example Response

```json
{
  "patients": 145,
  "caregivers": 32,
  "appointments": 21,
  "organizations": 10
}
```

---

# Patients

## Get All Patients

GET /patients

Returns all patients.

---

## Get Patient

GET /patients/{id}

Returns a single patient.

---

## Create Patient

POST /patients

Creates a new patient.

---

## Update Patient

PUT /patients/{id}

Updates patient information.

---

## Delete Patient

DELETE /patients/{id}

Deletes a patient.

---

# Caregivers

## Get Caregivers

GET /caregivers

---

## Get Caregiver

GET /caregivers/{id}

---

## Create Caregiver

POST /caregivers

---

## Update Caregiver

PUT /caregivers/{id}

---

## Delete Caregiver

DELETE /caregivers/{id}

---

# Organizations

## Get Organizations

GET /organizations

---

## Create Organization

POST /organizations

---

## Update Organization

PUT /organizations/{id}

---

## Delete Organization

DELETE /organizations/{id}

---

# Care Assignments

## Get Assignments

GET /assignments

---

## Create Assignment

POST /assignments

---

## Update Assignment

PUT /assignments/{id}

---

## Delete Assignment

DELETE /assignments/{id}

---

# Appointments

## Get Appointments

GET /appointments

---

## Get Appointment

GET /appointments/{id}

---

## Create Appointment

POST /appointments

---

## Update Appointment

PUT /appointments/{id}

---

## Cancel Appointment

DELETE /appointments/{id}

---

# Reports

## Get Reports

GET /reports

---

## Generate Report

POST /reports/generate

---

## Download Report

GET /reports/{id}/download

---

# Notifications

## Get Notifications

GET /notifications

---

## Mark Notification as Read

PUT /notifications/{id}/read

---

# User Profile

## Get Profile

GET /profile

---

## Update Profile

PUT /profile

---

# Settings

## Get Settings

GET /settings

---

## Update Settings

PUT /settings

---

# Response Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 422 | Validation Error |
| 500 | Internal Server Error |

---

# Authentication

The backend uses JSON Web Tokens (JWT).

Workflow

1. User logs in.
2. Backend validates credentials.
3. Backend returns a JWT.
4. Frontend stores the token.
5. Token is sent in the Authorization header for protected requests.

---

# Notes

- All endpoints return JSON.
- All timestamps use ISO 8601 format.
- Input validation is performed by the backend.
- Protected endpoints require a valid JWT.
- API responses follow a consistent response structure.