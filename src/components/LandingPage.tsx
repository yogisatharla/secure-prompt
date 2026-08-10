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

function createCardFrontPng(): string {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1536;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.save();
  ctx.translate(0, 0);
  ctx.scale(1, 1);

  // Background
  ctx.fillStyle = '#06090e'; 
  ctx.fillRect(0, 0, 1024, 1536);

  // Outer Border Frame
  ctx.strokeStyle = '#8A7338';
  ctx.lineWidth = 4;
  ctx.strokeRect(40, 40, 944, 1456);

  // Inner frame
  ctx.strokeStyle = '#1a2235';
  ctx.lineWidth = 2;
  ctx.strokeRect(56, 56, 912, 1424);

  // Top header area
  ctx.fillStyle = '#0d131f';
  ctx.fillRect(56, 56, 912, 200);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 64px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SECUREPROMPT', 512, 120);

  ctx.fillStyle = '#64748b'; 
  ctx.font = '600 28px sans-serif';
  ctx.fillText('AI PROMPT SECURITY', 512, 180);

  // Divider
  ctx.strokeStyle = '#1a2235';
  ctx.beginPath();
  ctx.moveTo(56, 256);
  ctx.lineTo(968, 256);
  ctx.stroke();

  // Abstract Shield / Lock Symbol
  ctx.save();
  ctx.translate(512, 650);
  ctx.strokeStyle = '#8A7338'; 
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  ctx.beginPath();
  ctx.moveTo(0, -120);
  ctx.lineTo(100, -70);
  ctx.lineTo(100, 40);
  ctx.quadraticCurveTo(100, 120, 0, 160);
  ctx.quadraticCurveTo(-100, 120, -100, 40);
  ctx.lineTo(-100, -70);
  ctx.closePath();
  ctx.stroke();

  // Inner lock dot
  ctx.fillStyle = '#8A7338';
  ctx.beginPath();
  ctx.arc(0, 0, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Status Indicator
  ctx.fillStyle = 'rgba(16, 185, 129, 0.1)'; 
  if (ctx.roundRect) {
    ctx.beginPath();
    ctx.roundRect(362, 950, 300, 60, 30);
    ctx.fill();
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 2;
    ctx.stroke();
  } else {
    ctx.fillRect(362, 950, 300, 60);
  }

  ctx.fillStyle = '#10B981';
  ctx.beginPath();
  ctx.arc(400, 980, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#34D399';
  ctx.font = '700 24px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('STATUS: PROTECTED', 425, 982);

  // DLP Shield Text
  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 32px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('DLP SHIELD', 512, 1100);

  // Bottom Area 
  ctx.fillStyle = '#1a2235';
  for(let i=0; i<15; i++) {
    const width = Math.random() * 40 + 10;
    ctx.fillRect(150 + i * 45, 1250, width, 80);
  }

  ctx.fillStyle = '#475569';
  ctx.font = '400 20px monospace';
  ctx.fillText('ID: SP-SEC-00X // ZERO-TRUST', 512, 1400);

  ctx.restore();
  return canvas.toDataURL('image/png');
}

function createCardBackPng(): string {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1536;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.save();
  ctx.translate(1024, 0);
  ctx.scale(-1, 1);

  // Background
  ctx.fillStyle = '#040609';
  ctx.fillRect(0, 0, 1024, 1536);

  // Border
  ctx.strokeStyle = '#8A7338';
  ctx.lineWidth = 4;
  ctx.strokeRect(40, 40, 944, 1456);

  // Mag stripe (futuristic)
  ctx.fillStyle = '#000000';
  ctx.fillRect(40, 150, 944, 200);

  // Text
  ctx.fillStyle = '#475569';
  ctx.font = '400 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SECUREPROMPT ENTERPRISE', 512, 500);
  ctx.fillText('This credential validates real-time AI prompt sanitization.', 512, 580);
  ctx.fillText('Zero data retention policy is actively enforced.', 512, 640);

  // Hex grid or similar subtle pattern
  ctx.strokeStyle = '#1a2235';
  ctx.lineWidth = 1;
  for(let y = 800; y < 1400; y += 40) {
    ctx.beginPath();
    ctx.moveTo(100, y);
    ctx.lineTo(924, y);
    ctx.stroke();
  }

  ctx.restore();
  return canvas.toDataURL('image/png');
}

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
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);

  useEffect(() => {
    setFrontImage(createCardFrontPng());
    setBackImage(createCardBackPng());
  }, []);

  return (
    <div className="min-h-screen bg-brand-base flex flex-col items-center justify-start font-sans overflow-x-hidden relative">
      {/* Background Light Rays */}
      <div className="absolute inset-0 z-0 pointer-events-none">
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

      {/* Interactive 3D Lanyard Hero Canvas */}
      <div className="relative w-full h-[220px] md:h-[280px] z-10 flex items-center justify-center -mt-8">
        <Lanyard
          position={[0, 0, 21.05]}
          gravity={[0, -40, 0]}
          frontImage={frontImage}
          backImage={backImage}
          onPull={onStart}
        />
      </div>

      {/* Main Title & Action Section */}
      <div className="z-20 flex flex-col items-center max-w-4xl px-6 text-center pb-8 pt-2 w-full relative mt-0 pointer-events-none">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-3xl md:text-5xl font-mono font-bold tracking-widest text-brand-text uppercase shadow-black drop-shadow-lg mb-2"
        >
          SECURE PROMPT
        </motion.h1>

        <p className="text-sm md:text-base text-brand-muted max-w-2xl mb-6 leading-relaxed">
          Enterprise Prompt Security & Privacy Firewall. Scan your prompts before they reach external AI assistants. Detect sensitive data, assess risk, redact confidential information, and generate a safe rewritten prompt.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-12 pointer-events-auto">
          <button
            onClick={onStart}
            className="group flex items-center gap-3 bg-brand-text text-brand-base px-8 py-4 rounded-lg font-mono font-bold tracking-widest text-sm hover:bg-risk-pii hover:text-[#0B0F17] transition-all duration-300 cursor-pointer shadow-lg shadow-brand-text/10"
          >
            ENTER SCANNER
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="w-full relative z-10 pointer-events-auto">
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
      </div>
    </div>
  );
};
