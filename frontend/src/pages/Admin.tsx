import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Users, Database, Key, Bell } from 'lucide-react';
import { toast } from 'sonner';

const Admin = () => {
  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Settings</h1>
        <p className="text-muted-foreground mt-1">Configure system settings and integrations</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              <CardTitle>System Configuration</CardTitle>
            </div>
            <CardDescription>General system settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Hospital Name</Label>
              <Input defaultValue="Central Metro Hospital" />
            </div>
            <div className="space-y-2">
              <Label>Alert Threshold (Risk Score)</Label>
              <Input type="number" defaultValue="70" />
            </div>
            <div className="space-y-2">
              <Label>Contact Tracing Duration (days)</Label>
              <Input type="number" defaultValue="14" />
            </div>
            <Button onClick={handleSave}>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              <CardTitle>API Integrations</CardTitle>
            </div>
            <CardDescription>External system connections</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>EHR System API Key</Label>
              <Input type="password" placeholder="••••••••••••••••" />
            </div>
            <div className="space-y-2">
              <Label>LIS System Endpoint</Label>
              <Input placeholder="https://lis.hospital.com/api" />
            </div>
            <div className="space-y-2">
              <Label>Notification Service Key</Label>
              <Input type="password" placeholder="••••••••••••••••" />
            </div>
            <Button onClick={handleSave}>Update Keys</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <CardTitle>User Management</CardTitle>
            </div>
            <CardDescription>Manage staff access and roles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Dr. Emily Roberts</p>
                  <p className="text-sm text-muted-foreground">Infection Control Officer</p>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Nurse Jennifer Smith</p>
                  <p className="text-sm text-muted-foreground">Nurse</p>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Dr. Michael Chen</p>
                  <p className="text-sm text-muted-foreground">Doctor</p>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
              <Button variant="outline" className="w-full">Add New User</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              <CardTitle>Notification Settings</CardTitle>
            </div>
            <CardDescription>Configure alert delivery</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Send alerts via email</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">SMS Alerts</p>
                  <p className="text-sm text-muted-foreground">Critical alerts via SMS</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Real-time push alerts</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </div>
            </div>
            <Button onClick={handleSave}>Save Preferences</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            <CardTitle>Database Status</CardTitle>
          </div>
          <CardDescription>System health and performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold text-success">Healthy</p>
              <p className="text-sm text-muted-foreground">System Status</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold text-foreground">50</p>
              <p className="text-sm text-muted-foreground">Active Patients</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold text-foreground">200</p>
              <p className="text-sm text-muted-foreground">Contact Events</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold text-foreground">15</p>
              <p className="text-sm text-muted-foreground">IoT Devices</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;
