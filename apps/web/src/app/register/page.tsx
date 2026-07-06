'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2, Eye, EyeOff, Mail, ShieldCheck, UserPlus, CheckCircle2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { authApi } from '@/lib/api';

// ─── Step schemas ────────────────────────────────────────────────────────────

const step1Schema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .refine((e) => e.toLowerCase().endsWith('@uic.edu'), {
      message: 'Only @uic.edu email addresses are allowed',
    }),
});

const step2Schema = z.object({
  otp: z.string().length(6, 'Please enter all 6 digits'),
});

const step3Schema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type Step3Data = z.infer<typeof step3Schema>;

// ─── Step indicator ──────────────────────────────────────────────────────────

const steps = [
  { id: 1, label: 'UIC Email', icon: Mail },
  { id: 2, label: 'Verify Code', icon: ShieldCheck },
  { id: 3, label: 'Your Info', icon: UserPlus },
];

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {steps.map((s, i) => (
        <div key={s.id} className="flex items-center gap-2 flex-1">
          <div
            className={`size-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              current > s.id
                ? 'bg-green-500 text-white'
                : current === s.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {current > s.id ? <CheckCircle2 className="size-4" /> : s.id}
          </div>
          <span
            className={`text-xs font-medium hidden sm:block ${
              current === s.id ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            {s.label}
          </span>
          {i < steps.length - 1 && (
            <ChevronRight className="size-3 text-muted-foreground ml-auto" />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // OTP input refs for 6 individual boxes
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);

  // ─── Step 1 form ─────────────────────────────────────────────────────────
  const step1Form = useForm<Step1Data>({ resolver: zodResolver(step1Schema) });
  const step3Form = useForm<Step3Data>({ resolver: zodResolver(step3Schema) });

  const startCountdown = () => {
    setCountdown(60);
    countdownRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(countdownRef.current!); return 0; }
        return c - 1;
      });
    }, 1000);
  };

  // ─── Step 1: Send OTP ────────────────────────────────────────────────────
  const onStep1Submit = async (data: Step1Data) => {
    setIsLoading(true);
    try {
      await authApi.sendOtp(data.email);
      setEmail(data.email);
      setStep(2);
      startCountdown();
      toast.success(`Verification code sent to ${data.email}`);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Step 2: Verify OTP ──────────────────────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // digits only
    const updated = [...otpDigits];
    updated[index] = value.slice(-1); // only last char
    setOtpDigits(updated);
    // Auto-advance
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const updated = [...otpDigits];
    pasted.split('').forEach((d, i) => { if (i < 6) updated[i] = d; });
    setOtpDigits(updated);
    const nextEmpty = updated.findIndex((d) => !d);
    otpRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();
  };

  const onStep2Submit = async () => {
    const otp = otpDigits.join('');
    if (otp.length !== 6) { toast.error('Please enter all 6 digits'); return; }
    setIsLoading(true);
    try {
      const res = await authApi.verifyOtp(email, otp);
      setOtpToken(res.data.otpToken);
      setStep(3);
      toast.success('Email verified! Now create your account.');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message || 'Incorrect code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    if (countdown > 0) return;
    setIsLoading(true);
    try {
      await authApi.sendOtp(email);
      setOtpDigits(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
      startCountdown();
      toast.success('New code sent!');
    } catch {
      toast.error('Failed to resend. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Step 3: Register ────────────────────────────────────────────────────
  const onStep3Submit = async (data: Step3Data) => {
    setIsLoading(true);
    try {
      await authApi.register({ ...data, email, otpToken });
      toast.success('Account created! Signing you in...');
      router.push('/login?registered=true');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/8 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="size-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">F</span>
            </div>
            <span className="font-semibold text-xl">FTax</span>
          </Link>
          <p className="text-sm text-muted-foreground mt-2">F-1 Student Tax Assistant · UIC</p>
        </div>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Create account</CardTitle>
              <Badge variant="secondary" className="text-xs">
                Step {step} of 3
              </Badge>
            </div>
            <CardDescription>
              {step === 1 && 'Enter your UIC email to get started'}
              {step === 2 && `Enter the 6-digit code sent to ${email}`}
              {step === 3 && 'Almost done — set your name and password'}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            <StepBar current={step} />

            {/* ─── Step 1: Email ─────────────────────────────────────────── */}
            {step === 1 && (
              <form onSubmit={step1Form.handleSubmit(onStep1Submit)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">UIC Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="netid@uic.edu"
                    {...step1Form.register('email')}
                    disabled={isLoading}
                    autoFocus
                  />
                  {step1Form.formState.errors.email && (
                    <p className="text-xs text-destructive">
                      {step1Form.formState.errors.email.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Only <code className="bg-muted px-1 rounded">@uic.edu</code> email addresses
                    are allowed to register.
                  </p>
                </div>

                <Button type="submit" className="w-full h-11" disabled={isLoading}>
                  {isLoading ? (
                    <><Loader2 className="mr-2 size-4 animate-spin" />Sending code...</>
                  ) : (
                    <><Mail className="mr-2 size-4" />Send verification code</>
                  )}
                </Button>
              </form>
            )}

            {/* ─── Step 2: OTP ───────────────────────────────────────────── */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <ShieldCheck className="size-7 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    We sent a code to <span className="font-medium text-foreground">{email}</span>
                  </p>
                </div>

                {/* 6-box OTP input */}
                <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                  {otpDigits.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="size-12 text-center text-xl font-bold rounded-lg border border-border bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                      style={{ caretColor: 'transparent' }}
                    />
                  ))}
                </div>

                <Button
                  onClick={onStep2Submit}
                  className="w-full h-11"
                  disabled={isLoading || otpDigits.join('').length !== 6}
                >
                  {isLoading ? (
                    <><Loader2 className="mr-2 size-4 animate-spin" />Verifying...</>
                  ) : (
                    <><ShieldCheck className="mr-2 size-4" />Verify code</>
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    Didn&apos;t receive it?{' '}
                    {countdown > 0 ? (
                      <span>Resend in {countdown}s</span>
                    ) : (
                      <button
                        onClick={resendOtp}
                        disabled={isLoading}
                        className="text-primary hover:underline font-medium"
                      >
                        Resend code
                      </button>
                    )}
                  </p>
                  <button
                    onClick={() => { setStep(1); setOtpDigits(['', '', '', '', '', '']); }}
                    className="text-xs text-muted-foreground hover:text-foreground mt-1 transition-colors"
                  >
                    ← Change email
                  </button>
                </div>
              </div>
            )}

            {/* ─── Step 3: Name + Password ───────────────────────────────── */}
            {step === 3 && (
              <form onSubmit={step3Form.handleSubmit(onStep3Submit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      {...step3Form.register('firstName')}
                      disabled={isLoading}
                      autoFocus
                    />
                    {step3Form.formState.errors.firstName && (
                      <p className="text-xs text-destructive">
                        {step3Form.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      {...step3Form.register('lastName')}
                      disabled={isLoading}
                    />
                    {step3Form.formState.errors.lastName && (
                      <p className="text-xs text-destructive">
                        {step3Form.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="At least 8 characters"
                      {...step3Form.register('password')}
                      disabled={isLoading}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                  {step3Form.formState.errors.password && (
                    <p className="text-xs text-destructive">
                      {step3Form.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full h-11" disabled={isLoading}>
                  {isLoading ? (
                    <><Loader2 className="mr-2 size-4 animate-spin" />Creating account...</>
                  ) : (
                    <><UserPlus className="mr-2 size-4" />Create my account</>
                  )}
                </Button>
              </form>
            )}

            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
