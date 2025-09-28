import { useState } from 'react';
import { UploadSection } from '@/components/UploadSection';
import { PredictionSection } from '@/components/PredictionSection';
import { ApprovalSection } from '@/components/ApprovalSection';
import { NotificationSection } from '@/components/NotificationSection';
import { useToast } from '@/hooks/use-toast';

interface Prediction {
  waitTime: number;
  crowdDensity: 'Low' | 'Medium' | 'High';
  confidence: number;
  timestamp: Date;
}

export const TempleCrowdDashboard = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [approvalCount, setApprovalCount] = useState(12);
  const { toast } = useToast();

  // Mock AI analysis function
  const simulateAIAnalysis = async (file: File): Promise<Prediction> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate mock predictions
    const densities: ('Low' | 'Medium' | 'High')[] = ['Low', 'Medium', 'High'];
    const randomDensity = densities[Math.floor(Math.random() * densities.length)];
    
    // Wait time based on crowd density with some randomness
    let baseWaitTime = 0;
    switch (randomDensity) {
      case 'Low':
        baseWaitTime = Math.floor(Math.random() * 10) + 5; // 5-15 minutes
        break;
      case 'Medium':
        baseWaitTime = Math.floor(Math.random() * 10) + 15; // 15-25 minutes
        break;
      case 'High':
        baseWaitTime = Math.floor(Math.random() * 10) + 25; // 25-35 minutes
        break;
    }
    
    return {
      waitTime: baseWaitTime,
      crowdDensity: randomDensity,
      confidence: Math.floor(Math.random() * 20) + 80, // 80-100% confidence
      timestamp: new Date(),
    };
  };

  const handleImageAnalyze = async (file: File) => {
    setIsAnalyzing(true);
    
    try {
      toast({
        title: "Analysis Started",
        description: "Processing camera frame with AI crowd detection...",
      });

      const result = await simulateAIAnalysis(file);
      setPrediction(result);
      
      toast({
        title: "Analysis Complete",
        description: `Predicted wait time: ${result.waitTime} minutes (${result.crowdDensity} density)`,
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to process the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApprove = () => {
    setApprovalCount(prev => prev + 1);
    toast({
      title: "Prediction Approved",
      description: "Wait time has been published to all connected devices.",
      variant: "default",
    });
  };

  const handleReject = () => {
    setPrediction(null);
    toast({
      title: "Prediction Rejected",
      description: "Please upload a new frame or recalibrate the system.",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl font-bold text-foreground">Temple Crowd Admin Dashboard</h1>
          <p className="text-xl text-muted-foreground">
            AI-powered crowd analysis and wait time management
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <UploadSection 
              onImageAnalyze={handleImageAnalyze} 
              isAnalyzing={isAnalyzing} 
            />
            
            <ApprovalSection 
              prediction={prediction}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <PredictionSection 
              prediction={prediction} 
              isAnalyzing={isAnalyzing} 
            />
            
            <NotificationSection 
              approvalCount={approvalCount} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};