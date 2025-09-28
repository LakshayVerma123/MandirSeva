import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Clock, AlertTriangle, Settings, Users, Zap } from 'lucide-react';

interface ApprovalSectionProps {
  prediction: {
    waitTime: number;
    crowdDensity: 'Low' | 'Medium' | 'High';
    confidence: number;
    timestamp: Date;
  } | null;
  onApprove: () => void;
  onReject: () => void;
}

type ApprovalStatus = 'pending' | 'approved' | 'rejected' | null;

export const ApprovalSection = ({ prediction, onApprove, onReject }: ApprovalSectionProps) => {
  const [status, setStatus] = useState<ApprovalStatus>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [autoApprovalEnabled, setAutoApprovalEnabled] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);
  const [qualityCheckEnabled, setQualityCheckEnabled] = useState(true);

  // Demo approval metrics
  const approvalMetrics = {
    todayApprovals: 47,
    todayRejections: 3,
    averageProcessingTime: '2.3s',
    accuracyRate: 94.2,
  };

  // Demo quality checks
  const qualityChecks = [
    { name: 'Image Resolution', status: 'passed', value: '1920x1080' },
    { name: 'AI Confidence', status: prediction?.confidence >= confidenceThreshold ? 'passed' : 'warning', value: `${prediction?.confidence || 0}%` },
    { name: 'Data Validation', status: 'passed', value: 'All fields valid' },
    { name: 'Historical Accuracy', status: 'passed', value: '94.2% match' },
  ];

  useEffect(() => {
    // Auto-approval logic simulation
    if (autoApprovalEnabled && prediction && prediction.confidence >= confidenceThreshold) {
      const timer = setTimeout(() => {
        handleApprove();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [prediction, autoApprovalEnabled, confidenceThreshold]);

  const handleApprove = () => {
    setStatus('approved');
    setShowConfirmation(true);
    onApprove();
    setTimeout(() => setShowConfirmation(false), 5000);
  };

  const handleReject = () => {
    setStatus('rejected');
    setShowConfirmation(true);
    onReject();
    setTimeout(() => setShowConfirmation(false), 5000);
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-success text-success-foreground">
          <CheckCircle className="mr-1 h-3 w-3" />
          Approved
        </Badge>;
      case 'rejected':
        return <Badge className="bg-danger text-danger-foreground">
          <XCircle className="mr-1 h-3 w-3" />
          Rejected
        </Badge>;
      case 'pending':
        return <Badge className="bg-warning text-warning-foreground">
          <Clock className="mr-1 h-3 w-3" />
          Pending
        </Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="card-shadow hover:card-hover transition-smooth">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              {prediction ? <CheckCircle className="h-6 w-6 text-primary" /> : <AlertTriangle className="h-6 w-6 text-muted-foreground" />}
            </div>
            <div>
              <CardTitle className="text-xl font-semibold">Smart Review & Approval</CardTitle>
              <CardDescription>Intelligent validation with automated quality checks</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge()}
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Today's Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-success/10 rounded-lg border border-success/20">
            <div className="text-2xl font-bold text-success">{approvalMetrics.todayApprovals}</div>
            <div className="text-xs text-muted-foreground">Approved Today</div>
          </div>
          <div className="text-center p-3 bg-danger/10 rounded-lg border border-danger/20">
            <div className="text-2xl font-bold text-danger">{approvalMetrics.todayRejections}</div>
            <div className="text-xs text-muted-foreground">Rejected Today</div>
          </div>
          <div className="text-center p-3 bg-primary/10 rounded-lg border border-primary/20">
            <div className="text-xl font-bold text-primary">{approvalMetrics.averageProcessingTime}</div>
            <div className="text-xs text-muted-foreground">Avg Processing</div>
          </div>
          <div className="text-center p-3 bg-warning/10 rounded-lg border border-warning/20">
            <div className="text-xl font-bold text-warning">{approvalMetrics.accuracyRate}%</div>
            <div className="text-xs text-muted-foreground">Accuracy Rate</div>
          </div>
        </div>

        {/* Automation Controls */}
        <Card className="bg-muted/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Automation Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto-Approval</p>
                <p className="text-sm text-muted-foreground">Automatically approve high-confidence predictions</p>
              </div>
              <Switch 
                checked={autoApprovalEnabled}
                onCheckedChange={setAutoApprovalEnabled}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Quality Validation</p>
                <p className="text-sm text-muted-foreground">Run comprehensive quality checks</p>
              </div>
              <Switch 
                checked={qualityCheckEnabled}
                onCheckedChange={setQualityCheckEnabled}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Confidence Threshold</span>
                <span className="text-sm text-muted-foreground">{confidenceThreshold}%</span>
              </div>
              <Progress value={confidenceThreshold} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Confirmation Messages */}
        {showConfirmation && status === 'approved' && (
          <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg">
            <div className="flex items-center gap-3 text-success">
              <CheckCircle className="h-5 w-5" />
              <div>
                <p className="font-semibold">Slot Approved!</p>
                <p className="text-sm">Notify app with wait time {prediction?.waitTime} minutes.</p>
              </div>
            </div>
          </div>
        )}

        {showConfirmation && status === 'rejected' && (
          <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-lg">
            <div className="flex items-center gap-3 text-danger">
              <XCircle className="h-5 w-5" />
              <div>
                <p className="font-semibold">Slot Rejected</p>
                <p className="text-sm">Please recalculate or upload a new frame.</p>
              </div>
            </div>
          </div>
        )}

        {prediction ? (
          <div className="space-y-6">
            {/* Quality Checks */}
            {qualityCheckEnabled && (
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Quality Assessment
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {qualityChecks.map((check, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
                      <div>
                        <p className="text-sm font-medium">{check.name}</p>
                        <p className="text-xs text-muted-foreground">{check.value}</p>
                      </div>
                      <Badge 
                        className={
                          check.status === 'passed' ? 'bg-success text-success-foreground' :
                          check.status === 'warning' ? 'bg-warning text-warning-foreground' :
                          'bg-danger text-danger-foreground'
                        }
                      >
                        {check.status === 'passed' ? '✓' : check.status === 'warning' ? '⚠' : '✗'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prediction Summary */}
            <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                Current Prediction Summary
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Wait Time:</span>
                  <span className="ml-2 font-semibold text-primary text-lg">{prediction.waitTime} min</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Confidence:</span>
                  <span className="ml-2 font-semibold">{prediction.confidence}%</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Crowd Level:</span>
                  <span className="ml-2 font-semibold">{prediction.crowdDensity}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Timestamp:</span>
                  <span className="ml-2 font-semibold">{prediction.timestamp.toLocaleTimeString()}</span>
                </div>
              </div>
            </div>

            {/* Auto-approval indicator */}
            {autoApprovalEnabled && prediction.confidence >= confidenceThreshold && status !== 'approved' && (
              <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                <div className="flex items-center gap-3 text-warning">
                  <Clock className="h-4 w-4 animate-spin" />
                  <div>
                    <p className="font-semibold text-sm">Auto-approval in progress...</p>
                    <p className="text-xs">High confidence detected, approving in 3 seconds</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="success"
                onClick={handleApprove}
                disabled={status === 'approved'}
                className="flex-1"
                size="lg"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                {status === 'approved' ? 'Approved ✓' : 'Approve & Publish'}
              </Button>
              
              <Button
                variant="danger"
                onClick={handleReject}
                disabled={status === 'rejected'}
                className="flex-1"
                size="lg"
              >
                <XCircle className="mr-2 h-4 w-4" />
                {status === 'rejected' ? 'Rejected ✗' : 'Reject & Retry'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Show demo metrics even when no prediction */}
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
              <p className="text-lg mb-2 text-muted-foreground">Awaiting AI Prediction</p>
              <p className="text-sm text-muted-foreground">
                Camera analysis required to enable smart approval workflow
              </p>
            </div>

            {/* Demo quality check preview */}
            <div className="space-y-3 opacity-60">
              <h4 className="font-semibold text-sm text-muted-foreground">Quality Checks (Preview)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {qualityChecks.slice(0, 2).map((check, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border-dashed border">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{check.name}</p>
                      <p className="text-xs text-muted-foreground">Pending analysis...</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Waiting
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};