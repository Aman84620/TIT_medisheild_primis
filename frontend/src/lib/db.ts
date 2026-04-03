// src/lib/db.ts
import Dexie, { Table } from 'dexie';

export interface Report {
  id?: number;
  patientName: string;
  suspect_chance: number; // 0-100
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  timestamp: number;
  details: any; // Full JSON report
  ward: string;
}

class MediShieldDB extends Dexie {
  reports!: Table<Report>;

  constructor() {
    super('MediShieldDB');
    this.version(1).stores({
      reports: '++id, patientName, suspect_chance, riskLevel, timestamp, ward'
    });
  }
}

export const db = new MediShieldDB();

// ✅ Task 5: The Demo Booster (Seed Data)
export const seedDB = async () => {
  const count = await db.reports.count();
  if (count === 0) {
    const dummyReports: Report[] = [
      {
        patientName: "Vikram Malhotra",
        suspect_chance: 92,
        riskLevel: 'CRITICAL',
        timestamp: Date.now() - 1000 * 60 * 15, // 15 mins ago
        ward: 'ICU-North',
        details: { note: "Seeded data" }
      },
      {
        patientName: "Sarah Jones",
        suspect_chance: 88,
        riskLevel: 'HIGH',
        timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
        ward: 'General-West',
        details: { note: "Seeded data" }
      },
      {
        patientName: "Amitabh Bachan",
        suspect_chance: 45,
        riskLevel: 'MEDIUM',
        timestamp: Date.now() - 1000 * 60 * 60 * 5,
        ward: 'ICU-South',
        details: { note: "Seeded data" }
      },
      {
        patientName: "Rahul Dravid",
        suspect_chance: 12,
        riskLevel: 'LOW',
        timestamp: Date.now() - 1000 * 60 * 60 * 24,
        ward: 'General-East',
        details: { note: "Seeded data" }
      },
      // Add more high risk for the "Live Feed" effect
      {
        patientName: "Priya Singh",
        suspect_chance: 95,
        riskLevel: 'CRITICAL',
        timestamp: Date.now() - 1000 * 30, // Just now
        ward: 'Emergency',
        details: { note: "Seeded data" }
      }
    ];
    await db.reports.bulkAdd(dummyReports);
    console.log("🚀 Database seeded with demo data!");
  }
};
