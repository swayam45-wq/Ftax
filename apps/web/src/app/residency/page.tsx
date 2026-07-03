'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2, ChevronLeft, CheckCircle2, XCircle, Info, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { taxApi } from '@/lib/api';

const schema = z.object({
  calendarYearsInUS: z.coerce.number().min(1, 'Must be at least 1').max(20),
  visaType: z.string().default('F1'),
  taxYear: z.coerce.number().default(2025),
});

type FormData = z.infer<typeof schema>;

interface ResidencyResult {
  status: 'NONRESIDENT_ALIEN' | 'RESIDENT_ALIEN' | 'DUAL_STATUS';
  statusLabel: string;
  ruleApplied: string;
  ruleDescription: string;
  reasoning: {
    summary: string;
    plainEnglish: string;
    steps: Array<{
      stepNumber: number;
      title: string;
      description: string;
      result: 'PASS' | 'FAIL' | 'INFO';
      value?: string;
    }>;
  };
  daysCount: {
    currentYear: number;
    priorYear: number;
    twoYearsAgo: number;
    priorYearWeighted: number;
    twoYearsAgoWeighted: number;
    totalWeighted: number;
    threshold: number;
    meetsThreshold: boolean;
    exemptYears: number;
  };
  forms: string[];
  ficaExempt: boolean;
  stateFilingRequired: boolean;
}

function StepIcon({ result }: { result: 'PASS' | 'FAIL' | 'INFO' }) {
  if (result === 'PASS') return <CheckCircle2 className="size-5 text-green-500" />;
  if (result === 'FAIL') return <XCircle className="size-5 text-red-400" />;
  return <Info className="size-5 text-blue-400" />;
}

