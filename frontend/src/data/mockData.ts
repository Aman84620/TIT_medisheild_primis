// ✅ HOSPITAL-SCALE REALISTIC MOCK DATA
// Enhanced with temporal patterns, outbreak scenarios, and production-ready diversity

import { Patient, ContactEvent, Alert, LabResult, Device, Ward, OutbreakCluster } from '@/types';

// Helper: Generate realistic timestamps (last 7 days)
const daysAgo = (days: number, hoursOffset: number = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(date.getHours() - hoursOffset);
  return date.toISOString();
};

// ============================================================================
// PATIENTS - Increased to 15 for realism, diverse risk profiles
// ============================================================================
export const mockPatients: Patient[] = [
  // Critical cluster - ICU North (MRSA outbreak)
  {
    id: 'P-10234',
    name: 'Rajesh Kumar',
    dob: '1965-03-15',
    age: 59,
    admissionId: 'ADM-2024-001-1234',
    admissionDate: daysAgo(7),
    room: '301A',
    currentWard: 'ICU-North',
    riskScore: 92,
    status: 'isolated',
    mdrStatus: 'positive',
    lastScreening: daysAgo(0, 6),
    comorbidities: ['Diabetes', 'COPD', 'Post-surgical']
  },
  {
    id: 'P-10236',
    name: 'Priya Sharma',
    dob: '1952-11-08',
    age: 72,
    admissionId: 'ADM-2024-001-1256',
    admissionDate: daysAgo(5),
    room: '302B',
    currentWard: 'ICU-North',
    riskScore: 78,
    status: 'critical',
    mdrStatus: 'suspected',
    lastScreening: daysAgo(0, 8),
    comorbidities: ['Renal failure', 'Immunosuppressed']
  },
  {
    id: 'P-10238',
    name: 'Amit Patel',
    dob: '1968-09-30',
    age: 56,
    admissionId: 'ADM-2024-001-1278',
    admissionDate: daysAgo(3),
    room: '303A',
    currentWard: 'ICU-North',
    riskScore: 85,
    status: 'isolated',
    mdrStatus: 'positive',
    lastScreening: daysAgo(0, 4),
    comorbidities: ['Cardiac surgery', 'Ventilator-dependent']
  },
  
  // ICU South - Secondary cluster
  {
    id: 'P-10240',
    name: 'Sunita Reddy',
    dob: '1975-06-12',
    age: 49,
    admissionId: 'ADM-2024-001-1290',
    admissionDate: daysAgo(4),
    room: '305B',
    currentWard: 'ICU-South',
    riskScore: 67,
    status: 'critical',
    mdrStatus: 'positive',
    lastScreening: daysAgo(0, 12),
    comorbidities: ['Sepsis', 'Multi-organ failure']
  },
  {
    id: 'P-10241',
    name: 'Vikram Singh',
    dob: '1958-04-20',
    age: 66,
    admissionId: 'ADM-2024-001-1301',
    admissionDate: daysAgo(2),
    room: '306A',
    currentWard: 'ICU-South',
    riskScore: 54,
    status: 'monitoring',
    mdrStatus: 'suspected',
    lastScreening: daysAgo(1),
    comorbidities: ['Pneumonia', 'CVA']
  },

  // General wards - Lower risk
  {
    id: 'P-10235',
    name: 'Ananya Gupta',
    dob: '1978-07-22',
    age: 46,
    admissionId: 'ADM-2024-001-1245',
    admissionDate: daysAgo(6),
    room: '215B',
    currentWard: 'General-East',
    riskScore: 38,
    status: 'monitoring',
    mdrStatus: 'negative',
    lastScreening: daysAgo(2),
    comorbidities: ['Appendectomy']
  },
  {
    id: 'P-10237',
    name: 'Deepak Verma',
    dob: '1990-02-14',
    age: 34,
    admissionId: 'ADM-2024-001-1267',
    admissionDate: daysAgo(4),
    room: '118A',
    currentWard: 'General-West',
    riskScore: 21,
    status: 'stable',
    mdrStatus: 'negative',
    lastScreening: daysAgo(3),
    comorbidities: []
  },
  {
    id: 'P-10242',
    name: 'Kavita Iyer',
    dob: '1982-08-05',
    age: 42,
    admissionId: 'ADM-2024-001-1312',
    admissionDate: daysAgo(3),
    room: '220C',
    currentWard: 'General-East',
    riskScore: 29,
    status: 'stable',
    mdrStatus: 'negative',
    lastScreening: daysAgo(2),
    comorbidities: ['Cholecystectomy']
  },
  {
    id: 'P-10243',
    name: 'Ravi Malhotra',
    dob: '1971-12-18',
    age: 53,
    admissionId: 'ADM-2024-001-1323',
    admissionDate: daysAgo(5),
    room: '125D',
    currentWard: 'General-West',
    riskScore: 43,
    status: 'monitoring',
    mdrStatus: 'pending',
    lastScreening: daysAgo(1),
    comorbidities: ['Diabetes', 'HTN']
  },

  // Additional patients for volume
  {
    id: 'P-10244',
    name: 'Meena Nair',
    dob: '1963-05-30',
    age: 61,
    admissionId: 'ADM-2024-001-1334',
    admissionDate: daysAgo(8),
    room: '304C',
    currentWard: 'ICU-North',
    riskScore: 71,
    status: 'critical',
    mdrStatus: 'suspected',
    lastScreening: daysAgo(0, 10),
    comorbidities: ['ARDS', 'Post-cardiac arrest']
  },
  {
    id: 'P-10245',
    name: 'Sanjay Kapoor',
    dob: '1987-11-25',
    age: 37,
    admissionId: 'ADM-2024-001-1345',
    admissionDate: daysAgo(2),
    room: '222A',
    currentWard: 'General-East',
    riskScore: 16,
    status: 'stable',
    mdrStatus: 'negative',
    lastScreening: daysAgo(1),
    comorbidities: []
  },
  {
    id: 'P-10246',
    name: 'Lakshmi Devi',
    dob: '1955-03-08',
    age: 69,
    admissionId: 'ADM-2024-001-1356',
    admissionDate: daysAgo(6),
    room: '307B',
    currentWard: 'ICU-South',
    riskScore: 62,
    status: 'monitoring',
    mdrStatus: 'negative',
    lastScreening: daysAgo(1),
    comorbidities: ['CHF', 'CKD']
  },
  {
    id: 'P-10247',
    name: 'Arjun Desai',
    dob: '1993-09-14',
    age: 31,
    admissionId: 'ADM-2024-001-1367',
    admissionDate: daysAgo(1),
    room: '130B',
    currentWard: 'General-West',
    riskScore: 12,
    status: 'stable',
    mdrStatus: 'negative',
    lastScreening: daysAgo(0, 18),
    comorbidities: ['Fracture repair']
  },
  {
    id: 'P-10248',
    name: 'Pooja Menon',
    dob: '1980-07-07',
    age: 44,
    admissionId: 'ADM-2024-001-1378',
    admissionDate: daysAgo(4),
    room: '225E',
    currentWard: 'General-East',
    riskScore: 35,
    status: 'monitoring',
    mdrStatus: 'pending',
    lastScreening: daysAgo(0, 20),
    comorbidities: ['Hysterectomy']
  },
  {
    id: 'P-10249',
    name: 'Harish Rao',
    dob: '1949-01-22',
    age: 75,
    admissionId: 'ADM-2024-001-1389',
    admissionDate: daysAgo(9),
    room: '308A',
    currentWard: 'ICU-South',
    riskScore: 88,
    status: 'critical',
    mdrStatus: 'suspected',
    lastScreening: daysAgo(0, 5),
    comorbidities: ['Stroke', 'AF', 'DM']
  }
];

