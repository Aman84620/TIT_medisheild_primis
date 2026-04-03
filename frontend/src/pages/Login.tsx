// ✅ PREMIUM LOGIN PAGE
// Professional hospital system authentication with demo accounts

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Activity, Network, Brain, Zap, Lock } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const demoAccounts = [
    { role: 'Admin', email: 'admin@medishield.ai', password: 'demo123', icon: Shield },
    { role: 'Infection Control', email: 'ico@medishield.ai', password: 'demo123', icon: Activity },
    { role: 'Doctor', email: 'doctor@medishield.ai', password: 'demo123', icon: Brain },
    { role: 'Nurse', email: 'nurse@medishield.ai', password: 'demo123', icon: Network },
    { role: 'Lab Tech', email: 'lab@medishield.ai', password: 'demo123', icon: Zap }
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const account = demoAccounts.find(acc => acc.email === email && acc.password === password);
    
    if (account) {
      toast.success(`Welcome back!`, {
        description: `Logging in as ${account.role}`,
        icon: '👋',
        duration: 2000
      });
      setTimeout(() => {
        navigate('/dashboard');
      }, 800);
    } else {
      toast.error('Invalid credentials', {
        description: 'Please use a demo account below',
        duration: 3000
      });
    }
  };

  const quickLogin = (account: typeof demoAccounts[0]) => {
    toast.success(`Quick Login`, {
      description: `Accessing as ${account.role}`,
      icon: '🚀',
      duration: 1500
    });
    setTimeout(() => {
      navigate('/dashboard');
    }, 600);
  };

  const features = [
    {
      icon: Activity,
      title: 'Real-time Pathogen Detection',
      description: 'Advanced NLP identifies MDR organisms from lab results instantly',
      color: 'text-red-500'
    },
    {
      icon: Network,
      title: 'Intelligent Contact Tracing',
      description: 'Visualize exposure chains with interactive network graphs',
      color: 'text-blue-500'
    },
    {
      icon: Brain,
      title: 'AI-Powered Risk Scoring',
      description: 'Machine learning predictions to prevent outbreak spread',
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Branding Section */}
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-2xl shadow-primary/30">
              <Shield className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                MediShield AI
              </h1>
              <p className="text-muted-foreground font-medium">Digital Contact Tracing & MDR Surveillance</p>
            </div>
          </div>
          
          {/* Features */}
          <div className="space-y-5">
            {features.map((feature, idx) => (
              <div 
                key={idx}
                className="flex items-start gap-4 p-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl border border-border/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
              >
                <div className={`p-3 bg-gradient-to-br from-${feature.color}/10 to-${feature.color}/5 rounded-xl`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm rounded-xl border border-border/50 text-center">
              <p className="text-3xl font-bold text-primary">99%</p>
              <p className="text-xs text-muted-foreground mt-1">Detection Rate</p>
            </div>
            <div className="p-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm rounded-xl border border-border/50 text-center">
              <p className="text-3xl font-bold text-primary">2.3h</p>
              <p className="text-xs text-muted-foreground mt-1">Avg Response</p>
            </div>
            <div className="p-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm rounded-xl border border-border/50 text-center">
              <p className="text-3xl font-bold text-primary">24/7</p>
              <p className="text-xs text-muted-foreground mt-1">Monitoring</p>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl border-2 backdrop-blur-sm bg-card/95">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Lock className="w-6 h-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">Sign in to access MDR surveillance system</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@hospital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-lg font-semibold"
              >
                Sign In
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground mb-4 text-center font-medium">
                Quick Demo Access
              </p>
              <div className="grid grid-cols-2 gap-3">
                {demoAccounts.map((account) => (
                  <Button
                    key={account.email}
                    variant="outline"
                    size="sm"
                    onClick={() => quickLogin(account)}
                    className="flex items-center gap-2 hover:bg-primary/10 hover:border-primary transition-all"
                  >
                    <account.icon className="w-4 h-4" />
                    <span className="text-xs font-medium">{account.role}</span>
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3 text-center">
                All demo accounts use password: <code className="bg-muted px-1.5 py-0.5 rounded">demo123</code>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;