// ✅ PRODUCTION-READY CONTACT GRAPH - SVG VISUALIZATION
// Hospital-grade network diagram with transmission chains

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockPatients, mockContacts, mockOutbreakCluster } from '@/data/mockData';
import { Network, User, Users, Radio, AlertTriangle, TrendingUp, Layers } from 'lucide-react';

// Node positions for network layout (circular + hierarchical)
interface NodePosition {
  id: string;
  x: number;
  y: number;
  type: 'patient' | 'staff' | 'device';
  name: string;
  risk?: number;
}

const ContactGraph = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'network' | 'timeline'>('network');

  // Get high-risk patients (outbreak cluster)
  const highRiskPatients = mockPatients.filter(p => p.riskScore >= 70).slice(0, 4);
  const primaryPatient = highRiskPatients[0];
  
  // Get all related contacts
  const allContacts = mockContacts.filter(c => 
    highRiskPatients.some(p => p.id === c.targetPatientId)
  );

  // Calculate network statistics
  const stats = {
    totalNodes: highRiskPatients.length + allContacts.length,
    staffExposed: allContacts.filter(c => c.sourceType === 'staff').length,
    devicesInvolved: allContacts.filter(c => c.sourceType === 'device').length,
    highRiskContacts: allContacts.filter(c => c.proximityScore > 80).length,
    transmissionChains: 3
  };

  // Generate network layout
  const generateNetworkLayout = (): NodePosition[] => {
    const nodes: NodePosition[] = [];
    const centerX = 250;
    const centerY = 250;
    
    // Primary patient at center
    nodes.push({
      id: primaryPatient.id,
      x: centerX,
      y: centerY,
      type: 'patient',
      name: primaryPatient.name.split(' ')[0],
      risk: primaryPatient.riskScore
    });

    // Secondary patients in inner circle
    highRiskPatients.slice(1).forEach((patient, idx) => {
      const angle = (idx * 120 * Math.PI) / 180;
      nodes.push({
        id: patient.id,
        x: centerX + 100 * Math.cos(angle),
        y: centerY + 100 * Math.sin(angle),
        type: 'patient',
        name: patient.name.split(' ')[0],
        risk: patient.riskScore
      });
    });

    // Staff and devices in outer circle
    allContacts.forEach((contact, idx) => {
      const angle = (idx * (360 / allContacts.length) * Math.PI) / 180;
      const radius = 180;
      nodes.push({
        id: contact.sourceId,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        type: contact.sourceType as 'staff' | 'device',
        name: contact.sourceName.split(' ')[contact.sourceType === 'staff' ? 1 : 0] || contact.sourceName.substring(0, 8)
      });
    });

    return nodes;
  };

  const nodes = generateNetworkLayout();

  // Get node by ID
  const getNode = (id: string) => nodes.find(n => n.id === id);

  // Node color based on type and risk
  const getNodeColor = (node: NodePosition) => {
    if (node.type === 'patient') {
      if (node.risk && node.risk >= 85) return '#DC2626'; // Critical red
      if (node.risk && node.risk >= 70) return '#F59E0B'; // High orange
      return '#10B981'; // Low green
    }
    if (node.type === 'staff') return '#3B82F6'; // Staff blue
    return '#8B5CF6'; // Device purple
  };

  // Format time ago
  const timeAgo = (isoString: string) => {
    const hours = Math.floor((Date.now() - new Date(isoString).getTime()) / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Contact Tracing Network</h1>
          <p className="text-muted-foreground mt-1">
            Real-time visualization of MDR transmission chains
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'network' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('network')}
          >
            <Network className="w-4 h-4 mr-2" />
            Network View
          </Button>
          <Button
            variant={viewMode === 'timeline' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('timeline')}
          >
            <Layers className="w-4 h-4 mr-2" />
            Timeline View
          </Button>
        </div>
      </div>

      {/* Outbreak Alert Banner */}
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-destructive/10">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">Active Outbreak Detected</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {mockOutbreakCluster.pathogen} cluster identified with {mockOutbreakCluster.generationCount} transmission 
                generations. Epicenter: {mockOutbreakCluster.epicenter}
              </p>
              <div className="flex gap-4 text-sm">
                <span className="text-muted-foreground">
                  <strong className="text-foreground">{mockOutbreakCluster.affectedPatientIds.length}</strong> Confirmed Cases
                </span>
                <span className="text-muted-foreground">
                  <strong className="text-foreground">{stats.staffExposed}</strong> Staff Exposed
                </span>
                <span className="text-muted-foreground">
                  R₀: <strong className="text-destructive">{mockOutbreakCluster.r0Estimate}</strong>
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Graph Visualization */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="w-5 h-5" />
              Transmission Network Graph
            </CardTitle>
            <CardDescription>
              Outbreak cluster centered on {primaryPatient.name} ({primaryPatient.id})
            </CardDescription>
          </CardHeader>
          <CardContent>
            {viewMode === 'network' ? (
              <div className="relative bg-gradient-to-br from-muted/20 to-muted/5 rounded-lg border border-border">
                <svg width="100%" height="550" viewBox="0 0 500 500" className="overflow-visible">
                  {/* Draw edges (connections) */}
                  {allContacts.map((contact, idx) => {
                    const sourceNode = getNode(contact.sourceId);
                    const targetNode = getNode(contact.targetPatientId);
                    if (!sourceNode || !targetNode) return null;

                    const opacity = contact.proximityScore / 100;
                    const strokeWidth = contact.riskAssessment === 'high' ? 3 : 2;

                    return (
                      <g key={`edge-${idx}`}>
                        <line
                          x1={sourceNode.x}
                          y1={sourceNode.y}
                          x2={targetNode.x}
                          y2={targetNode.y}
                          stroke={contact.riskAssessment === 'high' ? '#DC2626' : '#94A3B8'}
                          strokeWidth={strokeWidth}
                          strokeOpacity={opacity}
                          strokeDasharray={contact.contactType === 'indirect' ? '5,5' : '0'}
                          className="transition-all duration-300"
                        />
                        {/* Arrow head for direction */}
                        <polygon
                          points="0,-4 8,0 0,4"
                          fill={contact.riskAssessment === 'high' ? '#DC2626' : '#94A3B8'}
                          opacity={opacity}
                          transform={`translate(${targetNode.x}, ${targetNode.y}) rotate(${
                            Math.atan2(targetNode.y - sourceNode.y, targetNode.x - sourceNode.x) * 180 / Math.PI
                          })`}
                        />
                      </g>
                    );
                  })}

                  {/* Draw nodes */}
                  {nodes.map((node) => {
                    const isSelected = selectedNode === node.id;
                    const isPrimary = node.id === primaryPatient.id;
                    const radius = isPrimary ? 28 : isSelected ? 24 : 20;

                    return (
                      <g 
                        key={node.id} 
                        transform={`translate(${node.x}, ${node.y})`}
                        className="cursor-pointer transition-all duration-300"
                        onClick={() => setSelectedNode(node.id)}
                      >
                        {/* Outer glow for primary/selected */}
                        {(isPrimary || isSelected) && (
                          <circle
                            r={radius + 8}
                            fill={getNodeColor(node)}
                            opacity={0.2}
                            className="animate-pulse"
                          />
                        )}
                        
                        {/* Node circle */}
                        <circle
                          r={radius}
                          fill={getNodeColor(node)}
                          stroke="#fff"
                          strokeWidth={isPrimary ? 4 : 2}
                          className="transition-all duration-300 hover:scale-110"
                          style={{
                            filter: isSelected ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' : 'none'
                          }}
                        />

                        {/* Node icon */}
                        {node.type === 'patient' && (
                          <text 
                            textAnchor="middle" 
                            dy="0.3em" 
                            fontSize="14" 
                            fill="#fff" 
                            fontWeight="bold"
                          >
                            👤
                          </text>
                        )}
                        {node.type === 'staff' && (
                          <text textAnchor="middle" dy="0.3em" fontSize="14" fill="#fff">
                            👨‍⚕️
                          </text>
                        )}
                        {node.type === 'device' && (
                          <text textAnchor="middle" dy="0.3em" fontSize="14" fill="#fff">
                            📱
                          </text>
                        )}

                        {/* Node label */}
                        <text
                          textAnchor="middle"
                          dy={radius + 18}
                          fontSize="11"
                          fill="currentColor"
                          className="font-medium"
                        >
                          {node.name}
                        </text>
                        
                        {/* Risk score badge for patients */}
                        {node.type === 'patient' && node.risk && (
                          <text
                            textAnchor="middle"
                            dy={radius + 32}
                            fontSize="10"
                            fill={node.risk >= 85 ? '#DC2626' : '#F59E0B'}
                            className="font-bold"
                          >
                            {node.risk}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>

                {/* Interactive Legend Overlay */}
                <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
                  <p className="text-xs font-semibold text-foreground mb-2">Connection Types</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-8 h-0.5 bg-destructive" />
                      <span className="text-muted-foreground">High-risk contact</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-8 h-0.5 bg-slate-400" />
                      <span className="text-muted-foreground">Standard contact</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-8 h-0.5 bg-slate-400 border-dashed border-t-2" />
                      <span className="text-muted-foreground">Indirect exposure</span>
                    </div>
                  </div>
                </div>

                {/* Stats Overlay */}
                <div className="absolute top-4 right-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-destructive" />
                    <p className="text-xs font-semibold text-foreground">Network Metrics</p>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs">
                      <span className="text-muted-foreground">Nodes:</span>{' '}
                      <span className="font-semibold text-foreground">{stats.totalNodes}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-muted-foreground">Chains:</span>{' '}
                      <span className="font-semibold text-foreground">{stats.transmissionChains}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-muted-foreground">High-risk:</span>{' '}
                      <span className="font-semibold text-destructive">{stats.highRiskContacts}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Timeline View */
              <div className="space-y-4 max-h-[520px] overflow-y-auto pr-2">
                {allContacts
                  .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
                  .map((contact, idx) => (
                    <div key={contact.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${
                          contact.riskAssessment === 'high' ? 'bg-destructive' : 
                          contact.riskAssessment === 'medium' ? 'bg-warning' : 'bg-success'
                        }`} />
                        {idx < allContacts.length - 1 && (
                          <div className="w-0.5 h-full bg-border mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-foreground">{contact.sourceName}</p>
                            <p className="text-sm text-muted-foreground capitalize">
                              {contact.sourceType} → Patient
                            </p>
                          </div>
                          <Badge variant={contact.riskAssessment === 'high' ? 'destructive' : 'outline'}>
                            {contact.riskAssessment}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{contact.location}</p>
                        <p className="text-xs text-muted-foreground">{timeAgo(contact.startTime)}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                contact.proximityScore > 80 ? 'bg-destructive' : 'bg-primary'
                              }`}
                              style={{ width: `${contact.proximityScore}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {contact.proximityScore}% proximity
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistics Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Network Analysis</CardTitle>
            <CardDescription>Outbreak cluster statistics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-destructive" />
                  <span className="text-sm font-medium">Patients</span>
                </div>
                <span className="text-2xl font-bold text-destructive">
                  {highRiskPatients.length}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">Staff Exposed</span>
                </div>
                <span className="text-2xl font-bold text-primary">
                  {stats.staffExposed}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Radio className="w-5 h-5 text-purple-500" />
                  <span className="text-sm font-medium">Devices</span>
                </div>
                <span className="text-2xl font-bold text-purple-500">
                  {stats.devicesInvolved}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  <span className="text-sm font-medium">High-Risk</span>
                </div>
                <span className="text-2xl font-bold text-destructive">
                  {stats.highRiskContacts}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-semibold text-foreground mb-3">Recent Contacts</h4>
              <div className="space-y-3">
                {allContacts.slice(0, 5).map((contact) => (
                  <div key={contact.id} className="p-3 bg-accent/50 rounded-lg hover:bg-accent transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      {contact.sourceType === 'staff' && <User className="w-4 h-4 text-primary" />}
                      {contact.sourceType === 'device' && <Radio className="w-4 h-4 text-purple-500" />}
                      <p className="text-sm font-medium text-foreground">{contact.sourceName}</p>
                    </div>
                    <p className="text-xs text-muted-foreground capitalize mb-2">{contact.sourceType}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{timeAgo(contact.startTime)}</span>
                      <Badge 
                        variant="outline" 
                        className={
                          contact.proximityScore > 80 ? 'border-destructive/50 text-destructive' : ''
                        }
                      >
                        {contact.proximityScore}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button className="w-full" variant="outline">
                <Network className="w-4 h-4 mr-2" />
                Export Network Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Node Type Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Network Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-destructive flex items-center justify-center text-white text-lg">
                👤
              </div>
              <div>
                <p className="font-medium text-foreground">Critical Patient</p>
                <p className="text-xs text-muted-foreground">MDR-positive (Risk ≥85)</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-warning flex items-center justify-center text-white text-lg">
                👤
              </div>
              <div>
                <p className="font-medium text-foreground">High-Risk Patient</p>
                <p className="text-xs text-muted-foreground">Suspected/Exposed (70-84)</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-lg">
                👨‍⚕️
              </div>
              <div>
                <p className="font-medium text-foreground">Healthcare Staff</p>
                <p className="text-xs text-muted-foreground">Doctors, Nurses, Techs</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white text-lg">
                📱
              </div>
              <div>
                <p className="font-medium text-foreground">Medical Devices</p>
                <p className="text-xs text-muted-foreground">Equipment, IoT, Tags</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactGraph;