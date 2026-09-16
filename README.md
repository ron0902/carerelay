# CareRelay

## Overview

CareRelay is a full-stack caregiver management system built with a React + TypeScript + Vite + Tailwind CSS frontend and a PHP + MySQL backend. The project supports role-based dashboards for administrators, caregivers, and patients.

---

## Technology Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

### Backend
- PHP
- MySQL
- PDO for database access
- Simple REST-style API endpoints

---

## Project Structure

```
carerelay-client/
├── backend/
│   ├── api/
│   │   ├── auth/
│   │   ├── patients/
│   │   ├── caregivers/
│   │   ├── organizations/
│   │   ├── appointments/
│   │   ├── assignments/
│   │   ├── reports/
│   │   ├── care_plans/
│   │   ├── notifications/
│   │   └── users/
│   ├── config/
│   │   └── database.php
│   └── index.php
├── DATABASE/
│   └── carerelay_db.sql
├── DOCS/
│   ├── API_Documentation.md
│   │   └── Technical Design.docx
├── src/
├── public/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── README.md
└── .gitignore
```

---

## Getting Started

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Gemini caregiver matching

The assignment form calls `backend/api/assignments/match.php` when a patient and organization are selected. Gemini ranks caregivers by the patient's care needs; if Gemini is unavailable, the endpoint falls back to exact skill matching.

Keep the Gemini key on the PHP server. In XAMPP Apache, add this to the active virtual host or Apache configuration, replace the placeholder, and restart Apache:

```apache
SetEnv GEMINI_API_KEY "your-gemini-api-key"
```

The frontend never receives this key. The PHP cURL extension must also be enabled.

---

## Available Modules

- Authentication
- Dashboard
- Patients
- Caregivers
- Organizations
- Care Assignments
- Appointments
- Reports
- Settings
- Patient Portal
- Caregiver Portal

---

## Documentation

Project documentation is available in the `/docs` directory.

---

## Repository

```
frontend/
backend/
database/
docs/
```

---

## Status

- ✅ Frontend: In Progress
- 🚧 Backend: Planned
- 🚧 Database: Planned
- 🚧 API Integration: Planned

---

## Contributors

- CareRelay Development Team