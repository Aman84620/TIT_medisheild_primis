# MediShield: Pathogen Tracing & Infection Control System

> Ditching the spreadsheets to help hospitals track and isolate multi-drug resistant pathogen outbreaks in real-time.

*Status: Hackathon Prototype — Built during the Technocrats Innovation Challenge 2k26*

## Overview

MediShield is a digital contact tracing and tracking system we're building for hospital infection control teams. We noticed most wards still rely on manual data entry and shared Excel files to figure out who was exposed to what. We wanted to build something faster, safer, and a lot more modern.

It features a React dashboard for visually mapping patient interactions, powered by an Express.js backend that handles automated data ingestion and runs a multi-LLM diagnostic pipeline to calculate infection risks.

## Why This Project?

Tracking multi-drug resistant (MDR) bugs usually means digging through paperwork or basic spreadsheet tables. When an outbreak happens on a hospital floor, infection control needs to identify patient-to-patient interactions quickly. We wanted to build a centralized system that allows staff to visually map interactions and log screenings on the fly, helping isolate potential infection clusters before they get worse.

## System Architecture

Our setup splits the heavy lifting between the client UI and a centralized backend API:

- **Frontend (React Dashboard):** Built with Vite, React, and TypeScript. It serves as the primary UI for contact mapping and patient logging. It also features offline-first fallback using IndexedDB for hospital Wi-Fi dead zones.
- **Backend (Node/Express API):** Acts as the central nervous system. It orchestrates our multi-LLM diagnostic checking pipeline, processes patient data, and integrates with location services for tracing.
- **Data Flow:** Patient data is entered (via CSV or manual input) → Frontend sends it to the API → Backend concurrently polls LLMs for a diagnostic risk score → Data is saved to Firestore (or in-memory mock storage) → Frontend pulls updated metrics and visuals.

## What It Actually Does

MediShield acts as a unified hub for tracking infections. Staff can input patient data, and the system automatically calculates risk scores while drawing visual maps of potential pathogen spread across wards, removing the need for legacy spreadsheets.

## Key Features Breakdown

### Frontend Features
- **Visual Contact Tracing:** Draws an actual map of patient interactions to help staff spot infection spread quickly.
- **MDR Screening Logs:** A dedicated interface to record and track multi-drug resistant organisms.
- **Offline-First Storage:** Uses Dexie.js to save data locally in the browser when hospital networks go down.
- **Bulk CSV Importer:** Drag and drop legacy hospital data to instantly populate the local system.

### Backend Features
- **Multi-LLM Diagnostics:** Takes patient lab data and polls Gemini, Mistral, and Groq concurrently to reach a consensus on infection risk. Falls back to a local math model if the cloud APIs fail.
- **Contact Tracing Proxy:** Integrates with location services (Radar.io) to simulate patient overlap and calculate risk areas.
- **In-Memory Fallback Storage:** Automatically defaults to RAM-based storage if Firebase keys aren't provided, allowing the API to boot instantly for hackathon demos.

## How the System Works (Flow) 🚀

1. **User Input:** Infection control staff submits a patient's screening form or uploads bulk lab data on the frontend dashboard.
2. **Backend Processing:** The Express API receives the data and simultaneously pings multiple LLMs (Gemini, Mistral, Groq) to evaluate the infection risk.
3. **Storage Phase:** The finalized assessment is saved to Firebase Cloud Firestore. If Firebase isn't configured, it safely defaults to in-memory storage (or IndexedDB on the frontend if the server is unreachable).
4. **Response to Frontend:** The risk score and diagnosis are sent back to the React app, which updates the central dashboard analytics and contact tracing pathways.

## Tech Stack

### Frontend
- **Framework:** React 18, Vite, TypeScript
- **UI & Styling:** Tailwind CSS, Shadcn
- **Visuals:** Recharts
- **Storage:** Dexie.js (IndexedDB wrapper)

### Backend
- **Framework:** Express.js (v5)
- **AI Libraries:** `@google/generative-ai`, `axios`, `natural`, `ml-matrix`
- **Utility:** dotenv, nodemon

### Database & APIs
- **Persistent Storage:** Firebase Cloud Firestore
- **Location Tracking:** Radar.io API

## Demo

There isn't a live hosted version online right now. Since it's a prototype relying on a local Node server and browser storage integration, you'll need to spin up both the front and backend locally to test the full flow.

## Limitations

To be completely upfront, there are hackathon shortcuts here:
- **Authentication is completely fake:** The login runs on hardcoded credentials (`admin@medishield.ai` : `demo123`). Do not put real patient data in here.
- **Blocking AI Calls:** The backend HTTP requests block until all LLM APIs finish processing, which can cause noticeable lag on the frontend during analysis.
- **Simulated Tracing:** Real-time contact tracing relies on mock data and lat/lng pings rather than physical beacon tracking.
- **Messy Routing:** The backend Express `index.js` file is doing too much and handles both API routing and AI ingestion at once.

## Installation

Make sure you have Node.js installed.

```bash
# Clone the repository
git clone <repository-url>
cd TIT_medisheild_primis
```

### 1. Setup the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `/backend` root. It will default to in-memory mode if you skip Firebase keys:
```env
PORT=5000
FRONTEND_URL=http://localhost:5173

# AI / LLMs (required for diagnostics)
GEMINI_API_KEY=your_key
MISTRAL_API_KEY=your_key
GROQ_API_KEY=your_key

# Optional (for real tracking and persistent storage)
RADAR_API_KEY=your_key
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="..."
```

Start the server:
```bash
npm run dev
```

### 2. Setup the Frontend

Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```

The app will boot at `http://localhost:5173`. 
*(Dev Tip: Use the browser network tab to throttle to "Offline" and test the local caching features.)*

## API Overview

Key backend endpoints powering the dashboard:
- `POST /api/patients` — Submit single or bulk lab data, runs AI analysis instantly before saving.
- `GET /api/patients` — List all monitored patients.
- `POST /api/ai/analyze` — Direct path for ad-hoc AI diagnostic calls.
- `POST /api/tracing/track` — Updates location context to map interaction overlaps.

## Project Structure

A quick map of the codebase:
- `/frontend/src/pages` — Main UI views (Dashboard, Contact Tracing, Import).
- `/frontend/src/hooks` — Client-side database (Dexie) and state logic.
- `/backend/index.js` — Core API router and LLM orchestration logic.
- `/backend/config` — Environment and Firebase initializers.

## Future Improvements

If we decide to push this past the hackathon phase, the next steps are:
- Moving the AI polling to a background queue (like BullMQ + Redis) to prevent HTTP blocking.
- Breaking out the massive backend `index.js` into modular routes and controllers.
- Hooking up real role-based access control (RBAC) so nurses, admins, and doctors have distinct views and actual JWT validation.
- Polishing the mobile frontend views so staff can comfortably use the dashboard on an iPad during bedside rounds.

## The Team

Hacked together with a lot of coffee by Aman84620 and the Primis team. If you happen to be looking through the code and spot a glaring bug or have an idea, feel free to open an issue or drop a PR.
