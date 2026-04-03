// ✅ PREMIUM NAVIGATION SIDEBAR
// Hospital-grade navigation with active states and icons

import { useEffect, useState } from 'react'; // ✅ Import Hooks
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Network, 
  Bell, 
  FlaskConical, 
  Radio,
  Settings,
  Shield,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { db } from '@/lib/db'; // ✅ IMPORT DB
import { useLiveQuery } from 'dexie-react-hooks'; // Optional if you have it, otherwise standard useEffect

const Sidebar = () => {
  const [alertCount, setAlertCount] = useState(0);

  // ✅ DYNAMIC ALERT COUNT
  useEffect(() => {
    const fetchAlertCount = async () => {
      // Count reports that are High or Critical
      const count = await db.reports
        .where('riskLevel')
        .anyOf('HIGH', 'CRITICAL')
        .count();
      setAlertCount(count);
    };

    fetchAlertCount();
    // Poll every 3 seconds to keep badge sync
    const interval = setInterval(fetchAlertCount, 3000);
    return () => clearInterval(interval);
  }, []);

  const navigationItems = [
    {
      title: 'Overview',
      href: '/dashboard',
      icon: LayoutDashboard
    },
    {
      title: 'Patient Tracker',
      href: '/patients',
      icon: Users
    },
    {
      title: 'Contact Graph',
      href: '/contacts',
      icon: Network,
      badge: 'New'
    },
    {
      title: 'Alerts',
      href: '/alerts',
      icon: Bell,
      badge: alertCount > 0 ? alertCount.toString() : undefined // ✅ Dynamic Badge
    },
    {
      title: 'Lab Integration',
      href: '/lab',
      icon: FlaskConical
    },
    {
      title: 'Devices',
      href: '/devices',
      icon: Radio
    },
    {
      title: 'Admin',
      href: '/admin',
      icon: Settings
    }
  ];

  return (
    <div className="w-64 border-r border-border bg-card h-screen flex flex-col shadow-sm">
      {/* Logo Header */}
      <div className="p-6 border-b border-border flex items-center gap-3">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight text-foreground">MediShield</h1>
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Surveillance OS</p>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="text-xs font-semibold text-muted-foreground mb-4 px-2 uppercase tracking-wider">
          Main Menu
        </div>
        {navigationItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group relative',
                isActive 
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 font-medium' 
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon 
                  className={cn(
                    'w-5 h-5 transition-transform group-hover:scale-110',
                    isActive ? 'text-primary-foreground' : ''
                  )} 
                />
                <span className="font-medium flex-1">{item.title}</span>
                {item.badge && (
                  <Badge 
                    variant={isActive ? 'secondary' : 'outline'}
                    className={cn(
                      "text-xs px-2 py-0",
                      isActive ? "bg-white/20 text-white border-transparent" : "border-primary/20 text-primary"
                    )}
                  >
                    {item.badge}
                  </Badge>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* System Status Footer */}
      <div className="p-4 border-t border-border">
        <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <p className="text-xs font-semibold text-green-700 dark:text-green-400">System Active</p>
          </div>
          <p className="text-xs text-green-600 dark:text-green-500/80">
            Monitoring {alertCount} active alerts
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
