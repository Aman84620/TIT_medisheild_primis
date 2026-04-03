// ✅ PREMIUM ALERTS CONSOLE - Hospital Command Center Aesthetics
// Enhanced with micro-interactions, animations, and professional polish

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { mockAlerts } from '@/data/mockData';
import { db } from '@/lib/db'; // ✅ IMPORT DB
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users, 
  Search,
  Filter,
  Download,
  TrendingUp,
  Shield,
  Activity,
  MapPin,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { Alert } from '@/types';

const Alerts = () => {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // ✅ LIVE FEED: Fetch from DB
  useEffect(() => {
    const fetchLiveAlerts = async () => {
      // Filter DB for High/Critical
      const dbReports = await db.reports
        .where('riskLevel').anyOf('HIGH', 'CRITICAL')
        .reverse() // Newest first
        .toArray();

      if (dbReports.length > 0) {
        // Map DB Report to Alert Interface
        const liveAlerts = dbReports.map(report => ({
          id: `db-${report.id}`,
          type: 'mdr_detected' as const,
          patientIds: [`db-p-${report.id}`],
          patientNames: [report.patientName],
          severity: report.riskLevel.toLowerCase(), // 'critical' or 'high'
          createdAt: new Date(report.timestamp).toISOString(),
          status: 'new', // Always treat DB pulls as new for the feed
          assignedTo: 'AI System',
          description: `LIVE DETECTION: ${report.suspect_chance}% MDR Probability detected by RF Model.`,
          ward: report.ward || 'Unknown',
          actionsTaken: [],
          estimatedExposures: 0
        })) as Alert[];

        // Merge: Put Live Alerts at the TOP
        setAlerts(prev => {
           // Simple dedup check to avoid duplicates in list
           const existingIds = new Set(prev.map(a => a.id));
           const uniqueNew = liveAlerts.filter(a => !existingIds.has(a.id));
           
           if (uniqueNew.length === 0) return prev;
           return [...uniqueNew, ...prev];
        });
      }
    };

    if (autoRefresh) {
      fetchLiveAlerts(); // Initial fetch
      const interval = setInterval(fetchLiveAlerts, 3000); // Polling every 3s
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white hover:bg-red-600';
      case 'high': return 'bg-orange-500 text-white hover:bg-orange-600';
      case 'medium': return 'bg-yellow-500 text-white hover:bg-yellow-600';
      case 'low': return 'bg-green-500 text-white hover:bg-green-600';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getSeverityBorderColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-l-4 border-red-500';
      case 'high': return 'border-l-4 border-orange-500';
      case 'medium': return 'border-l-4 border-yellow-500';
      case 'low': return 'border-l-4 border-green-500';
      default: return 'border-l-4 border-gray-500';
    }
  };

  const getAlertIcon = (type: string) => {
    const icons: Record<string, string> = {
      mdr_detected: '🦠',
      high_risk_contact: '🔗',
      outbreak_suspected: '⚠️',
      isolation_required: '🚨',
      cluster_detected: '📍',
      screening_due: '🔬'
    };
    return icons[type] || '📋';
  };

  const getAlertTypeName = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const acknowledgeAlert = (id: string) => {
    setAlerts(alerts.map(a => 
      a.id === id ? { 
        ...a, 
        status: 'in_progress',
        acknowledgedAt: new Date().toISOString(),
        assignedTo: 'Dr. Neha Kapoor' 
      } : a
    ));
    toast.success('Alert acknowledged and assigned to infection control team', {
      icon: '✅',
      duration: 3000
    });
  };

  const resolveAlert = (id: string) => {
    setAlerts(alerts.map(a => 
      a.id === id ? { 
        ...a, 
        status: 'resolved',
        resolvedAt: new Date().toISOString()
      } : a
    ));
    toast.success('Alert resolved successfully', {
      icon: '🎉',
      duration: 3000
    });
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    if (diffMins < 2880) return 'Yesterday';
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  // Filter alerts
  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = searchQuery === '' || 
      alert.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.patientNames.some(name => name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      alert.ward.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSeverity = !filterSeverity || alert.severity === filterSeverity;
    
    return matchesSearch && matchesSeverity;
  });

  const newAlerts = filteredAlerts.filter(a => a.status === 'new');
  const inProgressAlerts = filteredAlerts.filter(a => a.status === 'in_progress');
  const acknowledgedAlerts = filteredAlerts.filter(a => a.status === 'acknowledged');
  const resolvedAlerts = filteredAlerts.filter(a => a.status === 'resolved');

  // Calculate statistics
  const avgResponseTime = 2.4; // hours
  const criticalCount = alerts.filter(a => a.severity === 'critical' && a.status === 'new').length;

  const AlertCard = ({ alert }: { alert: any }) => (
    <Card className={`hover:shadow-lg transition-all duration-300 overflow-hidden ${getSeverityBorderColor(alert.severity)} group`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4 flex-1">
            {/* Alert Icon with Animation */}
            <div className="relative">
              <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                {getAlertIcon(alert.type)}
              </div>
              {alert.status === 'new' && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50" />
              )}
            </div>

            <div className="flex-1">
              {/* Header Row */}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge className={`${getSeverityColor(alert.severity)} font-semibold`}>
                  {alert.severity.toUpperCase()}
                </Badge>
                <Badge variant="outline" className="border-primary/30 text-primary">
                  <MapPin className="w-3 h-3 mr-1" />
                  {alert.ward}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {getAlertTypeName(alert.type)}
                </Badge>
              </div>

              {/* Description */}
              <h3 className="font-semibold text-foreground mb-2 text-base leading-relaxed">
                {alert.description}
              </h3>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span className="font-medium text-foreground">
                    {alert.patientNames.length} patient{alert.patientNames.length > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{formatDateTime(alert.createdAt)}</span>
                </div>
                {alert.estimatedExposures > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-4 h-4" />
                    <span className="text-destructive font-medium">
                      ~{alert.estimatedExposures} exposures
                    </span>
                  </div>
                )}
              </div>

              {/* Patient Names */}
              <div className="flex flex-wrap gap-2 mb-3">
                {alert.patientNames.map((name: string, idx: number) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {name}
                  </Badge>
                ))}
              </div>

              {/* Assignment */}
              {alert.assignedTo && (
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">Assigned to:</span>
                  <span className="font-medium text-foreground">{alert.assignedTo}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-3 border-t">
          {alert.status === 'new' && (
            <>
              <Button
                onClick={() => acknowledgeAlert(alert.id)}
                size="sm"
                variant="outline"
                className="flex-1 hover:bg-primary hover:text-white transition-colors"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Acknowledge & Assign
              </Button>
              <Button
                onClick={() => resolveAlert(alert.id)}
                size="sm"
                className="flex-1"
              >
                Quick Resolve
              </Button>
            </>
          )}
          {(alert.status === 'acknowledged' || alert.status === 'in_progress') && (
            <Button
              onClick={() => resolveAlert(alert.id)}
              size="sm"
              className="flex-1"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark as Resolved
            </Button>
          )}
          {alert.status === 'resolved' && (
            <Badge variant="outline" className="w-full justify-center py-2 border-green-500 text-green-600">
              <CheckCircle className="w-4 h-4 mr-2" />
              Resolved
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">Alerts Command Center</h1>
          <p className="text-muted-foreground">Real-time outbreak surveillance and response management</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-card border rounded-lg">
            <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <span className="text-xs font-medium text-muted-foreground">
              {autoRefresh ? 'Live' : 'Paused'}
            </span>
          </div>
        </div>
      </div>

      {/* Critical Alert Banner */}
      {criticalCount > 0 && (
        <Card className="border-red-500 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500 rounded-lg animate-pulse">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-red-900 dark:text-red-100 text-lg">
                  {criticalCount} Critical Alert{criticalCount > 1 ? 's' : ''} Requiring Immediate Attention
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  Suspected outbreak in progress. Infection control team has been notified.
                </p>
              </div>
              {/* <Button className="bg-red-500 hover:bg-red-600 text-white">
                View Critical Alerts
              </Button> */}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 border-red-200 dark:border-red-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-500 rounded-xl shadow-lg shadow-red-500/30">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-red-900 dark:text-red-100">{newAlerts.length}</p>
                <p className="text-sm text-red-700 dark:text-red-300 font-medium">New Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border-orange-200 dark:border-orange-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-500 rounded-xl shadow-lg shadow-orange-500/30">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">
                  {inProgressAlerts.length + acknowledgedAlerts.length}
                </p>
                <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500 rounded-xl shadow-lg shadow-green-500/30">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100">{resolvedAlerts.length}</p>
                <p className="text-sm text-green-700 dark:text-green-300 font-medium">Resolved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500 rounded-xl shadow-lg shadow-blue-500/30">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{avgResponseTime}h</p>
                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">Avg Response</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search alerts by patient, ward, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {['critical', 'high', 'medium', 'low'].map((severity) => (
                <Button
                  key={severity}
                  variant={filterSeverity === severity ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterSeverity(filterSeverity === severity ? null : severity)}
                  className={filterSeverity === severity ? getSeverityColor(severity) : ''}
                >
                  {severity}
                </Button>
              ))}
              {filterSeverity && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilterSeverity(null)}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts Tabs */}
      <Tabs defaultValue="new" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="new" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
            New ({newAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="in_progress" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            In Progress ({inProgressAlerts.length + acknowledgedAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="resolved" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
            Resolved ({resolvedAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All ({filteredAlerts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="space-y-4">
          {newAlerts.length > 0 ? (
            newAlerts.map(alert => <AlertCard key={alert.id} alert={alert} />)
          ) : (
            <Card className="border-dashed">
              <CardContent className="pt-12 pb-12 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-1">All Clear!</h3>
                <p className="text-sm text-muted-foreground">No new alerts requiring attention</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="in_progress" className="space-y-4">
          {[...inProgressAlerts, ...acknowledgedAlerts].map(alert => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </TabsContent>

        <TabsContent value="resolved" className="space-y-4">
          {resolvedAlerts.map(alert => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {filteredAlerts.map(alert => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Alerts;
