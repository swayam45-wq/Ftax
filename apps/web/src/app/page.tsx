'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRightCircle, Zap, LockKeyhole, Fingerprint, Menu, X } from 'lucide-react';

/* ── Logo Component ── */
function Logo() {
  return (
    <svg width="32" height="32" viewBox="0 0 256 256" fill="#192837">
      <path d="M 64 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 L 128 64 L 128 64.5 L 161 32 L 192 0 L 256 0 L 256 64 L 192 128 L 128 128 L 128 192 L 96 223 L 63.5 256 L 0 256 L 0 192 Z M 256 192 L 224 223 L 191.5 256 L 128 256 L 128 192 L 192 128 L 256 128 Z" />
    </svg>
  );
}

/* ── Animation Variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as any,
    },
  }),
};

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = ['Vault', 'Plans', 'Install', 'News', 'Help'];

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}>
      {/* ── Background Video ── */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 z-0 w-full h-full object-cover"
      >
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260606_131516_eca35265-ea66-4fbd-8d52-22aae6e1a503.mp4" type="video/mp4" />
      </video>

      {/* ── Navbar ── */}
      <header className="relative z-10 w-full">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-4 sm:py-5 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-sm font-medium transition-opacity hover:opacity-70"
                style={{ color: 'var(--color-text)' }}
              >
                {link}
              </Link>
            ))}
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/register"
              className="text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:shadow-lg active:scale-95 text-white"
              style={{ backgroundColor: '#7342E2' }}
            >
              Start For Free
            </Link>
            <Link
              href="/login"
              className="text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:shadow-md active:scale-95"
              style={{ backgroundColor: '#F2F2EE', color: 'var(--color-text)' }}
            >
              Sign In
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-full transition-colors hover:bg-black/5"
            onClick={() => setMobileMenuOpen(true)}
            style={{ color: 'var(--color-text)' }}
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* ── Mobile Menu Slide-in Sheet ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-[#192837]/35 backdrop-blur-[4px]"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Sheet */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{
                type: 'tween',
                ease: (mobileMenuOpen ? [0.22, 1, 0.36, 1] : [0.55, 0, 1, 0.45]) as any,
                duration: mobileMenuOpen ? 0.45 : 0.35,
              }}
              className="fixed right-0 top-0 bottom-0 z-50 h-[100dvh] flex flex-col"
              style={{
                width: 'min(88vw, 360px)',
                backgroundColor: '#CFC8C5',
                boxShadow: '-12px 0 48px rgba(25,40,55,0.18)',
              }}
            >
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-5">
                <Logo />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-[#192837]/10"
                  style={{ color: 'var(--color-text)' }}
                >
                  <X size={20} />
                </motion.button>
              </div>

              {/* Divider */}
              <div className="h-[1px] bg-[#192837]/12 mx-6 my-2" />

              {/* Nav Links (Staggered) */}
              <div className="flex flex-col gap-2 px-4 py-4 flex-grow">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link}
                    initial={{ x: 24, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{
                      delay: 0.18 + i * 0.07,
                      duration: 0.4,
                      ease: [0.22, 1, 0.36, 1] as any,
                    }}
                  >
                    <Link
                      href={`#${link.toLowerCase()}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-[1.1rem] font-medium px-4 py-3 rounded-xl hover:bg-black/10 transition-colors"
                      style={{ color: 'var(--color-text)' }}
                    >
                      {link}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="p-6 flex flex-col gap-3">
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3.5 rounded-full font-semibold transition-all hover:brightness-110 text-white text-[0.95rem]"
                  style={{ backgroundColor: '#7342E2' }}
                >
                  Start For Free
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3.5 rounded-full font-semibold transition-all hover:bg-black/5 text-[0.95rem]"
                  style={{ backgroundColor: '#F2F2EE', color: 'var(--color-text)' }}
                >
                  Sign In
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Hero Content ── */}
      <main className="relative z-10 max-w-[1280px] mx-auto px-5 sm:px-8 flex flex-col items-center justify-center" style={{ paddingTop: 'clamp(40px, 8vw, 72px)', paddingBottom: '48px' }}>
        <div className="max-w-[660px] w-full flex flex-col items-center">
          {/* Heading */}
          <motion.h1
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-center font-bold tracking-[-0.01em] mb-6"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.65rem, 5vw, 3rem)',
              lineHeight: '1.05',
              color: 'var(--color-text)',
            }}
          >
            Lock{' '}
            <Zap
              size={24}
              style={{
                display: 'inline',
                verticalAlign: 'middle',
                position: 'relative',
                top: '-2px',
                color: '#192837',
                margin: '0 4px',
              }}
            />{' '}
            Down Your{' '}
            <LockKeyhole
              size={24}
              style={{
                display: 'inline',
                verticalAlign: 'middle',
                position: 'relative',
                top: '-2px',
                color: '#192837',
                margin: '0 4px',
              }}
            />{' '}
            Passwords
            <br />
            with Ironclad Security
            <Fingerprint
              size={24}
              style={{
                display: 'inline',
                verticalAlign: 'middle',
                position: 'relative',
                top: '-2px',
                color: '#192837',
                marginLeft: '6px',
              }}
            />
          </motion.h1>

          {/* Subtext */}
          <motion.p
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-center max-w-[560px] mb-8"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
              lineHeight: '1.65',
              color: 'var(--color-text)',
              opacity: 0.8,
            }}
          >
            Zero stress, total control. Unbreakable storage, one-tap access, and pro-grade tools for your non-stop world.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              whileHover={{ scale: 1.04, filter: 'brightness(1.1)' }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              <Link
                href="/register"
                className="inline-flex justify-between items-center rounded-full text-white font-semibold transition-all"
                style={{
                  backgroundColor: '#7342E2',
                  fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                  padding: '17px 24px',
                  minWidth: '210px',
                  boxShadow: '0 4px 24px rgba(115,66,226,0.28)',
                  gap: '32px',
                }}
              >
                <span>Get It Free</span>
                <ArrowRightCircle size={20} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
