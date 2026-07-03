'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  LogOut, User, FileText, Calculator, CheckCircle2,
  Clock, AlertCircle, ChevronRight, Moon, Sun
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { authApi, profileApi } from '@/lib/api';

interface Profile {
  firstName: string;
  lastName: string;
  completionPercentage: number;
  passportCountry?: string;
  visaType?: string;
}

interface UserData {
  email: string;
  emailVerified: boolean;
}

const TAX_YEAR = 2025;
const FILING_DEADLINE = 'April 15, 2025';

export default function DashboardPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }

    Promise.all([authApi.me(), profileApi.get()])
      .then(([userRes, profileRes]) => {
        setUser(userRes.data);
        setProfile(profileRes.data);
      })
      .catch(() => {
        localStorage.removeItem('access_token');
        router.push('/login');
      })
      .finally(() => setIsLoading(false));
  }, [router]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      localStorage.removeItem('access_token');
      toast.success('Signed out successfully');
      router.push('/');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse-soft text-muted-foreground">Loading your dashboard...</div>
      </div>
    );
  }

  const completion = profile?.completionPercentage ?? 0;
  const steps = [
    {
      id: 'profile',
      title: 'Complete your profile',
      description: 'Add your visa details, arrival date, and UIC information',
      href: '/profile',
      status: completion >= 60 ? 'done' : 'pending',
      icon: User,
    },
    {
      id: 'travel',
      title: 'Enter travel history',
      description: 'Record all trips outside the U.S. for accurate residency calculation',
      href: '/profile/travel',
      status: 'pending',
      icon: FileText,
    },
    {
      id: 'residency',
      title: 'Determine residency status',
      description: 'Run the Substantial Presence Test — the core of your tax filing',
      href: '/residency',
      status: 'pending',
      icon: Calculator,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* ─── Sidebar ──────────────────────────────────────────────────────── */}
      <div className="fixed left-0 top-0 h-full w-64 border-r border-border bg-card hidden lg:flex flex-col">
        <div className="p-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">F</span>
            </div>
            <span className="font-semibold">FTax</span>
          </Link>
          <Badge variant="secondary" className="mt-3 text-xs">Tax Year {TAX_YEAR}</Badge>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { label: 'Dashboard', href: '/dashboard', icon: CheckCircle2 },
            { label: 'My Profile', href: '/profile', icon: User },
            { label: 'Residency Check', href: '/residency', icon: Calculator },
            { label: 'Travel History', href: '/profile/travel', icon: FileText },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <div className="px-3 py-2">
            <p className="text-xs font-medium truncate">{user?.email}</p>
            <p className="text-xs text-muted-foreground">{profile?.firstName} {profile?.lastName}</p>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Sun className="mr-2 size-4" /> : <Moon className="mr-2 size-4" />}
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start text-destructive hover:text-destructive" onClick={handleLogout}>
            <LogOut className="mr-2 size-4" />
            Sign out
          </Button>
        </div>
      </div>

      {/* ─── Main Content ─────────────────────────────────────────────────── */}
      <div className="lg:ml-64 p-6 md:p-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome back, {profile?.firstName || 'Student'} 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Let&apos;s prepare your {TAX_YEAR} tax filing
            </p>
          </div>
          <Badge variant="outline" className="text-xs gap-1.5">
            <Clock className="size-3" />
            Deadline: {FILING_DEADLINE}
          </Badge>
        </div>

        {/* Email verification warning */}
        {!user?.emailVerified && (
          <Card className="mb-6 border-yellow-500/30 bg-yellow-500/5">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertCircle className="size-5 text-yellow-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Please verify your email</p>
                <p className="text-xs text-muted-foreground">
                  Check your inbox for a verification link from FTax
                </p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto" onClick={() => {
                if (user?.email) authApi.resendVerification(user.email).then(() => toast.success('Verification email sent!'));
              }}>
                Resend
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Progress overview */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="glass-card md:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Filing progress</CardTitle>
                <span className="text-2xl font-bold text-primary">{completion}%</span>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={completion} className="h-2 mb-3" />
              <p className="text-xs text-muted-foreground">
                {completion < 30
                  ? 'Just getting started — complete your profile first'
                  : completion < 60
                  ? 'Good progress! Add your travel history next'
                  : completion < 80
                  ? 'Almost there — run your residency check'
                  : 'Looking great! Review your summary and download'}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <p className="text-xs text-muted-foreground mb-1">Tax year</p>
              <p className="text-3xl font-bold">{TAX_YEAR}</p>
              <Separator className="my-3" />
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Visa type</span>
                  <span className="font-medium">{profile?.visaType || 'Not set'}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Country</span>
                  <span className="font-medium">{profile?.passportCountry || 'Not set'}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">University</span>
                  <span className="font-medium">UIC</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next steps */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Your next steps</h2>
          <div className="space-y-3">
            {steps.map((step) => (
              <Link key={step.id} href={step.href}>
                <Card className={`glass-card hover:border-primary/50 transition-all cursor-pointer group ${step.status === 'done' ? 'border-green-500/30' : ''}`}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`size-10 rounded-full flex items-center justify-center flex-shrink-0 ${step.status === 'done' ? 'bg-green-500/20' : 'bg-muted'}`}>
                      {step.status === 'done' ? (
                        <CheckCircle2 className="size-5 text-green-500" />
                      ) : (
                        <step.icon className="size-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{step.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Info banner */}
        <Card className="glass-card border-primary/20 bg-primary/5">
          <CardContent className="p-5">
            <div className="flex gap-3">
              <div className="text-2xl">ℹ️</div>
              <div>
                <p className="font-medium text-sm mb-1">About FTax</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  FTax is an educational tool, not a licensed tax service. We help you understand your situation
                  and prepare your information. Always review your final filing carefully and consider consulting
                  UIC&apos;s International Services Office for questions specific to your situation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
