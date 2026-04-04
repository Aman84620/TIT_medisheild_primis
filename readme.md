# MediShield AI: Pathogen Tracing & Infection Control Dashboard

> Ditching the spreadsheets to help hospitals track and isolate multi-drug resistant pathogen outbreaks in real-time.

*Status: Hackathon Prototype — Built during the Technocrats Innovation Challenge 2k26*

MediShield AI is a digital contact tracing and tracking system we're building for hospital infection control teams. We noticed most wards still rely on manual data entry and shared Excel files to figure out who was exposed to what. We wanted to build something faster, safer, and a lot more modern.

## Why This Project?

Tracking multi-drug resistant (MDR) bugs usually means digging through paperwork or basic spreadsheet tables. When an outbreak happens on a hospital floor, infection control needs to identify patient-to-patient interactions quickly. We wanted to build a web dashboard that allows staff to visually map interactions and log screenings on the fly, helping isolate potential infection clusters before they get worse.

## What It Actually Does

- **Visual Contact Tracing**: Draws an actual map of patient interactions to help staff spot infection spread quickly.
- **MDR Screening Logs**: A dedicated workflow to record and track multi-drug resistant organisms instead of hacking together an Excel template.
- **Offline-First Storage**: Wi-Fi dead zones are super common in hospitals. The app uses IndexedDB to save data locally in the browser until network access returns.
- **Dashboard & Analytics**: Gives a high-level view of current tracking data and ward hotspots.
- **Bulk CSV Importer**: We know hospitals have tons of legacy data, so you can just drag and drop a CSV file to populate the local database instantly.

## Where This Can Be Useful

- **ICUs and Post-Surgical Wards**: Tracking patient movements where infection risk is aggressively monitored.
- **Bed Management Teams**: Seeing quickly which rooms or zones are flagged for deep cleaning after an outbreak.
- **Infection Response**: Instantly mapping out staff/patient contacts when a new MDR pathogen case is detected.

## Tech Stack

We kept things purely frontend-focused to iterate quickly during the hackathon:

- **Frontend**: React 18, Vite, and TypeScript (saved us hours of debugging late at night)
- **UI & Styling**: Tailwind CSS paired with Shadcn for clean, accessible components out of the box
- **Local Database**: Dexie.js (makes dealing with IndexedDB actually bearable)
- **Visuals**: Recharts for the analytics
- **Parsing**: PapaParse for the CSV drag-and-drop feature

## Demo

There isn't a live hosted version online right now. Since it relies heavily on local browser storage for the prototype phase, you'll need to spin it up locally to test it out.

## Our Current Limitations

To be completely upfront: this is currently a **frontend-only** application. 

We haven't wired up a backend server or a persistent database like PostgreSQL yet. All data you enter is saved strictly in your current browser using IndexedDB. If you clear your browser cache, switch to your phone, or send a link to a teammate, the data won't sync over. 

## Installation

Make sure you've got Node.js installed before starting.

```bash
# Clone the repository
git clone <repository-url>
cd TIT_medisheild_primis

# Move into the frontend folder
cd frontend

# Install the dependencies
npm install

# Boot up the dev server
npm run dev
```

## Usage

Once Vite is running, open your browser to the localhost link (it usually defaults to `http://localhost:5173`). 

You can start playing around by adding some test patients into the screening dashboard, or navigate over to the contact tracing tool to see the visual maps. If you have a CSV file formatted with testing data, drop it into the import tool to load it up.

**Dev Tip**: If you want to see the offline-first feature in action, open your browser's dev tools, go to the Network tab, and toggle your throttling to "Offline". Try submitting a new screening form and watch the app cache it locally.

## Project Structure

A quick map of the codebase if you want to poke around:

- `/src/components` - Reusable UI elements (this is where all the Shadcn code sits).
- `/src/pages` - The high-level views for routing.
- `/src/hooks` - Custom hooks, mostly holding our Dexie database logic.
- `/src/lib` - Utility and helper functions.

## Screenshots

*(We're planning to attach actual screenshots of the contact tracing map and dashboard here once we finalize the UI colors and layout.)*

## Future Improvements

If we decide to push this past the hackathon phase, the next steps are:
- Hooking up a real backend service so data syncs across all hospital terminals.
- Adding role-based access control (nurses, admins, and doctors need different views).
- Polishing the mobile views so staff can comfortably use the app on an iPad during bedside rounds.
- Adding an export feature for generating basic HTML/PDF compliance reports.

## The Team

Hacked together with a lot of coffee by Aman84620 and the Primis team. If you happen to be looking through the code and spot a glaring bug or have an idea, feel free to open an issue or drop a PR.
