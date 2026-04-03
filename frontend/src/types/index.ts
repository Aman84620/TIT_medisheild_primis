// ✅ PRODUCTION-GRADE TYPE DEFINITIONS
// Enhanced with additional fields for hospital-scale deployment

export type UserRole = 'admin' | 'infection_control' | 'doctor' | 'nurse' | 'lab_tech' | 'epidemiologist';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  hospitalId: string;
  department?: string;
  lastActive?: string;
}

export interface Patient {
  id: string;
  name: string;
  dob: string;
  age?: number; // Calculated field for quick reference
  admissionId: string;
  admissionDate: string; // NEW: Track admission timeline
  room: string;
  currentWard: string;
  riskScore: number;
  status: 'stable' | 'monitoring' | 'critical' | 'isolated'; // Added 'isolated'
  mdrStatus?: 'positive' | 'suspected' | 'negative' | 'pending'; // NEW: Track MDR status
  lastScreening?: string; // NEW: Last screening timestamp
  comorbidities?: string[]; // NEW: Risk factors
}

export interface ContactEvent {
  id: string;
  sourceId: string;
  sourceName: string;
  sourceType: 'patient' | 'staff' | 'device' | 'visitor'; // Added 'visitor'
  targetPatientId: string;
  startTime: string;
  endTime: string;
  durationSeconds: number;
  proximityScore: number; // 0-100 scale
  location: string;
  contactType?: 'direct' | 'indirect' | 'environmental'; // NEW: Contact classification
  ppeCompliance?: boolean; // NEW: PPE usage tracking
  riskAssessment?: 'low' | 'medium' | 'high'; // NEW: Auto-calculated risk
}

export interface LabResult {
  id: string;
  patientId: string;
  specimenType: string;
  organism: string;
  resistanceFlags: string[];
  timestamp: string;
  reportedAt?: string; // NEW: When lab reported it
  status: 'pending' | 'completed' | 'flagged' | 'critical'; // Added 'critical'
  antibioticSensitivity?: { antibiotic: string; result: 'sensitive' | 'resistant' }[]; // NEW
  labTech?: string; // NEW: Who processed it
}

export interface Alert {
  id: string;
  type: 'mdr_detected' | 'high_risk_contact' | 'outbreak_suspected' | 'isolation_required' | 'cluster_detected' | 'screening_due'; // Added types
  patientIds: string[];
  patientNames: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  acknowledgedAt?: string; // NEW: Track response time
  resolvedAt?: string; // NEW: Track closure
  status: 'new' | 'acknowledged' | 'in_progress' | 'resolved'; // Added 'in_progress'
  assignedTo?: string;
  description: string;
  ward: string;
  actionsTaken?: string[]; // NEW: Document interventions
  estimatedExposures?: number; // NEW: Impact assessment
}

export interface RiskFactor {
  factor: string;
  weight: number;
  category: 'clinical' | 'exposure' | 'environmental' | 'temporal'; // NEW: Categorization
}

export interface RiskScore {
  patientId: string;
  score: number;
  previousScore?: number; // NEW: Track changes
  factors: RiskFactor[];
  calculatedAt: string; // NEW: Timestamp
  trend: 'increasing' | 'stable' | 'decreasing'; // NEW: Direction
}

export interface Device {
  id: string;
  name: string;
  type: 'tag' | 'sensor' | 'monitor' | 'beacon'; // Added 'beacon'
  battery: number;
  lastSeen: string;
  location: string;
  status: 'active' | 'idle' | 'offline' | 'maintenance'; // Added 'maintenance'
  assignedTo?: string; // NEW: Staff or patient assignment
  calibrationDue?: string; // NEW: Maintenance tracking
}

export interface Ward {
  id: string;
  name: string;
  floor: number;
  capacity: number;
  currentOccupancy: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical'; // Added 'critical'
  activeAlerts: number;
  isolationRooms?: number; // NEW: Isolation capacity
  availableIsolationRooms?: number; // NEW: Current availability
  lastIncidentDate?: string; // NEW: Historical tracking
  staffAssigned?: number; // NEW: Staffing levels
}

// NEW: Outbreak tracking
export interface OutbreakCluster {
  id: string;
  pathogen: string;
  startDate: string;
  endDate?: string;
  affectedPatientIds: string[];
  epicenter: string; // Ward/location
  status: 'active' | 'contained' | 'resolved';
  generationCount: number; // Transmission chains
  r0Estimate?: number; // Reproduction number
}

// NEW: Screening protocol
export interface ScreeningProtocol {
  id: string;
  patientId: string;
  frequency: 'daily' | 'weekly' | 'biweekly';
  nextDue: string;
  lastCompleted?: string;
  specimens: string[];
  status: 'active' | 'completed' | 'overdue';
}

// NEW: Intervention tracking
export interface Intervention {
  id: string;
  alertId: string;
  type: 'isolation' | 'screening' | 'decontamination' | 'cohort' | 'ppe_upgrade';
  implementedAt: string;
  implementedBy: string;
  effectiveness?: 'effective' | 'partial' | 'ineffective';
  notes?: string;
}