// ============================================================================
// CONTACT EVENTS - Expanded with outbreak transmission chains
// ============================================================================
export const mockContacts: ContactEvent[] = [
  // Primary case (P-10234 - Rajesh Kumar) contacts
  {
    id: 'C-001',
    sourceId: 'S-042',
    sourceName: 'Dr. Neha Kapoor',
    sourceType: 'staff',
    targetPatientId: 'P-10234',
    startTime: daysAgo(0, 10),
    endTime: daysAgo(0, 9.5),
    durationSeconds: 1800,
    proximityScore: 95,
    location: 'ICU-N, Room 301A',
    contactType: 'direct',
    ppeCompliance: true,
    riskAssessment: 'medium'
  },
  {
    id: 'C-002',
    sourceId: 'S-089',
    sourceName: 'Nurse Rekha Pillai',
    sourceType: 'staff',
    targetPatientId: 'P-10234',
    startTime: daysAgo(0, 8),
    endTime: daysAgo(0, 7.5),
    durationSeconds: 1800,
    proximityScore: 92,
    location: 'ICU-N, Room 301A',
    contactType: 'direct',
    ppeCompliance: true,
    riskAssessment: 'medium'
  },
  {
    id: 'C-003',
    sourceId: 'P-10236',
    sourceName: 'Priya Sharma',
    sourceType: 'patient',
    targetPatientId: 'P-10234',
    startTime: daysAgo(2, 6),
    endTime: daysAgo(2, 5.5),
    durationSeconds: 1800,
    proximityScore: 52,
    location: 'ICU-N, Corridor 3F',
    contactType: 'indirect',
    ppeCompliance: false,
    riskAssessment: 'high'
  },
  {
    id: 'C-004',
    sourceId: 'D-007',
    sourceName: 'IV Pump #7',
    sourceType: 'device',
    targetPatientId: 'P-10234',
    startTime: daysAgo(1),
    endTime: daysAgo(0, 12),
    durationSeconds: 43200,
    proximityScore: 100,
    location: 'ICU-N, Room 301A',
    contactType: 'environmental',
    riskAssessment: 'high'
  },

  // Secondary transmission - P-10236 (Priya)
  {
    id: 'C-005',
    sourceId: 'S-042',
    sourceName: 'Dr. Neha Kapoor',
    sourceType: 'staff',
    targetPatientId: 'P-10236',
    startTime: daysAgo(1, 14),
    endTime: daysAgo(1, 13.3),
    durationSeconds: 2520,
    proximityScore: 88,
    location: 'ICU-N, Room 302B',
    contactType: 'direct',
    ppeCompliance: true,
    riskAssessment: 'low'
  },
  {
    id: 'C-006',
    sourceId: 'P-10238',
    sourceName: 'Amit Patel',
    sourceType: 'patient',
    targetPatientId: 'P-10236',
    startTime: daysAgo(1, 10),
    endTime: daysAgo(1, 9.7),
    durationSeconds: 1080,
    proximityScore: 45,
    location: 'ICU-N, Imaging Suite',
    contactType: 'indirect',
    ppeCompliance: false,
    riskAssessment: 'high'
  },

  // Tertiary case - P-10238 (Amit)
  {
    id: 'C-007',
    sourceId: 'S-089',
    sourceName: 'Nurse Rekha Pillai',
    sourceType: 'staff',
    targetPatientId: 'P-10238',
    startTime: daysAgo(0, 6),
    endTime: daysAgo(0, 5.5),
    durationSeconds: 1800,
    proximityScore: 94,
    location: 'ICU-N, Room 303A',
    contactType: 'direct',
    ppeCompliance: true,
    riskAssessment: 'medium'
  },
  {
    id: 'C-008',
    sourceId: 'D-012',
    sourceName: 'Ventilator #12',
    sourceType: 'device',
    targetPatientId: 'P-10238',
    startTime: daysAgo(2),
    endTime: daysAgo(0, 4),
    durationSeconds: 144000,
    proximityScore: 100,
    location: 'ICU-N, Room 303A',
    contactType: 'environmental',
    riskAssessment: 'critical'
  },

  // Cross-ward transmission to ICU-South
  {
    id: 'C-009',
    sourceId: 'S-042',
    sourceName: 'Dr. Neha Kapoor',
    sourceType: 'staff',
    targetPatientId: 'P-10240',
    startTime: daysAgo(1, 12),
    endTime: daysAgo(1, 11.6),
    durationSeconds: 1440,
    proximityScore: 82,
    location: 'ICU-S, Room 305B',
    contactType: 'direct',
    ppeCompliance: false,
    riskAssessment: 'high'
  },
  {
    id: 'C-010',
    sourceId: 'P-10241',
    sourceName: 'Vikram Singh',
    sourceType: 'patient',
    targetPatientId: 'P-10240',
    startTime: daysAgo(0, 16),
    endTime: daysAgo(0, 15.7),
    durationSeconds: 1080,
    proximityScore: 38,
    location: 'ICU-S, CT Scan',
    contactType: 'indirect',
    ppeCompliance: true,
    riskAssessment: 'low'
  },

  // General ward contacts (lower risk)
  {
    id: 'C-011',
    sourceId: 'S-125',
    sourceName: 'Nurse Anil Kumar',
    sourceType: 'staff',
    targetPatientId: 'P-10235',
    startTime: daysAgo(0, 3),
    endTime: daysAgo(0, 2.8),
    durationSeconds: 720,
    proximityScore: 75,
    location: 'Gen-E, Room 215B',
    contactType: 'direct',
    ppeCompliance: true,
    riskAssessment: 'low'
  },
  {
    id: 'C-012',
    sourceId: 'V-001',
    sourceName: 'Family Visitor',
    sourceType: 'visitor',
    targetPatientId: 'P-10237',
    startTime: daysAgo(0, 4),
    endTime: daysAgo(0, 2),
    durationSeconds: 7200,
    proximityScore: 85,
    location: 'Gen-W, Room 118A',
    contactType: 'direct',
    ppeCompliance: true,
    riskAssessment: 'low'
  }
];

