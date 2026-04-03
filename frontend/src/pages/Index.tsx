import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Activity, Network, AlertTriangle, CheckCircle, Zap } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-primary/10">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-lg">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">MediShield AI</h1>
                <p className="text-xs text-muted-foreground">Digital Contact Tracing</p>
              </div>
            </div>
            <Button onClick={() => navigate('/login')}>
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Healthcare Protection</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight">
              Stop Outbreaks Before <br />
              <span className="text-primary">They Spread</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Advanced digital contact tracing and MDR pathogen screening system using 
              machine learning, NLP, and real-time IoT tracking to protect hospital environments
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button size="lg" onClick={() => navigate('/login')}>
              View Demo Dashboard
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-8">
            <div className="p-6 bg-card rounded-xl border border-border">
              <p className="text-3xl font-bold text-primary">2.3h</p>
              <p className="text-sm text-muted-foreground">Avg. Detection Time</p>
            </div>
            <div className="p-6 bg-card rounded-xl border border-border">
              <p className="text-3xl font-bold text-primary">95%</p>
              <p className="text-sm text-muted-foreground">Contact Accuracy</p>
            </div>
            <div className="p-6 bg-card rounded-xl border border-border">
              <p className="text-3xl font-bold text-primary">Real-time</p>
              <p className="text-sm text-muted-foreground">Alert System</p>
            </div>
            <div className="p-6 bg-card rounded-xl border border-border">
              <p className="text-3xl font-bold text-primary">24/7</p>
              <p className="text-sm text-muted-foreground">Monitoring</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">Comprehensive Protection System</h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to detect, track, and contain MDR pathogens
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 bg-card rounded-xl border border-border hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Real-time Pathogen Detection</h3>
            <p className="text-muted-foreground">
              Advanced NLP automatically identifies MDR organisms from lab results, flagging MRSA, VRE, 
              ESBL, and CRE within minutes of specimen processing.
            </p>
          </div>

          <div className="p-8 bg-card rounded-xl border border-border hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Network className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Interactive Contact Graphs</h3>
            <p className="text-muted-foreground">
              Visualize exposure chains with time-based interactive graphs showing patient-staff-device 
              interactions with proximity scores and duration analysis.
            </p>
          </div>

          <div className="p-8 bg-card rounded-xl border border-border hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Intelligent Risk Scoring</h3>
            <p className="text-muted-foreground">
              ML-powered risk engine analyzes lab results, contact duration, antibiotic exposure, 
              and environmental factors to predict outbreak probability.
            </p>
          </div>

          <div className="p-8 bg-card rounded-xl border border-border hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Automated Containment</h3>
            <p className="text-muted-foreground">
              Instant isolation protocols, automated staff notifications, and contact tracing 
              initiation based on WHO/ICMR guidelines.
            </p>
          </div>

          <div className="p-8 bg-card rounded-xl border border-border hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">IoT Device Tracking</h3>
            <p className="text-muted-foreground">
              Track equipment, staff tags, and environmental sensors in real-time. 
              Monitor device movement and identify contamination vectors.
            </p>
          </div>

          <div className="p-8 bg-card rounded-xl border border-border hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Compliance & Audit</h3>
            <p className="text-muted-foreground">
              Immutable audit trails, PDF incident reports, and regulatory compliance 
              documentation for healthcare accreditation.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="p-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Experience the Future of Infection Control
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Try our interactive demo with realistic hospital scenarios and live data
          </p>
          <Button size="lg" onClick={() => navigate('/login')}>
            Access Demo Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