export default function ResidencyCheckPage() {
  const router = useRouter();
  const [result, setResult] = useState<ResidencyResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'result'>('form');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) router.push('/login');
  }, [router]);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: { calendarYearsInUS: 1, visaType: 'F1', taxYear: 2025 },
  });

  const years = watch('calendarYearsInUS');

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await taxApi.checkResidency(data);
      setResult(response.data);
      setStep('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to check residency. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-10 lg:pl-72">
      {/* Back link */}
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
        <ChevronLeft className="size-4" />
        Back to dashboard
      </Link>

      <div className="max-w-2xl">
        <div className="mb-8">
          <Badge variant="secondary" className="mb-3">Step 3 of 4</Badge>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Residency Determination</h1>
          <p className="text-muted-foreground">
            Your tax residency status determines which forms you need to file. Let&apos;s figure it out.
          </p>
        </div>

        {step === 'form' && (
          <div className="animate-fade-in space-y-6">
            {/* Explainer */}
            <Alert className="border-blue-500/30 bg-blue-500/5">
              <Info className="size-4 text-blue-400" />
              <AlertDescription className="ml-2 text-sm">
                <strong>What is this?</strong> The IRS uses the Substantial Presence Test to determine if
                you&apos;re a Resident or Nonresident Alien. For F-1 students in their first 5 calendar years,
                you are automatically a Nonresident Alien — no counting required.
              </AlertDescription>
            </Alert>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Your F-1 Status</CardTitle>
                <CardDescription>
                  We need a few details to determine your tax residency status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="calendarYearsInUS">
                      How many calendar years have you been in F-1 status in the U.S.?
                    </Label>
                    <Input
                      id="calendarYearsInUS"
                      type="number"
                      min={1}
                      max={20}
                      {...register('calendarYearsInUS')}
                    />
                    {errors.calendarYearsInUS && (
                      <p className="text-xs text-destructive">{errors.calendarYearsInUS.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      <strong>What&apos;s a calendar year?</strong> Count the number of different calendar years
                      (Jan 1–Dec 31) you have been physically present in the U.S. on an F-1 visa.
                      Example: arrived Aug 2022 = 2022, 2023, 2024, 2025 = 4 years.
                    </p>

                    {/* Visual indicator */}
                    <div className="mt-3 p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground">Years in F-1</span>
                        <span className={`text-xs font-semibold ${Number(years) <= 5 ? 'text-green-400' : 'text-yellow-400'}`}>
                          {Number(years) <= 5 ? '✓ Within 5-year exemption' : '⚠ Beyond 5-year exemption'}
                        </span>
                      </div>
                      <Progress value={Math.min((Number(years) / 5) * 100, 100)} className="h-1.5" />
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-muted-foreground">Year 1</span>
                        <span className="text-xs text-muted-foreground">Year 5 (threshold)</span>
                      </div>
                    </div>
                  </div>

                  <input type="hidden" {...register('visaType')} value="F1" />
                  <input type="hidden" {...register('taxYear')} value={2025} />

                  <div className="pt-2">
                    <Button type="submit" className="w-full h-11" disabled={isLoading}>
                      {isLoading ? (
                        <><Loader2 className="mr-2 size-4 animate-spin" />Analyzing your status...</>
                      ) : (
                        'Determine my residency status →'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Data source note */}
            <p className="text-xs text-muted-foreground text-center">
              Your travel history from your profile will be used automatically to calculate
              your days in the U.S. Add trips in{' '}
              <Link href="/profile/travel" className="text-primary hover:underline">
                Travel History
              </Link>{' '}
              for more accurate results.
            </p>
          </div>
        )}

        {step === 'result' && result && (
          <div className="animate-fade-in space-y-6">
            {/* Result card */}
            <Card className={`glass-card border-2 ${result.status === 'NONRESIDENT_ALIEN' ? 'border-green-500/40' : result.status === 'RESIDENT_ALIEN' ? 'border-yellow-500/40' : 'border-blue-500/40'}`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`size-14 rounded-full flex items-center justify-center flex-shrink-0 ${result.status === 'NONRESIDENT_ALIEN' ? 'bg-green-500/20' : 'bg-yellow-500/20'}`}>
                    <span className="text-2xl">{result.status === 'NONRESIDENT_ALIEN' ? '✅' : '⚠️'}</span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Your tax residency status for 2025</p>
                    <h2 className="text-2xl font-bold mb-2">{result.statusLabel}</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {result.reasoning.plainEnglish}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FICA notice */}
            {result.ficaExempt && (
              <Alert className="border-green-500/30 bg-green-500/5">
                <CheckCircle2 className="size-4 text-green-400" />
                <AlertDescription className="ml-2 text-sm">
                  <strong>FICA Tax Exemption:</strong> You are likely exempt from Social Security (6.2%)
                  and Medicare (1.45%) taxes. If your employer withheld these from your paycheck, check
                  boxes 4 and 6 on your W-2 — you may be entitled to a refund.
                </AlertDescription>
              </Alert>
            )}

            {/* Days breakdown */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-base">Substantial Presence Test — Day Count</CardTitle>
                <CardDescription>How your days in the U.S. are calculated</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <div>
                      <p className="text-sm font-medium">Days in 2025 (current year)</p>
                      <p className="text-xs text-muted-foreground">Counted at full value</p>
                    </div>
                    <span className="text-lg font-bold">{result.daysCount.currentYear}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <div>
                      <p className="text-sm font-medium">Days in 2024 × 1/3</p>
                      <p className="text-xs text-muted-foreground">{result.daysCount.priorYear} days × 0.333 = {result.daysCount.priorYearWeighted}</p>
                    </div>
                    <span className="text-lg font-bold">{result.daysCount.priorYearWeighted}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <div>
                      <p className="text-sm font-medium">Days in 2023 × 1/6</p>
                      <p className="text-xs text-muted-foreground">{result.daysCount.twoYearsAgo} days × 0.167 = {result.daysCount.twoYearsAgoWeighted}</p>
                    </div>
                    <span className="text-lg font-bold">{result.daysCount.twoYearsAgoWeighted}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 bg-muted/50 rounded-lg px-3">
                    <div>
                      <p className="text-sm font-bold">Total weighted days</p>
                      <p className="text-xs text-muted-foreground">Threshold: {result.daysCount.threshold} days</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold">{result.daysCount.totalWeighted}</span>
                      <p className={`text-xs font-medium ${result.daysCount.meetsThreshold ? 'text-red-400' : 'text-green-400'}`}>
                        {result.daysCount.meetsThreshold ? '≥ threshold (meets SPT)' : '< threshold (does not meet SPT)'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step-by-step reasoning */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-base">How we determined your status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.reasoning.steps.map((step) => (
                  <div key={step.stepNumber} className="flex gap-3">
                    <StepIcon result={step.result} />
                    <div>
                      <p className="text-sm font-medium">{step.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                      {step.value && (
                        <Badge variant="secondary" className="mt-1.5 text-xs">{step.value}</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Required forms */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-base">Forms you need to file</CardTitle>
                <CardDescription>Based on your residency status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.forms.map((form) => (
                    <div key={form} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <FileTextIcon />
                      <div>
                        <p className="text-sm font-medium">Form {form}</p>
                        <p className="text-xs text-muted-foreground">
                          {form === '8843' && 'Statement for Exempt Individuals — required for all F-1 students'}
                          {form === '1040-NR' && 'U.S. Nonresident Alien Income Tax Return — required if you had income'}
                          {form === '1040' && 'U.S. Individual Income Tax Return — for resident aliens'}
                        </p>
                      </div>
                    </div>
                  ))}
                  {result.stateFilingRequired && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <FileTextIcon />
                      <div>
                        <p className="text-sm font-medium">Illinois Form IL-1040-NR</p>
                        <p className="text-xs text-muted-foreground">
                          Illinois state income tax return — required for income earned in IL (UIC)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Rule applied */}
            <div className="text-xs text-muted-foreground text-center">
              Rule applied: <code className="bg-muted px-1 rounded">{result.ruleApplied}</code> — {result.ruleDescription}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep('form')} className="flex-1">
                Re-run check
              </Button>
              <Link href="/dashboard" className="flex-1">
                <Button className="w-full">Back to dashboard →</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FileTextIcon() {
  return (
    <div className="size-8 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
      <span className="text-primary text-xs font-bold">📄</span>
    </div>
  );
}