// ============================================================================
// LAB RESULTS - Realistic outbreak pathogen distribution
// ============================================================================
export const mockLabResults: LabResult[] = [
  {
    id: 'L-001',
    patientId: 'P-10234',
    specimenType: 'Blood Culture',
    organism: 'Staphylococcus aureus',
    resistanceFlags: ['MRSA', 'Clindamycin-R', 'Erythromycin-R'],
    timestamp: daysAgo(1, 6),
    reportedAt: daysAgo(0, 18),
    status: 'critical',
    labTech: 'Lab Tech - Sunita R.',
    antibioticSensitivity: [
      { antibiotic: 'Vancomycin', result: 'sensitive' },
      { antibiotic: 'Linezolid', result: 'sensitive' },
      { antibiotic: 'Methicillin', result: 'resistant' },
      { antibiotic: 'Clindamycin', result: 'resistant' }
    ]
  },
  {
    id: 'L-002',
    patientId: 'P-10236',
    specimenType: 'Sputum Culture',
    organism: 'Staphylococcus aureus',
    resistanceFlags: ['MRSA', 'Clindamycin-R'],
    timestamp: daysAgo(0, 22),
    reportedAt: daysAgo(0, 10),
    status: 'critical',
    labTech: 'Lab Tech - Rajiv M.',
    antibioticSensitivity: [
      { antibiotic: 'Vancomycin', result: 'sensitive' },
      { antibiotic: 'Methicillin', result: 'resistant' }
    ]
  },
  {
    id: 'L-003',
    patientId: 'P-10238',
    specimenType: 'Wound Swab',
    organism: 'Staphylococcus aureus',
    resistanceFlags: ['MRSA', 'Clindamycin-R', 'Erythromycin-R'],
    timestamp: daysAgo(0, 8),
    reportedAt: daysAgo(0, 2),
    status: 'critical',
    labTech: 'Lab Tech - Sunita R.',
    antibioticSensitivity: [
      { antibiotic: 'Vancomycin', result: 'sensitive' },
      { antibiotic: 'Methicillin', result: 'resistant' }
    ]
  },
  {
    id: 'L-004',
    patientId: 'P-10240',
    specimenType: 'Urine Culture',
    organism: 'Enterococcus faecium',
    resistanceFlags: ['VRE', 'Ampicillin-R'],
    timestamp: daysAgo(0, 14),
    reportedAt: daysAgo(0, 6),
    status: 'flagged',
    labTech: 'Lab Tech - Priya K.',
    antibioticSensitivity: [
      { antibiotic: 'Vancomycin', result: 'resistant' },
      { antibiotic: 'Linezolid', result: 'sensitive' }
    ]
  },
  {
    id: 'L-005',
    patientId: 'P-10244',
    specimenType: 'Tracheal Aspirate',
    organism: 'Staphylococcus aureus',
    resistanceFlags: ['MRSA'],
    timestamp: daysAgo(0, 12),
    reportedAt: daysAgo(0, 4),
    status: 'flagged',
    labTech: 'Lab Tech - Rajiv M.'
  },
  {
    id: 'L-006',
    patientId: 'P-10249',
    specimenType: 'Blood Culture',
    organism: 'Pseudomonas aeruginosa',
    resistanceFlags: ['Carbapenem-R', 'Fluoroquinolone-R'],
    timestamp: daysAgo(0, 10),
    reportedAt: daysAgo(0, 3),
    status: 'flagged',
    labTech: 'Lab Tech - Sunita R.'
  }
];

