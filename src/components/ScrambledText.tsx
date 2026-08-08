import React, { useEffect, useRef } from 'react';
import './ScrambledText.css';

interface ScrambledTextProps {
  radius?: number;
  duration?: number;
  speed?: number;
  scrambleChars?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

const ScrambledText: React.FC<ScrambledTextProps> = ({
  radius = 100,
  duration = 1.2,
  speed = 0.5,
  scrambleChars = '.:',
  className = '',
  style = {},
  children
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const text = typeof children === 'string' ? children : String(children);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const p = el.querySelector('p');
    if (!p) return;

    // Split text into spans
    p.innerHTML = '';
    const spans: HTMLSpanElement[] = [];
    for (let i = 0; i < text.length; i++) {
      const span = document.createElement('span');
      span.style.display = 'inline-block';
      if (text[i] === ' ') {
        span.innerHTML = '&nbsp;';
      } else {
        span.textContent = text[i];
      }
      span.dataset.char = text[i];
      p.appendChild(span);
      spans.push(span);
    }

    const state = spans.map(() => ({
       isScrambling: false,
       startTime: 0,
       duration: 0
    }));

    let rafId: number;

    const handleMove = (e: PointerEvent) => {
      spans.forEach((c, i) => {
        const rect = c.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        const dist = Math.hypot(dx, dy);

        if (dist < radius) {
           const time = performance.now();
           const scrambleDuration = duration * 1000 * (1 - dist / radius);
           state[i].isScrambling = true;
           state[i].startTime = time;
           state[i].duration = scrambleDuration;
        }
      });
    };

    const scrambleArr = scrambleChars.split('');

    const animate = (time: number) => {
      spans.forEach((c, i) => {
         const s = state[i];
         if (s.isScrambling) {
             const elapsed = time - s.startTime;
             if (elapsed > s.duration) {
                 s.isScrambling = false;
                 if (c.dataset.char === ' ') {
                     c.innerHTML = '&nbsp;';
                 } else {
                     c.textContent = c.dataset.char || '';
                 }
             } else {
                 // Adjust speed factor for visibility
                 if (Math.random() < speed) {
                     c.textContent = scrambleArr[Math.floor(Math.random() * scrambleArr.length)];
                 }
             }
         }
      });
      rafId = requestAnimationFrame(animate);
    };

    el.addEventListener('pointermove', handleMove);
    rafId = requestAnimationFrame(animate);

    return () => {
      el.removeEventListener('pointermove', handleMove);
      cancelAnimationFrame(rafId);
    };
  }, [text, radius, duration, scrambleChars, speed]);

  return (
    <div ref={rootRef} className={`text-block ${className}`} style={style}>
      <p>{text}</p>
    </div>
  );
};

export default ScrambledText;
