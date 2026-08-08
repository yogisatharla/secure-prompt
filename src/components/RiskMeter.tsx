import React from 'react';

export const RiskMeter = ({ risk }: { risk: { score: number; level: string } }) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'text-risk-financial'; // Reuse green
      case 'MEDIUM': return 'text-risk-pii';
      case 'HIGH': return 'text-risk-credential';
      case 'CRITICAL': return 'text-risk-critical';
      default: return 'text-brand-muted';
    }
  };

  const getRiskBg = (level: string) => {
    switch (level) {
      case 'LOW': return 'bg-risk-financial';
      case 'MEDIUM': return 'bg-risk-pii';
      case 'HIGH': return 'bg-risk-credential';
      case 'CRITICAL': return 'bg-risk-critical';
      default: return 'bg-brand-muted';
    }
  };

  const colorClass = getRiskColor(risk.level);
  const bgClass = getRiskBg(risk.level);

  return (
    <div className="flex flex-col gap-2 mb-6">
      <div className="flex justify-between items-baseline">
        <span className="text-xs font-mono text-brand-muted uppercase tracking-wider">Risk Score</span>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-mono ${colorClass}`}>{risk.score}/100</span>
          <span className="text-brand-muted font-mono text-xs">•</span>
          <span className={`text-sm font-mono ${colorClass} uppercase`}>{risk.level}</span>
        </div>
      </div>
      <div className="w-full h-1.5 bg-brand-base rounded-full overflow-hidden">
        <div 
          className={`h-full ${bgClass} rounded-full transition-all duration-1000 ease-out`} 
          style={{ width: `${risk.score}%` }} 
        />
      </div>
    </div>
  );
};