// ============================================================================
// ALERTS - Temporal progression showing outbreak evolution
// ============================================================================
export const mockAlerts: Alert[] = [
  {
    id: 'A-001',
    type: 'mdr_detected',
    patientIds: ['P-10234'],
    patientNames: ['Rajesh Kumar'],
    severity: 'critical',
    createdAt: daysAgo(1, 4),
    acknowledgedAt: daysAgo(1, 3),
    status: 'in_progress',
    assignedTo: 'Dr. Neha Kapoor',
    description: 'MRSA detected in blood culture. Immediate isolation protocol initiated.',
    ward: 'ICU-North',
    actionsTaken: ['Patient isolated', 'Contact tracing started', 'PPE upgraded'],
    estimatedExposures: 12
  },
  {
    id: 'A-002',
    type: 'high_risk_contact',
    patientIds: ['P-10236', 'P-10234'],
    patientNames: ['Priya Sharma', 'Rajesh Kumar'],
    severity: 'high',
    createdAt: daysAgo(0, 22),
    acknowledgedAt: daysAgo(0, 21),
    status: 'in_progress',
    assignedTo: 'Dr. Neha Kapoor',
    description: 'High-risk contact: Adjacent room exposure to MRSA-positive patient.',
    ward: 'ICU-North',
    actionsTaken: ['Screening ordered', 'Enhanced monitoring'],
    estimatedExposures: 8
  },
  {
    id: 'A-003',
    type: 'cluster_detected',
    patientIds: ['P-10234', 'P-10236', 'P-10238'],
    patientNames: ['Rajesh Kumar', 'Priya Sharma', 'Amit Patel'],
    severity: 'critical',
    createdAt: daysAgo(0, 6),
    status: 'new',
    description: '⚠️ OUTBREAK ALERT: 3 confirmed MRSA cases in ICU-North within 72 hours. Epidemiological investigation required.',
    ward: 'ICU-North',
    estimatedExposures: 24
  },
  {
    id: 'A-004',
    type: 'isolation_required',
    patientIds: ['P-10238'],
    patientNames: ['Amit Patel'],
    severity: 'critical',
    createdAt: daysAgo(0, 4),
    acknowledgedAt: daysAgo(0, 3.5),
    status: 'in_progress',
    assignedTo: 'Dr. Vikram Mehta',
    description: 'MRSA confirmed in surgical wound. Contact precautions mandatory.',
    ward: 'ICU-North',
    actionsTaken: ['Cohort isolation', 'Staff screening'],
    estimatedExposures: 6
  },
  {
    id: 'A-005',
    type: 'screening_due',
    patientIds: ['P-10241', 'P-10246', 'P-10249'],
    patientNames: ['Vikram Singh', 'Lakshmi Devi', 'Harish Rao'],
    severity: 'medium',
    createdAt: daysAgo(0, 2),
    status: 'new',
    description: '3 patients in ICU-South due for routine MDR screening (proximity to outbreak zone).',
    ward: 'ICU-South',
    estimatedExposures: 0
  },
  {
    id: 'A-006',
    type: 'mdr_detected',
    patientIds: ['P-10240'],
    patientNames: ['Sunita Reddy'],
    severity: 'high',
    createdAt: daysAgo(0, 8),
    acknowledgedAt: daysAgo(0, 7),
    status: 'acknowledged',
    assignedTo: 'Dr. Arvind Shah',
    description: 'VRE detected in urine culture. Potential cross-contamination from ICU-North.',
    ward: 'ICU-South',
    actionsTaken: ['Contact isolation'],
    estimatedExposures: 5
  },
  {
    id: 'A-007',
    type: 'outbreak_suspected',
    patientIds: ['P-10234', 'P-10236', 'P-10238', 'P-10244'],
    patientNames: ['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Meena Nair'],
    severity: 'critical',
    createdAt: daysAgo(0, 1),
    status: 'new',
    description: '🚨 EPIDEMIC THRESHOLD: 4 cases with genetic linkage. Ward closure evaluation pending.',
    ward: 'ICU-North',
    estimatedExposures: 35
  }
];

