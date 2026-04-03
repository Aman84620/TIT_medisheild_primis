// ✅ PREMIUM PATIENT TRACKER - Hospital ICU Dashboard Aesthetics
// Enhanced with movement visualization, risk trends, and professional polish

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { mockPatients, mockContacts, mockLabResults } from '@/data/mockData';
import { db } from '@/lib/db'; // ✅ IMPORT DB
import { Patient, ContactEvent, LabResult } from '@/types'; // ✅ Import Types
import { 
  Search, 
  User, 
  Calendar, 
  MapPin, 
  Activity, 
  Network,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  Microscope,
  Users,
  Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PatientTracker = () => {
  const navigate = useNavigate();
  
  // ✅ STATE FOR MERGED DATA
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [contacts, setContacts] = useState<ContactEvent[]>(mockContacts);
  const [labs, setLabs] = useState<LabResult[]>(mockLabResults);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient>(mockPatients[0]);

  // ✅ FETCH & MERGE DB DATA
  useEffect(() => {
    const fetchDbData = async () => {
      const reports = await db.reports.toArray();
      
      if (reports.length === 0) return;

      // 1. Map Reports to Patients
      const dbPatients: Patient[] = reports.map(r => ({
        id: `db-${r.id}`,
        name: r.patientName,
        // Approximate DOB from age if available, else default
        dob: r.details?.demographics?.age 
          ? new Date(new Date().setFullYear(new Date().getFullYear() - r.details.demographics.age)).toISOString()
          : '1980-01-01', 
        age: r.details?.demographics?.age || 35,
        admissionId: `ADM-${r.id}`,
        admissionDate: new Date(r.timestamp).toISOString(),
        room: r.details?.hospitalContext?.bedNo || 'Triage',
        currentWard: r.ward || 'Emergency',
        riskScore: r.suspect_chance,
        status: r.riskLevel === 'CRITICAL' ? 'isolated' : r.riskLevel === 'HIGH' ? 'critical' : 'monitoring',
        mdrStatus: r.suspect_chance > 80 ? 'positive' : r.suspect_chance > 50 ? 'suspected' : 'negative',
        lastScreening: new Date(r.timestamp).toISOString(),
        comorbidities: r.details?.abhaHistory?.chronicConditions || []
      }));

      // 2. Map Reports to Lab Results
      const dbLabs: LabResult[] = reports.map(r => ({
        id: `LAB-${r.id}`,
        patientId: `db-${r.id}`,
        specimenType: 'Nasopharyngeal Swab', // Default for demo
        organism: r.details?.labReport?.organism || 'Unknown',
        resistanceFlags: r.details?.labReport?.antibioticResistance || [],
        timestamp: new Date(r.timestamp).toISOString(),
        reportedAt: new Date(r.timestamp).toISOString(),
        status: r.riskLevel === 'CRITICAL' ? 'critical' : 'completed',
        labTech: 'AI Auto-Analysis',
        antibioticSensitivity: [] // Could be parsed from details if structure allows
      }));

      // 3. Map Reports to Contact Events (if any logged in details)
      const dbContacts: ContactEvent[] = reports.flatMap((r, idx) => {
        if (!r.details?.contactLogs) return [];
        return r.details.contactLogs.map((log: any, i: number) => ({
          id: `CNT-${r.id}-${i}`,
          sourceId: `UNK-${i}`,
          sourceName: log.contactWith || 'Unknown Contact',
          sourceType: 'visitor', // Defaulting for demo
          targetPatientId: `db-${r.id}`,
          startTime: new Date(Date.now() - (log.durationMinutes * 60000)).toISOString(),
          endTime: new Date().toISOString(),
          durationSeconds: log.durationMinutes * 60,
          proximityScore: 85, // High proximity for demo
          location: log.location || 'Unknown',
          contactType: 'direct',
          riskAssessment: 'high'
        }));
      });

      // Merge with Mocks (DB data first so it appears at top)
      const mergedPatients = [...dbPatients, ...mockPatients];
      
      // Remove duplicates based on ID just in case
      const uniquePatients = Array.from(new Map(mergedPatients.map(item => [item.id, item])).values());

      setPatients(uniquePatients);
      setLabs([...dbLabs, ...mockLabResults]);
      setContacts([...dbContacts, ...mockContacts]);

      // If we haven't selected a patient (or default mock is selected), select the first DB patient
      if (selectedPatient.id === mockPatients[0].id && dbPatients.length > 0) {
        setSelectedPatient(dbPatients[0]);
      }
    };

    fetchDbData();
    // Poll for new data every 5 seconds
    const interval = setInterval(fetchDbData, 5000);
    return () => clearInterval(interval);
  }, []); // Empty dependency array to set up interval once

  // ✅ FILTERING LOGIC (Updated to use 'patients' state)
  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.currentWard.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const patientContacts = contacts.filter(c => c.targetPatientId === selectedPatient.id);
  const patientLabs = labs.filter(l => l.patientId === selectedPatient.id);

  // ... (Helper functions remain the same)
  const getRiskColor = (score: number) => {
    if (score >= 85) return 'text-red-600 dark:text-red-400';
    if (score >= 70) return 'text-orange-600 dark:text-orange-400';
    if (score >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getRiskGradient = (score: number) => {
    if (score >= 85) return 'from-red-500 to-red-600';
    if (score >= 70) return 'from-orange-500 to-orange-600';
    if (score >= 40) return 'from-yellow-500 to-yellow-600';
    return 'from-green-500 to-green-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'isolated': return 'bg-red-500 text-white hover:bg-red-600';
      case 'critical': return 'bg-orange-500 text-white hover:bg-orange-600';
      case 'monitoring': return 'bg-yellow-500 text-white hover:bg-yellow-600';
      case 'stable': return 'bg-green-500 text-white hover:bg-green-600';
      default: return 'bg-muted';
    }
  };

  const getMDRStatusColor = (status: string | undefined) => {
    if (!status) return 'bg-gray-500';
    switch (status) {
      case 'positive': return 'bg-red-500';
      case 'suspected': return 'bg-orange-500';
      case 'pending': return 'bg-yellow-500';
      case 'negative': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffHours < 48) return 'Yesterday';
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Calculate contact statistics
  const highRiskContacts = patientContacts.filter(c => c.proximityScore > 80).length;
  const staffContacts = patientContacts.filter(c => c.sourceType === 'staff').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Patient Monitoring Center
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time patient tracking, contact history, and risk assessment
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-primary text-primary px-3 py-1">
            <Activity className="w-3 h-3 mr-2" />
            {filteredPatients.length} Patients Monitored
          </Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Patient List - Enhanced */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Patient Registry
            </CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, ID, or ward..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="max-h-[calc(100vh-280px)] overflow-y-auto">
            <div className="space-y-2">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                    selectedPatient.id === patient.id
                      ? 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary shadow-md scale-[1.02]'
                      : 'border-border hover:bg-accent hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{patient.name}</p>
                        <p className="text-xs text-muted-foreground">{patient.id}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(patient.status)}>
                      {patient.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">{patient.currentWard}</span>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${getMDRStatusColor(patient.mdrStatus)} animate-pulse`} />
                      <span className="text-xs text-muted-foreground capitalize">{patient.mdrStatus}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {patient.riskScore >= 70 ? (
                        <TrendingUp className={`w-3 h-3 ${getRiskColor(patient.riskScore)}`} />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-green-500" />
                      )}
                      <span className="text-xs text-muted-foreground">Risk Score</span>
                    </div>
                    <span className={`text-lg font-bold ${getRiskColor(patient.riskScore)}`}>
                      {patient.riskScore}
                    </span>
                  </div>
                  
                  <div className="mt-2">
                    <Progress value={patient.riskScore} className="h-1.5" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Patient Details & Timeline - Enhanced */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient Info Header */}
          <Card className="bg-gradient-to-br from-card to-card/50 border-2 hover:shadow-xl transition-all">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${getRiskGradient(selectedPatient.riskScore)} shadow-lg`}>
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{selectedPatient.name}</CardTitle>
                    <CardDescription className="mt-1 space-x-2">
                      <span>{selectedPatient.id}</span>
                      <span>•</span>
                      <span>{selectedPatient.age || calculateAge(selectedPatient.dob)} years old</span>
                      <span>•</span>
                      <span>DOB: {new Date(selectedPatient.dob).toLocaleDateString('en-IN')}</span>
                    </CardDescription>
                    {selectedPatient.comorbidities && selectedPatient.comorbidities.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {selectedPatient.comorbidities.map((condition, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-4xl font-bold ${getRiskColor(selectedPatient.riskScore)} mb-1`}>
                    {selectedPatient.riskScore}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">Risk Score</p>
                  {selectedPatient.riskScore >= 70 && (
                    <Badge variant="destructive" className="animate-pulse">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      High Risk
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-semibold text-foreground">{selectedPatient.room}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Activity className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Ward</p>
                    <p className="font-semibold text-foreground">{selectedPatient.currentWard}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Admission</p>
                    <p className="font-semibold text-foreground text-xs">
                      {formatDateTime(selectedPatient.admissionDate || '')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Shield className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">MDR Status</p>
                    <Badge className={`${getMDRStatusColor(selectedPatient.mdrStatus)} text-white mt-1`}>
                      {selectedPatient.mdrStatus?.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Contact Statistics */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{patientContacts.length}</p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">Total Contacts</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{staffContacts}</p>
                  <p className="text-xs text-purple-700 dark:text-purple-300">Staff Exposed</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="text-2xl font-bold text-red-900 dark:text-red-100">{highRiskContacts}</p>
                  <p className="text-xs text-red-700 dark:text-red-300">High-Risk</p>
                </div>
              </div>

              <Button 
                onClick={() => navigate('/contacts')}
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                size="lg"
              >
                <Network className="w-4 h-4 mr-2" />
                View Complete Contact Network Graph
              </Button>
            </CardContent>
          </Card>

          {/* Lab Results - Enhanced */}
          {patientLabs.length > 0 && (
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Microscope className="w-5 h-5 text-primary" />
                  Laboratory Results
                </CardTitle>
                <CardDescription>MDR pathogen detection and resistance profiles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {patientLabs.map((lab) => (
                    <div 
                      key={lab.id} 
                      className="p-5 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border-2 border-red-200 dark:border-red-800 rounded-xl hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl">🦠</span>
                            <p className="font-bold text-foreground text-lg">{lab.organism}</p>
                          </div>
                          <p className="text-sm text-muted-foreground">{lab.specimenType}</p>
                        </div>
                        <Badge className="bg-red-500 text-white text-sm px-3 py-1">
                          {lab.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-muted-foreground mb-2">Resistance Markers:</p>
                        <div className="flex flex-wrap gap-2">
                          {lab.resistanceFlags.map((flag, idx) => (
                            <Badge 
                              key={idx} 
                              className="bg-red-500 text-white border-0"
                            >
                              {flag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {lab.antibioticSensitivity && lab.antibioticSensitivity.length > 0 && (
                        <div className="mb-3 p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                          <p className="text-xs font-semibold text-muted-foreground mb-2">Antibiotic Sensitivity:</p>
                          <div className="grid grid-cols-2 gap-2">
                            {lab.antibioticSensitivity.map((sens, idx) => (
                              <div key={idx} className="flex items-center justify-between text-xs">
                                <span className="text-foreground">{sens.antibiotic}</span>
                                <Badge 
                                  variant={sens.result === 'sensitive' ? 'outline' : 'destructive'}
                                  className="text-xs"
                                >
                                  {sens.result}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatDateTime(lab.timestamp)}</span>
                        </div>
                        {lab.labTech && (
                          <span>Processed by: {lab.labTech}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contact Timeline - Enhanced */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Contact & Exposure Timeline
              </CardTitle>
              <CardDescription>Chronological interaction history with risk assessment</CardDescription>
            </CardHeader>
            <CardContent className="max-h-[600px] overflow-y-auto">
              <div className="space-y-4">
                {patientContacts.length > 0 ? (
                  patientContacts.map((contact, idx) => (
                    <div key={contact.id} className="flex gap-4 group">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${
                          contact.riskAssessment === 'high' ? 'bg-red-500 animate-pulse' :
                          contact.riskAssessment === 'medium' ? 'bg-orange-500' :
                          'bg-green-500'
                        } shadow-lg`} />
                        {idx < patientContacts.length - 1 && (
                          <div className="w-0.5 h-full bg-gradient-to-b from-border to-transparent mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className={`p-4 rounded-xl border-2 transition-all ${
                          contact.riskAssessment === 'high' 
                            ? 'bg-red-50 dark:bg-red-950/20 border-red-300 dark:border-red-800 hover:shadow-lg' :
                          contact.riskAssessment === 'medium'
                            ? 'bg-orange-50 dark:bg-orange-950/20 border-orange-300 dark:border-orange-800 hover:shadow-md' :
                          'bg-green-50 dark:bg-green-950/20 border-green-300 dark:border-green-800 hover:shadow-sm'
                        }`}>
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-white/50 dark:bg-black/20 rounded-lg">
                                {contact.sourceType === 'staff' && <User className="w-4 h-4" />}
                                {contact.sourceType === 'device' && <Activity className="w-4 h-4" />}
                                {contact.sourceType === 'patient' && <Users className="w-4 h-4" />}
                                {contact.sourceType === 'visitor' && <Users className="w-4 h-4" />}
                              </div>
                              <div>
                                <p className="font-semibold text-foreground">{contact.sourceName}</p>
                                <p className="text-xs text-muted-foreground capitalize">{contact.sourceType}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge 
                                className={
                                  contact.riskAssessment === 'high' ? 'bg-red-500 text-white' :
                                  contact.riskAssessment === 'medium' ? 'bg-orange-500 text-white' :
                                  'bg-green-500 text-white'
                                }
                              >
                                {contact.riskAssessment?.toUpperCase()}
                              </Badge>
                              <p className="text-xs text-muted-foreground mt-1">
                                {Math.floor(contact.durationSeconds / 60)} min
                              </p>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              <span>{contact.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              <span>{formatDateTime(contact.startTime)}</span>
                            </div>
                            {contact.contactType && (
                              <Badge variant="outline" className="text-xs">
                                {contact.contactType} contact
                              </Badge>
                            )}
                            {contact.ppeCompliance !== undefined && (
                              <Badge 
                                variant={contact.ppeCompliance ? 'outline' : 'destructive'}
                                className="text-xs"
                              >
                                PPE: {contact.ppeCompliance ? 'Compliant' : 'Non-compliant'}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                              <span>Proximity Score</span>
                              <span className="font-semibold">{contact.proximityScore}%</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2.5 bg-white/50 dark:bg-black/20 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full transition-all ${
                                    contact.proximityScore > 80 ? 'bg-red-500' :
                                    contact.proximityScore > 50 ? 'bg-orange-500' : 'bg-green-500'
                                  }`}
                                  style={{ width: `${contact.proximityScore}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Network className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">No contact events recorded</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientTracker;
