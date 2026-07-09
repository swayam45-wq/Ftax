'use client';
import { useEffect, useRef, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'left' | 'right' | 'scale';
  delay?: number;
  style?: React.CSSProperties;
  as?: keyof JSX.IntrinsicElements;
}

export function ScrollReveal({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  style,
  as: Tag = 'div',
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (delay) el.style.transitionDelay = `${delay}ms`;

    const dirClass = direction === 'left'  ? 'reveal reveal-left'
                   : direction === 'right' ? 'reveal reveal-right'
                   : direction === 'scale' ? 'reveal reveal-scale'
                   : 'reveal';
    el.className = [dirClass, className].filter(Boolean).join(' ');

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          obs.disconnect();
        }
      },
      { threshold: 0.12 },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [direction, delay, className]);

  return (
    // @ts-expect-error dynamic tag
    <Tag ref={ref} style={style} className={`reveal ${direction === 'left' ? 'reveal-left' : direction === 'right' ? 'reveal-right' : direction === 'scale' ? 'reveal-scale' : ''} ${className}`}>
      {children}
    </Tag>
  );
}

/** Wraps children in a .stagger container so CSS delays apply automatically */
export function StaggerReveal({
  children,
  className = '',
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`stagger ${className}`} style={style}>
      {children}
    </div>
  );
}