// ============================================================================
// DEVICES - IoT tracking infrastructure
// ============================================================================
export const mockDevices: Device[] = [
  {
    id: 'D-001',
    name: 'RFID Tag - Dr. Neha Kapoor',
    type: 'tag',
    battery: 87,
    lastSeen: daysAgo(0, 0.5),
    location: 'ICU-North, Room 302',
    status: 'active',
    assignedTo: 'S-042',
    calibrationDue: daysAgo(-30)
  },
  {
    id: 'D-002',
    name: 'RFID Tag - Nurse Rekha Pillai',
    type: 'tag',
    battery: 92,
    lastSeen: daysAgo(0, 0.2),
    location: 'ICU-North, Nursing Station',
    status: 'active',
    assignedTo: 'S-089'
  },
  {
    id: 'D-007',
    name: 'IV Pump #7',
    type: 'monitor',
    battery: 100,
    lastSeen: daysAgo(0, 0.3),
    location: 'ICU-North, Room 301A',
    status: 'active',
    assignedTo: 'P-10234'
  },
  {
    id: 'D-012',
    name: 'Ventilator #12',
    type: 'monitor',
    battery: 100,
    lastSeen: daysAgo(0, 0.1),
    location: 'ICU-North, Room 303A',
    status: 'active',
    assignedTo: 'P-10238',
    calibrationDue: daysAgo(-15)
  },
  {
    id: 'D-015',
    name: 'Environmental Sensor - ICU-N',
    type: 'sensor',
    battery: 65,
    lastSeen: daysAgo(0, 0.4),
    location: 'ICU-North, Central',
    status: 'active',
    calibrationDue: daysAgo(-45)
  },
  {
    id: 'D-016',
    name: 'Environmental Sensor - ICU-S',
    type: 'sensor',
    battery: 72,
    lastSeen: daysAgo(0, 0.6),
    location: 'ICU-South, Central',
    status: 'active'
  },
  {
    id: 'D-020',
    name: 'BLE Beacon - Gen-East-Entry',
    type: 'beacon',
    battery: 45,
    lastSeen: daysAgo(0, 1),
    location: 'General-East, Entrance',
    status: 'active'
  },
  {
    id: 'D-021',
    name: 'BLE Beacon - Gen-West-Entry',
    type: 'beacon',
    battery: 38,
    lastSeen: daysAgo(0, 0.8),
    location: 'General-West, Entrance',
    status: 'active'
  },
  {
    id: 'D-025',
    name: 'Defibrillator #25',
    type: 'monitor',
    battery: 88,
    lastSeen: daysAgo(0, 2),
    location: 'ICU-North, Emergency Bay',
    status: 'idle'
  },
  {
    id: 'D-030',
    name: 'Mobile X-Ray Unit',
    type: 'monitor',
    battery: 54,
    lastSeen: daysAgo(0, 4),
    location: 'ICU-South, Room 307',
    status: 'active',
    calibrationDue: daysAgo(-10)
  }
];

