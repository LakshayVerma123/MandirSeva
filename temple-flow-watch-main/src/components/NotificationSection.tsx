import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Smartphone, Monitor, CheckCircle, Clock, Wifi } from 'lucide-react';

interface NotificationSectionProps {
  approvalCount: number;
}

export const NotificationSection = ({ approvalCount }: NotificationSectionProps) => {
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline' | 'syncing'>('online');
  const [lastSync, setLastSync] = useState<Date>(new Date());
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'mobile', status: 'connected', count: 1247 },
    { id: 2, type: 'display', status: 'connected', count: 8 },
  ]);

  // Simulate connection status changes
  useEffect(() => {
    const interval = setInterval(() => {
      const statuses = ['online', 'syncing'] as const;
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      setConnectionStatus(randomStatus);
      
      if (randomStatus === 'online') {
        setLastSync(new Date());
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'online':
        return 'bg-success text-success-foreground';
      case 'syncing':
        return 'bg-warning text-warning-foreground';
      case 'offline':
        return 'bg-danger text-danger-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
      case 'online':
        return <CheckCircle className="h-3 w-3" />;
      case 'syncing':
        return <Clock className="h-3 w-3 animate-spin" />;
      case 'offline':
        return <Wifi className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <Card className="card-shadow hover:card-hover transition-smooth">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <Bell className="h-6 w-6 text-primary" />
          <div>
            <CardTitle className="text-xl font-semibold">Notification Status</CardTitle>
            <CardDescription>Real-time updates to connected devices</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Connection Status */}
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold">System Status</h4>
            <Badge className={getStatusColor(connectionStatus)}>
              {getStatusIcon(connectionStatus)}
              <span className="ml-1 capitalize">{connectionStatus}</span>
            </Badge>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Last Sync:</span>
              <span className="font-medium">{lastSync.toLocaleTimeString()}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Total Approvals Today:</span>
              <span className="font-medium text-primary">{approvalCount}</span>
            </div>
          </div>
        </div>

        {/* Connected Devices */}
        <div className="space-y-3">
          <h4 className="font-semibold">Connected Devices</h4>
          
          {notifications.map((notification) => (
            <div key={notification.id} className="flex items-center justify-between p-3 bg-card border rounded-lg">
              <div className="flex items-center gap-3">
                {notification.type === 'mobile' ? (
                  <Smartphone className="h-5 w-5 text-primary" />
                ) : (
                  <Monitor className="h-5 w-5 text-primary" />
                )}
                <div>
                  <p className="font-medium capitalize">{notification.type} App</p>
                  <p className="text-xs text-muted-foreground">
                    {notification.count} active {notification.type === 'mobile' ? 'users' : 'displays'}
                  </p>
                </div>
              </div>
              
              <Badge className={getStatusColor(notification.status)}>
                {getStatusIcon(notification.status)}
                <span className="ml-1 capitalize">{notification.status}</span>
              </Badge>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="space-y-3">
          <h4 className="font-semibold">Recent Activity</h4>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span>Wait time updated: 15 minutes (2 min ago)</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>New frame analyzed (5 min ago)</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <span>System sync completed (8 min ago)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};