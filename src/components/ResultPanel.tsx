import React, { useState, useEffect } from 'react';
import { EmptyState } from './EmptyState';
import { RiskMeter } from './RiskMeter';
import { RedactedPreview } from './RedactedPreview';
import { SafePromptCard } from './SafePromptCard';
import { RiskInsights } from './RiskInsights';
import BorderGlow from './BorderGlow';

interface ResultPanelProps {
  isScanning: boolean;
  scanResult: any;
}

export const ResultPanel = ({ isScanning, scanResult }: ResultPanelProps) => {
  const [loadingText, setLoadingText] = useState('Scanning Prompt');

  useEffect(() => {
    if (isScanning) {
      const messages = [
        'Regex',
        'Microsoft Presidio',
        'spaCy NER',
        'Redaction',
        'Phi-4-mini',
        'Safe Prompt'
      ];
      let i = 0;
      const interval = setInterval(() => {
        i = (i + 1) % messages.length;
        setLoadingText(messages[i]);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isScanning]);

  if (isScanning) {
    return (
      <BorderGlow
        className="h-full w-full"
        glowColor="200 80 80"
        backgroundColor="var(--color-brand-panel)"
        borderRadius={12}
        glowRadius={30}
        edgeSensitivity={30}
        colors={['#38bdf8', '#818cf8', '#c084fc']}
      >
        <div className="flex flex-col h-full p-5 items-center justify-center text-center">
          <div className="w-12 h-12 mb-4 border-2 border-brand-border border-t-risk-financial rounded-full animate-spin"></div>
          <p className="text-sm font-mono text-brand-muted uppercase tracking-wider animate-pulse">
            {loadingText}...
          </p>
        </div>
      </BorderGlow>
    );
  }

  if (!scanResult) {
    return (
      <BorderGlow
        className="h-full w-full"
        glowColor="200 80 80"
        backgroundColor="var(--color-brand-panel)"
        borderRadius={12}
        glowRadius={30}
        edgeSensitivity={30}
        colors={['#38bdf8', '#818cf8', '#c084fc']}
      >
        <div className="h-full">
          <EmptyState />
        </div>
      </BorderGlow>
    );
  }

  return (
    <BorderGlow
      className="h-full w-full"
      glowColor="350 80 70"
      backgroundColor="var(--color-brand-panel)"
      borderRadius={12}
      glowRadius={30}
      edgeSensitivity={30}
      colors={['#f43f5e', '#ec4899', '#f87171']}
    >
      <div className="flex flex-col h-full p-5 overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-baseline mb-6">
          <h2 className="text-xs font-mono text-brand-muted uppercase tracking-wider">Scan Result</h2>
          <div className="text-[10px] font-mono text-brand-muted tracking-wider">
            <span className="text-risk-financial">{scanResult.entities.length} REDACTED</span> • &lt;1s
          </div>
        </div>

        <RiskMeter risk={scanResult.risk} />

        <div className="mb-6">
          <h3 className="text-[10px] font-mono text-brand-muted uppercase tracking-wider mb-3">Redacted Preview</h3>
          <RedactedPreview content={scanResult.censored} />
        </div>

        <RiskInsights entities={scanResult.entities} />
      </div>
    </BorderGlow>
  );
};
