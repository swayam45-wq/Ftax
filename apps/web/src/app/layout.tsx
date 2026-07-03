import type { Metadata } from 'next';
import { Inter, Geist } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'FTax — F-1 Student Tax Assistant | UIC',
    template: '%s | FTax',
  },
  description:
    'Free tax assistance for F-1 international students at the University of Illinois Chicago. Determine your residency status, find required forms, and prepare your tax filing.',
  keywords: ['F-1 student tax', 'international student taxes', 'UIC', 'Form 8843', '1040-NR', 'nonresident alien'],
  authors: [{ name: 'FTax' }],
  openGraph: {
    title: 'FTax — F-1 Student Tax Assistant',
    description: 'Tax guidance built specifically for UIC international students',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
