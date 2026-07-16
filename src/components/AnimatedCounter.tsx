import React, { useState, useEffect, useRef } from 'react';

interface AnimatedCounterProps {
  value: string;
}

export default function AnimatedCounter({ value }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState('0');
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  // Extract number and suffix from value
  // Examples: "60%" -> number: 60, suffix: "%"
  // "4.5 Hrs" -> number: 4.5, suffix: " Hrs"
  // "SOC 2" -> static text, no animation
  const match = value.match(/^([\d.]+)(.*)$/);
  const hasNumeric = !!match;
  const targetNumber = hasNumeric ? parseFloat(match[1]) : 0;
  const suffix = hasNumeric ? match[2] : value;

  useEffect(() => {
    if (!hasNumeric) {
      setDisplayValue(value);
      return;
    }

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDisplayValue(value);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            animateValue();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    const animateValue = () => {
      const start = 0;
      const end = targetNumber;
      const duration = 1200; // 1.2 seconds duration
      let startTime: number | null = null;

      const step = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        // Quad ease-out equation
        const easeProgress = progress * (2 - progress);
        const currentCount = start + easeProgress * (end - start);

        // Format decimal places based on target number
        const formatted = Number.isInteger(end)
          ? Math.floor(currentCount).toString()
          : currentCount.toFixed(1);

        setDisplayValue(formatted + suffix);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          setDisplayValue(value); // ensure exact target is set at end
        }
      };

      requestAnimationFrame(step);
    };

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [value, targetNumber, suffix, hasNumeric, hasAnimated]);

  return (
    <span ref={elementRef} className="tabular-nums">
      {displayValue}
    </span>
  );
}