// ============================================================================
// WARDS - Hospital infrastructure with capacity tracking
// ============================================================================
export const mockWards: Ward[] = [
  {
    id: 'W-001',
    name: 'ICU-North',
    floor: 3,
    capacity: 12,
    currentOccupancy: 10,
    riskLevel: 'critical',
    activeAlerts: 5,
    isolationRooms: 4,
    availableIsolationRooms: 1,
    lastIncidentDate: daysAgo(0, 6),
    staffAssigned: 8
  },
  {
    id: 'W-002',
    name: 'ICU-South',
    floor: 3,
    capacity: 12,
    currentOccupancy: 9,
    riskLevel: 'high',
    activeAlerts: 2,
    isolationRooms: 4,
    availableIsolationRooms: 2,
    lastIncidentDate: daysAgo(0, 8),
    staffAssigned: 7
  },
  {
    id: 'W-003',
    name: 'General-East',
    floor: 2,
    capacity: 24,
    currentOccupancy: 20,
    riskLevel: 'medium',
    activeAlerts: 0,
    isolationRooms: 2,
    availableIsolationRooms: 2,
    lastIncidentDate: daysAgo(14),
    staffAssigned: 6
  },
  {
    id: 'W-004',
    name: 'General-West',
    floor: 1,
    capacity: 24,
    currentOccupancy: 16,
    riskLevel: 'low',
    activeAlerts: 0,
    isolationRooms: 2,
    availableIsolationRooms: 2,
    lastIncidentDate: daysAgo(21),
    staffAssigned: 5
  },
  {
    id: 'W-005',
    name: 'Emergency Department',
    floor: 1,
    capacity: 18,
    currentOccupancy: 12,
    riskLevel: 'medium',
    activeAlerts: 0,
    isolationRooms: 3,
    availableIsolationRooms: 3,
    lastIncidentDate: daysAgo(7),
    staffAssigned: 10
  }
];

