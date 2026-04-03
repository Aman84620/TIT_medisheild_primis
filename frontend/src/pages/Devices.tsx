import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockDevices } from '@/data/mockData';
import { Radio, Battery, MapPin, Clock } from 'lucide-react';

const Devices = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success text-success-foreground';
      case 'idle': return 'bg-warning text-warning-foreground';
      case 'offline': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted';
    }
  };

  const getBatteryColor = (battery: number) => {
    if (battery >= 70) return 'text-success';
    if (battery >= 30) return 'text-warning';
    return 'text-destructive';
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    return `${Math.floor(diffMins / 60)}h ago`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">IoT Device Management</h1>
        <p className="text-muted-foreground mt-1">Monitor staff tags, equipment sensors, and environmental monitors</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockDevices.map((device) => (
          <Card key={device.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Radio className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{device.name}</CardTitle>
                    <CardDescription className="capitalize">{device.type}</CardDescription>
                  </div>
                </div>
                <Badge className={getStatusColor(device.status)}>
                  {device.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                <div className="flex items-center gap-2">
                  <Battery className={`w-4 h-4 ${getBatteryColor(device.battery)}`} />
                  <span className="text-sm text-muted-foreground">Battery</span>
                </div>
                <span className={`font-semibold ${getBatteryColor(device.battery)}`}>
                  {device.battery}%
                </span>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm font-medium text-foreground">{device.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Last Seen</p>
                  <p className="text-sm font-medium text-foreground">{formatTime(device.lastSeen)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Device Location Map</CardTitle>
          <CardDescription>Real-time tracking of all IoT devices across hospital</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative bg-muted/30 rounded-lg p-12 min-h-[300px] flex items-center justify-center border-2 border-dashed border-border">
            <div className="text-center space-y-2">
              <MapPin className="w-12 h-12 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">Interactive floor plan with device positions</p>
              <p className="text-xs text-muted-foreground">Would integrate with hospital CAD drawings in production</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Devices;
