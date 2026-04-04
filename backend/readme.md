# MediShield Hybrid Core (Backend)

The Node.js/Express backend powering the MediShield Primis AI diagnostic and contact tracing system.

## Overview

This is the central nervous system for the MediShield hackathon project. It exposes REST APIs for the frontend dashboard, handles pathogen data ingestion mapping, tracks patients, and orchestrates our multi-LLM diagnostic checking pipeline. It was built fast for the hackathon, so expect some shortcuts (especially in auth and persistent storage).

## What This Backend Handles

- **Frontend API**: Serves all the endpoints used by the dashboard (patient listing, stats, auth).
- **Multi-LLM Diagnostics**: Takes patient lab data and polls Gemini, Mistral, and Groq concurrently to reach a consensus on infection risk. Falls back to a local math model if the cloud APIs fail.
- **Contact Tracing Proxy**: Integrates with a location service (Radar.io) to simulate patient overlap and risk areas.
- **Data Ingestion**: Can handle single or bulk patient record creation.

## API Overview

Here are the main endpoints we are exposing right now:

- **Auth**
  - `POST /api/auth/login` (Returns a mock JWT for now)
- **Patients**
  - `GET /api/patients` (List all patients)
  - `POST /api/patients` (Submit single or bulk lab data, runs AI analysis instantly before saving)
- **Dashboard**
  - `GET /api/dashboard/stats` (Overview metrics)
- **Tracing & AI**
  - `POST /api/ai/analyze` (Direct AI diagnostic call)
  - `POST /api/tracing/analyze` (Simulates contact tracing based on our mock contacts)
  - `POST /api/tracing/track` (Updates location context, optionally with Radar.io)
- **System**
  - `GET /api/config/status` (Helps debug if our .env keys are loaded)

## Data Layer

We're using **Firebase Cloud Firestore** for storage. 

However, since we switch machines a lot at hackathons, there's an **automatic in-memory fallback**. If you don't load the Firebase credentials in your `.env`, the server boots in mock mode. You can still create and analyze patients, but everything vanishes when the server restarts.

## Tech Stack

- **Framework:** Express.js (v5)
- **Storage:** Firebase Admin SDK 
- **AI Libraries:** `@google/generative-ai`, `axios` (for Mistral/Groq), plus `natural` and `ml-matrix` for local processing
- **Environment:** dotenv, nodemon

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root of `/backend`. Here's what it should look like (ask me for the actual keys):
   ```env
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   
   # AI / LLMs
   GEMINI_API_KEY=your_key
   MISTRAL_API_KEY=your_key
   GROQ_API_KEY=your_key
   
   # Optional Tracing
   RADAR_API_KEY=your_key
   
   # Firebase (Optional, will use RAM if omitted)
   FIREBASE_PROJECT_ID=...
   FIREBASE_CLIENT_EMAIL=...
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

## Example API Call

**Creating a new patient assessment:**
`POST /api/patients`

*Request:*
```json
{
  "name": "Alex R.",
  "symptoms": ["Fever", "Cough", "Loss of taste"],
  "location": "Ward Block C"
}
```

*Response:*
```json
{
  "success": true,
  "count": 1,
  "patients": [
    {
      "name": "Alex R.",
      "symptoms": ["Fever", "Cough", "Loss of taste"],
      "id": "P-1712211234-987",
      "diagnosis": "Suspected Viral Infection",
      "tier": "Tier 2",
      "riskScore": 0.65,
      "source": "MISTRAL + GEMINI (Synthesized)",
      "lastAnalyzed": "2026-04-04T12:00:00.000Z"
    }
  ]
}
```

## Current Limitations

- **Authentication is completely fake.** It hardcodes `admin@medishield.ai` : `demo123` and returns a dummy JWT. Do not put real patient data in here.
- Express is doing too much right now. The `index.js` file is massive and handles both routing and AI result ingestion. 
- Real-time contact tracing is simulated. We rely on mock data and mock contacts unless you actually ping the endpoint with real lat/lngs.
- The `try/catch` blocks in the Firebase integration are lazy and swallow errors if it falls back to mock mode.

## Future Improvements

- Move the AI polling to a background queue (like BullMQ + Redis). Right now the HTTP request blocks until Gemini/Mistral/Groq finish, causing lag.
- Actually verify the JWT in middleware instead of blindly accepting requests.
- Break `index.js` out into `/routes` and `/controllers`.

## Dev Notes

- If you're running this and the frontend can't connect, make sure your `.env` FRONTEND_URL exactly matches where Vite is running.
- If you get `EADDRINUSE` for port 5000, kill the old node process. I added a custom error handler in `index.js` that prints the CLI command to kill it in Windows.