// ============================================================================
// TREND DATA - Last 15 days exposure tracking (realistic outbreak curve)
// ============================================================================
export const dailyExposureData = [
  { date: 'Dec 3', exposures: 8, newCases: 0 },
  { date: 'Dec 4', exposures: 12, newCases: 0 },
  { date: 'Dec 5', exposures: 10, newCases: 0 },
  { date: 'Dec 6', exposures: 15, newCases: 1 },  // Index case
  { date: 'Dec 7', exposures: 22, newCases: 0 },
  { date: 'Dec 8', exposures: 28, newCases: 1 },  // Secondary transmission
  { date: 'Dec 9', exposures: 35, newCases: 0 },
  { date: 'Dec 10', exposures: 31, newCases: 1 }, // Tertiary
  { date: 'Dec 11', exposures: 42, newCases: 1 }, // Outbreak recognized
  { date: 'Dec 12', exposures: 38, newCases: 0 },
  { date: 'Dec 13', exposures: 45, newCases: 1 },
  { date: 'Dec 14', exposures: 52, newCases: 0 },
  { date: 'Dec 15', exposures: 48, newCases: 0 }, // Interventions starting
  { date: 'Dec 16', exposures: 39, newCases: 0 }, // Declining
  { date: 'Dec 17', exposures: 33, newCases: 0 }  // Today
];

// NEW: Pathogen distribution for pie chart
export const pathogenDistribution = [
  { name: 'MRSA', value: 52, color: '#DC2626' },
  { name: 'VRE', value: 23, color: '#F59E0B' },
  { name: 'CRE', value: 15, color: '#8B5CF6' },
  { name: 'ESBL', value: 10, color: '#3B82F6' }
];

// NEW: Outbreak cluster tracking
export const mockOutbreakCluster: OutbreakCluster = {
  id: 'OB-001',
  pathogen: 'MRSA (Strain ST-239)',
  startDate: daysAgo(7),
  affectedPatientIds: ['P-10234', 'P-10236', 'P-10238', 'P-10244'],
  epicenter: 'ICU-North, Room 301A',
  status: 'active',
  generationCount: 3,
  r0Estimate: 2.4
};