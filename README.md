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