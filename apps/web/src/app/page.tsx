import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/theme-toggle';

const features = [
  {
    icon: '🏛️',
    title: 'Residency Determination',
    description:
      'Automatically calculates your tax residency status using the Substantial Presence Test with plain-English explanations at every step.',
  },
  {
    icon: '📋',
    title: 'Form 8843 Guidance',
    description:
      'Every F-1 student must file Form 8843. We walk you through exactly what to fill in and where to send it.',
  },
  {
    icon: '🤝',
    title: 'Treaty Detection',
    description:
      'Students from India, China, Korea, and other countries may qualify for tax treaty exemptions. We check automatically.',
  },
  {
    icon: '📊',
    title: 'Tax Calculation',
    description:
      'Step-by-step federal and Illinois state tax calculation with every number explained — no black boxes.',
  },
  {
    icon: '🔒',
    title: 'Secure & Private',
    description:
      'SSN/ITIN encrypted at rest with AES-256. JWT authentication. We never sell your data.',
  },
  {
    icon: '📅',
    title: 'Updated Yearly',
    description:
      'Tax rules live in configurable files — we update for each tax year without changing the application code.',
  },
];

const steps = [
  { step: '01', title: 'Create Account', description: 'Register with your UIC email in under 2 minutes.' },
  { step: '02', title: 'Enter Your Info', description: 'Tell us your visa status, arrival date, and travel history.' },
  { step: '03', title: 'Get Your Status', description: "We determine if you're a Nonresident or Resident Alien." },
  { step: '04', title: 'Prepare Filing', description: 'Download your checklist, forms guide, and filing instructions.' },
];

const faqs = [
  {
    q: 'Do I need to file taxes as an F-1 student?',
    a: "Yes. Even if you had no income, you likely need to file Form 8843 to declare your 'Exempt Individual' status. If you earned income, you'll also file Form 1040-NR.",
  },
  {
    q: 'What is Form 8843?',
    a: 'Form 8843 is a statement filed with the IRS declaring that you are an exempt individual (F-1 visa holder). It is required for every F-1 student who spent any time in the U.S. during the tax year, regardless of income.',
  },
  {
    q: 'Is FTax a tax filing service?',
    a: 'No. FTax helps you understand your situation, identify the right forms, and prepare your information — but you submit to the IRS yourself. We are an educational tool, not an IRS e-file service.',
  },
  {
    q: 'What countries have tax treaties with the U.S.?',
    a: 'India, China, South Korea, and many others. The treaty can exempt part or all of your scholarship or teaching assistant income from U.S. tax. We check your country automatically.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ─── Nav ─────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-6 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">F</span>
            </div>
            <span className="font-semibold text-lg tracking-tight">FTax</span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-foreground transition-colors">How it works</Link>
            <Link href="#faq" className="hover:text-foreground transition-colors">FAQ</Link>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-24 pb-20 px-6 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-4xl text-center animate-fade-in">
          <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-xs font-medium">
            🎓 Built for UIC F-1 International Students
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Tax filing,{' '}
            <span className="gradient-text">finally explained</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            FTax helps international students at the University of Illinois Chicago understand their
            tax situation, determine residency status, and prepare their filing — in plain English.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-base px-8 h-12 shadow-lg shadow-primary/25">
                Start for free →
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="outline" size="lg" className="text-base px-8 h-12">
                See how it works
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            Not an IRS e-file service · Educational tool only · Always free for UIC students
          </p>
        </div>

        {/* Hero cards preview */}
        <div className="mx-auto max-w-2xl mt-16 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <Card className="glass-card overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-muted/50 px-6 py-4 border-b border-border flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="size-3 rounded-full bg-red-400" />
                  <div className="size-3 rounded-full bg-yellow-400" />
                  <div className="size-3 rounded-full bg-green-400" />
                </div>
                <span className="text-xs text-muted-foreground font-mono">Residency Check Result</span>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="size-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-400 text-lg">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">You are a Nonresident Alien</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      As an F-1 student in your first 5 calendar years, you are automatically an
                      &quot;Exempt Individual&quot; and do not count days toward the Substantial Presence Test.
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-3 gap-4 text-center">
                  {[
                    { label: 'Days this year', value: '180' },
                    { label: 'Weighted total', value: '210' },
                    { label: 'Forms needed', value: '8843 + 1040-NR' },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-lg font-bold">{item.value}</p>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ─── Features ─────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Everything you need to file with confidence
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Built specifically for the tax situation of F-1 students at UIC — not a generic tool
              that leaves you guessing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {features.map((feature) => (
              <Card key={feature.title} className="glass-card animate-fade-in hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="text-3xl mb-4">{feature.icon}</div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it works ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6 bg-muted/30">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">How it works</Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              From confused to filing-ready in 4 steps
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={step.step} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-[calc(100%-12px)] w-full h-px bg-border z-0" />
                )}
                <div className="relative z-10">
                  <div className="size-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                    <span className="text-primary font-bold text-sm">{step.step}</span>
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-24 px-6">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">FAQ</Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Common questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.q} className="glass-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="glass-card p-12 relative overflow-hidden">
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-cyan-500/5" />
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Ready to demystify your taxes?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join UIC international students who use FTax to understand their tax situation.
              Always free. Always clear.
            </p>
            <Link href="/register">
              <Button size="lg" className="text-base px-10 h-12 shadow-lg shadow-primary/25">
                Create your free account →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-border py-12 px-6">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">F</span>
            </div>
            <span className="font-semibold">FTax</span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Not tax advice · For informational and educational purposes only · UIC F-1 students
          </p>
          <p className="text-xs text-muted-foreground">© 2025 FTax</p>
        </div>
      </footer>
    </div>
  );
}
