import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, Calendar, TrendingUp, BarChart3, RefreshCw } from 'lucide-react';

interface PredictionSectionProps {
  prediction: {
    waitTime: number;
    crowdDensity: 'Low' | 'Medium' | 'High';
    confidence: number;
    timestamp: Date;
  } | null;
  isAnalyzing: boolean;
}

export const PredictionSection = ({ prediction, isAnalyzing }: PredictionSectionProps) => {
  const [showHistoricalData, setShowHistoricalData] = useState(false);
  const [currentTrend, setCurrentTrend] = useState<'up' | 'down' | 'stable'>('stable');

  // Demo historical data
  const historicalData = [
    { time: '09:00', waitTime: 5, density: 'Low' },
    { time: '10:00', waitTime: 12, density: 'Medium' },
    { time: '11:00', waitTime: 18, density: 'Medium' },
    { time: '12:00', waitTime: 25, density: 'High' },
    { time: '13:00', waitTime: 30, density: 'High' },
    { time: '14:00', waitTime: 22, density: 'Medium' },
  ];

  // Demo live metrics
  const liveMetrics = {
    currentVisitors: 1247,
    peakToday: 1560,
    averageWaitTime: 18,
    satisfactionRate: 92,
  };

  useEffect(() => {
    // Simulate trend changes
    const interval = setInterval(() => {
      const trends = ['up', 'down', 'stable'] as const;
      setCurrentTrend(trends[Math.floor(Math.random() * trends.length)]);
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const getDensityColor = (density: string) => {
    switch (density) {
      case 'Low': return 'bg-success text-success-foreground';
      case 'Medium': return 'bg-warning text-warning-foreground';
      case 'High': return 'bg-danger text-danger-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getDensityGradient = (density: string) => {
    switch (density) {
      case 'Low': return 'gradient-success';
      case 'Medium': return 'bg-warning';
      case 'High': return 'gradient-danger';
      default: return 'bg-muted';
    }
  };

  const getTrendIcon = () => {
    switch (currentTrend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-danger" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-success rotate-180" />;
      case 'stable': return <BarChart3 className="h-4 w-4 text-warning" />;
    }
  };

  return (
    <Card className="card-shadow hover:card-hover transition-smooth">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-primary" />
            <div>
              <CardTitle className="text-xl font-semibold">AI Predicted Wait Time</CardTitle>
              <CardDescription>Real-time crowd analysis with historical trends</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getTrendIcon()}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowHistoricalData(!showHistoricalData)}
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {isAnalyzing ? (
          <div className="flex items-center justify-center py-12 space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="text-lg font-medium">Processing AI analysis...</span>
          </div>
        ) : prediction ? (
          <div className="space-y-6">
            {/* Wait Time Display */}
            <div className={`rounded-2xl p-6 text-center ${getDensityGradient(prediction.crowdDensity)}`}>
              <div className="text-white">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="text-4xl font-bold">{prediction.waitTime}</div>
                  {getTrendIcon()}
                </div>
                <div className="text-xl">minutes</div>
                <div className="text-sm opacity-90 mt-2">Estimated Wait Time</div>
              </div>
            </div>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-lg font-bold text-primary">{liveMetrics.currentVisitors}</div>
                <div className="text-xs text-muted-foreground">Current Visitors</div>
              </div>

              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <TrendingUp className="h-6 w-6 mx-auto mb-2 text-danger" />
                <div className="text-lg font-bold text-danger">{liveMetrics.peakToday}</div>
                <div className="text-xs text-muted-foreground">Today's Peak</div>
              </div>

              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Clock className="h-6 w-6 mx-auto mb-2 text-warning" />
                <div className="text-lg font-bold text-warning">{liveMetrics.averageWaitTime}m</div>
                <div className="text-xs text-muted-foreground">Avg Wait Time</div>
              </div>

              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Badge className="mb-1 bg-success text-success-foreground">{liveMetrics.satisfactionRate}%</Badge>
                <div className="text-xs text-muted-foreground">Satisfaction</div>
              </div>
            </div>

            {/* Analysis Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/30 rounded-lg border">
                <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-sm text-muted-foreground mb-1">Crowd Density</div>
                <Badge className={getDensityColor(prediction.crowdDensity)}>
                  {prediction.crowdDensity}
                </Badge>
              </div>

              <div className="text-center p-4 bg-muted/30 rounded-lg border">
                <div className="text-2xl font-bold text-primary mb-1">{prediction.confidence}%</div>
                <div className="text-sm text-muted-foreground">AI Confidence</div>
              </div>

              <div className="text-center p-4 bg-muted/30 rounded-lg border">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-sm text-muted-foreground mb-1">Last Updated</div>
                <div className="text-sm font-medium">
                  {prediction.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>

            {/* Historical Data Toggle */}
            {showHistoricalData && (
              <div className="space-y-3 p-4 bg-muted/20 rounded-lg border">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">Today's Timeline</h4>
                  <Button variant="ghost" size="sm">
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {historicalData.map((data, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{data.time}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {data.density}
                        </Badge>
                        <span className="font-medium min-w-[3rem]">{data.waitTime}m</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Demo Live Metrics when no prediction */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-lg font-bold text-primary">{liveMetrics.currentVisitors}</div>
                <div className="text-xs text-muted-foreground">Current Visitors</div>
              </div>

              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <TrendingUp className="h-6 w-6 mx-auto mb-2 text-warning" />
                <div className="text-lg font-bold text-warning">{liveMetrics.peakToday}</div>
                <div className="text-xs text-muted-foreground">Today's Peak</div>
              </div>

              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Clock className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <div className="text-lg font-bold text-muted-foreground">{liveMetrics.averageWaitTime}m</div>
                <div className="text-xs text-muted-foreground">Avg Wait Time</div>
              </div>

              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Badge className="mb-1 bg-success text-success-foreground">{liveMetrics.satisfactionRate}%</Badge>
                <div className="text-xs text-muted-foreground">Satisfaction</div>
              </div>
            </div>

            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">Start camera analysis to get AI predictions</p>
              <p className="text-sm">Live metrics continue running in background</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};