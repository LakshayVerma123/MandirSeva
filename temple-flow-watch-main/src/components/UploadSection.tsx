import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Wifi, Settings, Zap, Play } from 'lucide-react';
import { CameraOptionsModal } from '@/components/CameraOptionsModal';

interface UploadSectionProps {
  onImageAnalyze: (file: File) => void;
  isAnalyzing: boolean;
}

export const UploadSection = ({ onImageAnalyze, isAnalyzing }: UploadSectionProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Demo data for camera status
  const cameraStats = {
    activeCameras: 3,
    totalCameras: 4,
    lastUpdate: new Date().toLocaleTimeString(),
  };

  return (
    <>
      <Card className="card-shadow hover:card-hover transition-smooth">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Camera className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold">Camera Management</CardTitle>
                <CardDescription>Live feeds and frame analysis control center</CardDescription>
              </div>
            </div>
            <Badge className="bg-success text-success-foreground">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
              Live
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary">{cameraStats.activeCameras}</div>
              <div className="text-xs text-muted-foreground">Active Feeds</div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary">{cameraStats.totalCameras}</div>
              <div className="text-xs text-muted-foreground">Total Cameras</div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-sm font-medium text-primary">{cameraStats.lastUpdate}</div>
              <div className="text-xs text-muted-foreground">Last Update</div>
            </div>
          </div>

          {/* Current Live Feed Preview */}
          <div className="relative bg-muted/20 rounded-lg overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <div className="text-center space-y-2">
                <Wifi className="h-8 w-8 mx-auto text-primary animate-pulse" />
                <p className="text-sm font-medium">Main Entrance - Live Feed</p>
                <p className="text-xs text-muted-foreground">1920x1080 • 30 FPS</p>
              </div>
            </div>
            <div className="absolute top-3 left-3">
              <Badge className="bg-danger text-danger-foreground text-xs">
                ● LIVE
              </Badge>
            </div>
            <div className="absolute top-3 right-3">
              <Button size="sm" variant="secondary" className="h-6 px-2 text-xs">
                <Play className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => setIsModalOpen(true)}
              variant="default"
              size="lg"
              className="flex-1"
              disabled={isAnalyzing}
            >
              <Camera className="mr-2 h-4 w-4" />
              Camera Options
            </Button>
            
            <Button
              variant="success"
              size="lg"
              className="flex-1"
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Quick Analyze
                </>
              )}
            </Button>
          </div>

          {/* System Status */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">System Status:</span>
            </div>
            <Badge variant="outline" className="text-xs">
              All Systems Operational
            </Badge>
          </div>
        </CardContent>
      </Card>

      <CameraOptionsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onImageAnalyze={onImageAnalyze}
        isAnalyzing={isAnalyzing}
      />
    </>
  );
};