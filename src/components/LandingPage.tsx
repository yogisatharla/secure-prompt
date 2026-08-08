import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, ArrowRight, Lock, Eye, Zap, ShieldCheck } from 'lucide-react';
import Lanyard from './Lanyard';
import ScrambledText from './ScrambledText';
import MagicBento from './MagicBento';
import LightRays from './LightRays';
import PixelBlast from './PixelBlast';

interface LandingPageProps {
  onStart: () => void;
}

const SHIELD_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="200" height="200" fill="none" stroke="%23D9A441" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;

const bentoCards = [
  {
    title: 'Zero Data Retention',
    description: 'Prompts stay strictly in local memory and browser context.',
    label: 'Privacy by Design',
    icon: <Lock className="w-5 h-5 text-risk-financial" />
  },
  {
    title: 'Real-time Redaction',
    description: 'Automatically detects and masks PII, API tokens, passwords, and financials.',
    label: 'Sensitive Data Detection',
    icon: <Shield className="w-5 h-5 text-risk-pii" />
  },
  {
    title: 'Contextual Rewriting',
    description: 'Generates anonymized prompt alternatives to maintain model performance safely.',
    label: 'Safe Prompt Rewriting',
    icon: <Zap className="w-5 h-5 text-risk-project" />
  },
  {
    title: 'Instant Risk Scoring',
    description: 'Dynamic threat metrics, categorization, and audit log preview prior to dispatch.',
    label: 'Prompt Risk Assessment',
    icon: <ShieldCheck className="w-5 h-5 text-risk-pii" />
  }
];

export const LandingPage = ({ onStart }: LandingPageProps) => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4500); // Increased time to let the lanyard animation play
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-brand-base flex flex-col items-center justify-center font-sans overflow-x-hidden py-12 relative">
      {/* ALWAYS render Splash to avoid WebGL/Rapier unmount crash, just fade it out */}
      <motion.div
        initial={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        animate={{ 
          opacity: showSplash ? 1 : 0, 
          scale: showSplash ? 1 : 0.95,
          filter: showSplash ? 'blur(0px)' : 'blur(10px)',
          pointerEvents: showSplash ? 'auto' : 'none'
        }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        className="absolute inset-0 flex flex-col items-center justify-center w-full h-full z-10"
        style={{ zIndex: showSplash ? 50 : -1 }}
      >
        <div className="absolute inset-0 z-0">
            <LightRays
              raysOrigin="top-center"
              raysColor="#D9A441"
              raysSpeed={1.5}
              lightSpread={0.8}
              rayLength={1.2}
              followMouse={true}
              mouseInfluence={0.1}
              noiseAmount={0.1}
              distortion={0.05}
            />
        </div>
        <div className="absolute inset-0 z-10">
            <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} frontImage={SHIELD_SVG} />
        </div>
        
        <div className="z-20 absolute bottom-20 flex flex-col items-center pointer-events-none">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 1 }}
            className="text-3xl font-mono font-bold tracking-widest text-brand-text uppercase shadow-black drop-shadow-lg"
          >
            Secure Prompt
          </motion.h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.5, ease: 'easeInOut', delay: 1.5 }}
            className="h-px bg-gradient-to-r from-transparent via-brand-border to-transparent mt-4 w-48"
          />
        </div>
      </motion.div>

      {/* Main Landing Page Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showSplash ? 0 : 1, y: showSplash ? 20 : 0 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: showSplash ? 0 : 0.2 }}
        className="flex flex-col items-center max-w-5xl px-6 text-center my-auto w-full relative z-10"
        style={{ pointerEvents: showSplash ? 'none' : 'auto' }}
      >
        <div className="fixed inset-0 z-0 opacity-30 pointer-events-none">
          {!showSplash && (
            <PixelBlast
              variant="circle"
              pixelSize={3}
              color="#B497CF"
              patternScale={3}
              patternDensity={1.2}
              pixelSizeJitter={0.5}
              enableRipples
              rippleSpeed={0.4}
              rippleThickness={0.12}
              rippleIntensityScale={1.5}
              liquid
              liquidStrength={0.12}
              liquidRadius={1.2}
              liquidWobbleSpeed={5}
              speed={0.6}
              edgeFade={0.25}
              transparent
            />
          )}
        </div>
        
        <div className="w-16 h-16 mb-6 rounded-2xl bg-brand-panel border border-brand-border flex items-center justify-center shadow-lg shadow-black/20 relative z-10">
          <Shield className="w-8 h-8 text-risk-pii" />
        </div>
        
        <ScrambledText 
          className="text-4xl md:text-6xl font-sans font-bold text-brand-text tracking-tight mb-4 !m-0 !max-w-none !font-sans relative z-10" 
          scrambleChars=".:"
          speed={0.4}
          duration={1}
          radius={30}
        >
          Enterprise Prompt Security
        </ScrambledText>
        
        <p className="text-base md:text-lg text-brand-muted max-w-2xl mb-8 leading-relaxed mt-4 relative z-10">
          Scan, redact, and rewrite your prompts before submission. Prevent sensitive data leaks, calculate risk scores, and enforce Privacy-by-Design in your workflows.
        </p>

        <div className="w-full mb-10 relative z-10">
          <MagicBento
            cards={bentoCards}
            textAutoHide={false}
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={true}
            enableMagnetism={true}
            clickEffect={true}
            spotlightRadius={280}
            particleCount={10}
            glowColor="217, 164, 65"
          />
        </div>

        <button
          onClick={onStart}
          className="group flex items-center gap-3 bg-brand-text text-brand-base px-8 py-4 rounded-lg font-mono font-bold tracking-widest text-sm hover:bg-risk-pii hover:text-[#0B0F17] transition-all duration-300 cursor-pointer shadow-lg shadow-brand-text/10 relative z-10"
        >
          GET STARTED
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </div>
  );
};
