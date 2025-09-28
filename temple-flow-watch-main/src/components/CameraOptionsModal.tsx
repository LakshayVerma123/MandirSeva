import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, Wifi, Play, Pause, Settings, Zap } from 'lucide-react';

interface CameraOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageAnalyze: (file: File) => void;
  isAnalyzing: boolean;
}

export const CameraOptionsModal = ({ isOpen, onClose, onImageAnalyze, isAnalyzing }: CameraOptionsModalProps) => {
  const [liveFeedEnabled, setLiveFeedEnabled] = useState(true);
  const [autoAnalysisEnabled, setAutoAnalysisEnabled] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleAnalyze = () => {
    if (selectedFile) {
      onImageAnalyze(selectedFile);
      onClose();
    }
  };

  // Demo camera feeds
  const cameraFeeds = [
    { id: 1, name: 'Main Entrance', status: 'active', resolution: '1080p' },
    { id: 2, name: 'Prayer Hall', status: 'active', resolution: '720p' },
    { id: 3, name: 'Side Gate', status: 'maintenance', resolution: '1080p' },
    { id: 4, name: 'Parking Area', status: 'active', resolution: '4K' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <Camera className="h-6 w-6 text-primary" />
            Camera Management System
          </DialogTitle>
          <DialogDescription>
            Manage live feeds, upload frames, and configure AI analysis settings
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Live Feed Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wifi className="h-5 w-5 text-primary" />
                  <CardTitle>Live Camera Feeds</CardTitle>
                </div>
                <Switch 
                  checked={liveFeedEnabled}
                  onCheckedChange={setLiveFeedEnabled}
                />
              </div>
              <CardDescription>Real-time camera monitoring</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {cameraFeeds.map((feed) => (
                <div key={feed.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      feed.status === 'active' ? 'bg-success animate-pulse' : 
                      feed.status === 'maintenance' ? 'bg-warning' : 'bg-danger'
                    }`} />
                    <div>
                      <p className="font-medium text-sm">{feed.name}</p>
                      <p className="text-xs text-muted-foreground">{feed.resolution}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={feed.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                      {feed.status}
                    </Badge>
                    <Button size="sm" variant="ghost">
                      {feed.status === 'active' ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button 
                className="w-full mt-4" 
                variant="outline"
                disabled={!liveFeedEnabled || isAnalyzing}
              >
                <Zap className="mr-2 h-4 w-4" />
                Analyze Current Live Frame
              </Button>
            </CardContent>
          </Card>

          {/* Manual Upload Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                <CardTitle>Manual Frame Upload</CardTitle>
              </div>
              <CardDescription>Upload specific images for analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                {previewUrl ? (
                  <div className="space-y-3">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="max-h-32 mx-auto rounded-lg shadow-md"
                    />
                    <p className="text-sm text-muted-foreground">
                      {selectedFile?.name}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="text-sm font-medium">Select camera frame</p>
                    <p className="text-xs text-muted-foreground">JPEG/PNG supported</p>
                  </div>
                )}
                
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="manual-upload"
                />
                
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('manual-upload')?.click()}
                  className="mt-3"
                  disabled={isAnalyzing}
                >
                  <Upload className="mr-2 h-3 w-3" />
                  Choose File
                </Button>
              </div>

              {selectedFile && (
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="w-full"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Analyze Frame
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* AI Settings */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  <CardTitle>AI Analysis Settings</CardTitle>
                </div>
              </div>
              <CardDescription>Configure automated analysis parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto-Analysis</p>
                      <p className="text-sm text-muted-foreground">Automatically analyze live feeds</p>
                    </div>
                    <Switch 
                      checked={autoAnalysisEnabled}
                      onCheckedChange={setAutoAnalysisEnabled}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">High Accuracy Mode</p>
                      <p className="text-sm text-muted-foreground">Enhanced precision (slower)</p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Real-time Alerts</p>
                      <p className="text-sm text-muted-foreground">Notify on crowd changes</p>
                    </div>
                    <Switch defaultChecked={false} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Data Logging</p>
                      <p className="text-sm text-muted-foreground">Store analysis history</p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};