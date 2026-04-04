// ✅ PREMIUM DASHBOARD - Hospital Command Center
// Enhanced with animations, gradients, and professional data visualization

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import KPICard from '@/components/KPICard';
import { mockWards, dailyExposureData, pathogenDistribution } from '@/data/mockData';
import { db, seedDB, Report } from '@/lib/db'; // ✅ IMPORT DB
import { 
  Activity, 
  Users, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  Droplets, 
  Target 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell
} from 'recharts';

const Dashboard = () => {
  // ✅ STATE FOR ALL DYNAMIC DATA
  const [stats, setStats] = useState({
    totalActiveAlerts: 0,
    criticalAlerts: 0,
    avgDetectionTime: 2.3,
    totalPatients: 15,
    mdrPositive: 6
  });

  const [chartData, setChartData] = useState(dailyExposureData);
  const [pieData, setPieData] = useState(pathogenDistribution);
  const [wardData, setWardData] = useState(mockWards);

  // ✅ FETCH LIVE DATA FROM DB
  useEffect(() => {
    seedDB(); // Ensure data exists

    const fetchLiveDashboard = async () => {
      // Fetch from Local DB (Dexie)
      const allReports = await db.reports.toArray();

      // NEW: Fetch Summary Stats from Node Backend
      let backendStats = null;
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${API_URL}/dashboard/stats`);
        backendStats = await response.json();
      } catch (err) {
        console.error("Backend stats fetch failed", err);
      }

      // --- 1. CALCULATE TOP-LEVEL STATS (Hybrid) ---
      const critical = allReports.filter(r => r.riskLevel === 'CRITICAL' || r.riskLevel === 'HIGH').length;
      const positive = allReports.filter(r => r.suspect_chance > 50).length;
      const total = allReports.length;

      setStats({
        totalActiveAlerts: backendStats ? backendStats.activeAlerts : total,
        criticalAlerts: critical,
        avgDetectionTime: backendStats ? parseFloat(backendStats.avgDetectionTime) : 2.3,
        totalPatients: backendStats ? backendStats.totalPatients : (total > 0 ? total : 15),
        mdrPositive: positive > 0 ? positive : 6
      });


      // --- 2. DYNAMIC WARDS (Hybrid: Config from Mock, Status from DB) ---
      const liveWards = mockWards.map(ward => {
        const wardReports = allReports.filter(r => r.ward === ward.name);
        const occupancy = wardReports.length;
        const activeAlerts = wardReports.filter(r => r.riskLevel === 'CRITICAL' || r.riskLevel === 'HIGH').length;

        let calculatedRisk: 'low' | 'medium' | 'high' | 'critical' = 'low';
        if (activeAlerts >= 3) calculatedRisk = 'critical';
        else if (activeAlerts >= 2) calculatedRisk = 'high';
        else if (activeAlerts >= 1) calculatedRisk = 'medium';

        return {
          ...ward,
          currentOccupancy: occupancy,
          activeAlerts: activeAlerts,
          riskLevel: calculatedRisk
        };
      });
      setWardData(liveWards);

      // --- 3. DYNAMIC CHART (Outbreak Timeline) ---
      if (allReports.length > 0) {
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });

        const newChartData = last7Days.map(dateStr => {
          const count = allReports.filter(r => {
            const rDate = new Date(r.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            return rDate === dateStr;
          }).length;
          
          return {
            date: dateStr,
            exposures: Math.max(count * 2, 5),
            newCases: count
          };
        });
        setChartData(newChartData);
      }

      // --- 4. DYNAMIC PIE CHART (Pathogens) ---
      const pathogenCounts: Record<string, number> = {};
      allReports.forEach(r => {
        const organism = r.details?.labReport?.organism || 'Unknown';
        if (organism !== 'Unknown' && organism !== 'None') {
          pathogenCounts[organism] = (pathogenCounts[organism] || 0) + 1;
        }
      });

      if (Object.keys(pathogenCounts).length > 0) {
        const COLORS = ['#DC2626', '#F59E0B', '#8B5CF6', '#3B82F6', '#10B981'];
        const newPieData = Object.keys(pathogenCounts).map((key, index) => ({
          name: key.split(' ')[0],
          value: pathogenCounts[key],
          color: COLORS[index % COLORS.length]
        }));
        setPieData(newPieData);
      }
    };

    fetchLiveDashboard();
    const interval = setInterval(fetchLiveDashboard, 3000);
    return () => clearInterval(interval);
  }, []);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-300 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-800';
      case 'low': return 'bg-green-100 text-green-700 border-green-300 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800';
      default: return 'bg-muted';
    }
  };

  const getWardGradient = (level: string) => {
    switch (level) {
      case 'critical': return 'from-red-100 to-red-50 dark:from-red-950/40 dark:to-red-900/20 border-red-300 dark:border-red-800';
      case 'high': return 'from-orange-100 to-orange-50 dark:from-orange-950/40 dark:to-orange-900/20 border-orange-300 dark:border-orange-800';
      case 'medium': return 'from-yellow-100 to-yellow-50 dark:from-yellow-950/40 dark:to-yellow-900/20 border-yellow-300 dark:border-yellow-800';
      case 'low': return 'from-green-100 to-green-50 dark:from-green-950/40 dark:to-green-900/20 border-green-300 dark:border-green-800';
      default: return 'from-gray-100 to-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Surveillance Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Real-time MDR pathogen monitoring and contact tracing intelligence</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-green-500 text-green-600 px-3 py-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
            System Active
          </Badge>
          <Button variant="outline" size="sm">
            <Shield className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards with Enhanced Styling */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 border-red-200 dark:border-red-800 hover:shadow-xl transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-red-500 rounded-xl shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-red-900 dark:text-red-100">{stats.criticalAlerts}</p>
              <p className="text-sm text-red-700 dark:text-red-300 font-medium mb-2">Active MDR Cases</p>
              <Badge variant="outline" className="border-red-300 text-red-600 text-xs">
                Live DB Count
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border-orange-200 dark:border-orange-800 hover:shadow-xl transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-orange-500 rounded-xl shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
              <TrendingDown className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">8</p>
              <p className="text-sm text-orange-700 dark:text-orange-300 font-medium mb-2">Transmission Chains</p>
              <Badge variant="outline" className="border-green-300 text-green-600 text-xs">
                3 resolved today
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/20 dark:to-yellow-900/20 border-yellow-200 dark:border-yellow-800 hover:shadow-xl transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-yellow-500 rounded-xl shadow-lg shadow-yellow-500/30 group-hover:scale-110 transition-transform animate-pulse">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <Target className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">{stats.totalActiveAlerts}</p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium mb-2">Pending Alerts</p>
              <Badge variant="outline" className="border-yellow-300 text-yellow-600 text-xs">
                Requires attention
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800 hover:shadow-xl transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-blue-500 rounded-xl shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <TrendingDown className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stats.avgDetectionTime}h</p>
              <p className="text-sm text-blue-700 dark:text-blue-300 font-medium mb-2">Avg Detection Time</p>
              <Badge variant="outline" className="border-green-300 text-green-600 text-xs">
                -0.8h vs last week
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Exposure Trend Chart - Enhanced */}
        <Card className="lg:col-span-2 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Outbreak Progression Timeline
            </CardTitle>
            <CardDescription>Daily exposure events and new case detection (Last 7 Days)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorExposures" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="exposures" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  fill="url(#colorExposures)"
                  name="Exposures"
                />
                <Area 
                  type="monotone" 
                  dataKey="newCases" 
                  stroke="#EF4444" 
                  strokeWidth={2}
                  fill="url(#colorCases)"
                  name="New Cases"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pathogen Distribution Pie Chart - NEW */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-primary" />
              Pathogen Distribution
            </CardTitle>
            <CardDescription>Current MDR organism prevalence</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent as number) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {pieData.map((pathogen) => (
                <div key={pathogen.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: pathogen.color }}
                  />
                  <span className="text-xs text-muted-foreground">{pathogen.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ward Status - Enhanced */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Ward Risk Status</CardTitle>
            <CardDescription>Real-time occupancy and risk monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {wardData.map((ward) => (
                <div key={ward.id} className="space-y-2 group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={`${getRiskColor(ward.riskLevel)} font-semibold`}>
                        {ward.riskLevel.toUpperCase()}
                      </Badge>
                      <div>
                        <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {ward.name}
                        </p>
                        <p className="text-xs text-muted-foreground">Floor {ward.floor}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">
                        {ward.currentOccupancy}/{ward.capacity}
                      </p>
                      {ward.activeAlerts > 0 && (
                        <Badge variant="destructive" className="text-xs mt-1">
                          {ward.activeAlerts} alert{ward.activeAlerts > 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        ward.riskLevel === 'critical' ? 'bg-red-500' : 
                        ward.riskLevel === 'high' ? 'bg-orange-500' : 
                        ward.riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${(ward.currentOccupancy / ward.capacity) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Card - NEW */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>System Performance</CardTitle>
            <CardDescription>Outbreak control effectiveness metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.mdrPositive}/{stats.totalPatients}</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">MDR Positive Rate</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-blue-600">{stats.totalPatients > 0 ? Math.round((stats.mdrPositive / stats.totalPatients) * 100) : 0}%</p>
                <p className="text-xs text-blue-500">of monitored</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">94%</p>
                <p className="text-sm text-green-700 dark:text-green-300">Isolation Compliance</p>
              </div>
              <Shield className="w-8 h-8 text-green-500" />
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">156</p>
                <p className="text-sm text-purple-700 dark:text-purple-300">Contacts Traced</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ward Heatmap - PREMIUM VERSION */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Hospital Risk Heatmap</CardTitle>
          <CardDescription>Visual representation of MDR risk distribution across wards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {wardData.map((ward) => (
              <div 
                key={ward.id}
                className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl bg-gradient-to-br ${getWardGradient(ward.riskLevel)}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-foreground text-lg">{ward.name}</h3>
                  {ward.activeAlerts > 0 && (
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-4">Floor {ward.floor}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Occupancy</span>
                    <span className="font-bold text-foreground">{ward.currentOccupancy}/{ward.capacity}</span>
                  </div>
                  <div className="h-2 bg-white/50 dark:bg-black/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-foreground/60 transition-all"
                      style={{ width: `${(ward.currentOccupancy / ward.capacity) * 100}%` }}
                    />
                  </div>
                  {ward.activeAlerts > 0 && (
                    <Badge variant="destructive" className="w-full justify-center text-xs mt-2">
                      ⚠️ {ward.activeAlerts} Active Alert{ward.activeAlerts > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
