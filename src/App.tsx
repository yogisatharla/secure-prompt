import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ComposePanel } from './components/ComposePanel';
import { ResultPanel } from './components/ResultPanel';
import { useMockScan } from './hooks/useMockScan';
import { LandingPage } from './components/LandingPage';
import { ClickSpark } from './components/ClickSpark';
import { ActionBar } from './components/ActionBar';
import { SafePromptCard } from './components/SafePromptCard';
import Scanner from './components/Scanner';

export default function App() {
  const [started, setStarted] = useState(false);
  const { scan, isScanning, scanResult } = useMockScan();

  return (
    <ClickSpark sparkColor="#D9A441" sparkSize={12} sparkRadius={20} sparkCount={10}>
      <div className="relative w-full min-h-screen bg-brand-base overflow-hidden">
        <AnimatePresence mode="wait">
          {!started ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="absolute inset-0 w-full h-full overflow-y-auto"
            >
              <LandingPage onStart={() => setStarted(true)} />
            </motion.div>
          ) : (
            <motion.div
              key="app"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="min-h-screen w-full flex flex-col font-sans relative"
            >
              <div className="fixed inset-0 z-0 pointer-events-none opacity-80 mix-blend-screen">
                <Scanner
                  color1="#5227FF"
                  color2="#FF9FFC"
                  color3="#FFFFFF"
                  speed={0.8}
                  sweepSpeed={0.3}
                  sweepWidth={1.6}
                  sweepFalloff={6}
                  scale={1.5}
                  frequency={2}
                  ripple={0.3}
                  bandDensity={11}
                  lineSharpness={5.5}
                  glow={0.3}
                  scanDirection="vertical"
                  colorSpread={0.7}
                  brightness={1.5}
                  contrast={1.15}
                  softness={1.4}
                  vignette={0.45}
                  scanline={true}
                  grain={true}
                  grainIntensity={0.1}
                  opacity={1.0}
                  mouseInteraction={false}
                />
              </div>
              <div className="relative z-10 flex flex-col min-h-screen w-full">
                <Header />
                
                <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-4 flex flex-col">
                  <div className="flex-1 flex flex-col lg:flex-row gap-4 sm:gap-6 min-h-[calc(100vh-180px)] lg:h-[calc(100vh-250px)]">
                  {/* Left Column */}
                  <div className="flex-1 flex flex-col lg:overflow-y-auto custom-scrollbar h-full pr-2 gap-6 pb-4">
                    <ComposePanel 
                      onScan={scan} 
                      isScanning={isScanning} 
                      scanResult={scanResult} 
                    />
                    
                    {scanResult && !isScanning && (
                      <div className="flex flex-col gap-4 mt-auto">
                        <div>
                          <h3 className="text-[10px] font-mono text-brand-muted uppercase tracking-wider mb-3 ml-1">Safe Rewritten Prompt</h3>
                          <SafePromptCard content={scanResult.rewrite} censored={scanResult.censored} />
                        </div>
                        <ActionBar content={scanResult.rewrite} censored={scanResult.censored} />
                      </div>
                    )}
                  </div>
                  
                  {/* Right Column */}
                  <div className="flex-1 flex flex-col lg:overflow-hidden h-full">
                    <ResultPanel 
                      isScanning={isScanning} 
                      scanResult={scanResult} 
                    />
                  </div>
                </div>
              </main>

              <Footer />
            </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ClickSpark>
  );
}

