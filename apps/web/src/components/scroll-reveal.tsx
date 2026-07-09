'use client';
import { useEffect, useRef, ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'left' | 'right' | 'scale';
  delay?: number;
  style?: React.CSSProperties;
}

export function ScrollReveal({ children, className = '', direction = 'up', delay = 0, style }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (delay) el.style.transitionDelay = `${delay}ms`;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          obs.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  const dirClass =
    direction === 'left'  ? 'reveal reveal-left'
    : direction === 'right' ? 'reveal reveal-right'
    : direction === 'scale' ? 'reveal reveal-scale'
    : 'reveal';

  return (
    <div ref={ref} className={`${dirClass} ${className}`} style={style}>
      {children}
    </div>
  );
}

export function StaggerReveal({ children, className = '', style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`stagger ${className}`} style={style}>
      {children}
    </div>
  );
}
