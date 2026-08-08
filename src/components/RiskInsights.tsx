import React from 'react';
import { EntityChip } from './EntityChip';

interface Entity {
  id: number;
  type: string;
  label: string;
  value: string;
}

interface RiskInsightsProps {
  entities: Entity[];
}

export const RiskInsights = ({ entities }: RiskInsightsProps) => {
  if (!entities || entities.length === 0) return null;

  // Deduplicate entities by label so we don't show the same explanation multiple times
  const uniqueEntities = Array.from(new Map(entities.map(e => [e.label, e])).values());

  const getInsight = (entity: Entity) => {
    switch (entity.type) {
      case 'API_KEY':
      case 'PASSWORD':
        return {
          risk: 'Critical',
          reason: 'Authentication credentials could allow unauthorized access to enterprise systems or production services.',
          recommendation: `Replace with [${entity.type}] before sharing.`
        };
      case 'PERSON':
      case 'EMAIL':
      case 'PHONE':
      case 'ADDRESS':
        return {
          risk: 'High',
          reason: `Exposing personal information like ${entity.label.toLowerCase()} can lead to privacy violations or breach of data protection regulations (e.g., GDPR, CCPA).`,
          recommendation: `Use a generic placeholder like [${entity.type}] or synthetic data.`
        };
      case 'FINANCIAL_AMOUNT':
      case 'ACCOUNT_NUMBER':
        return {
          risk: 'High',
          reason: `Financial data such as ${entity.label.toLowerCase()} is highly sensitive and targeted by attackers. Sharing it over unencrypted or external channels poses a severe risk.`,
          recommendation: `Redact the exact value and replace with a generic descriptor like [${entity.type}].`
        };
      case 'PROJECT_NAME':
      case 'ORGANIZATION':
        return {
          risk: 'Medium',
          reason: 'Internal project names and organizational details may leak unannounced product features, strategic initiatives, or proprietary business logic.',
          recommendation: `Use generic terms like [${entity.type}] instead of the real names.`
        };
      default:
        return {
          risk: 'Low',
          reason: 'This information may be sensitive depending on context.',
          recommendation: `Review and replace with [${entity.label.toUpperCase().replace(/\s+/g, '_')}] if necessary.`
        };
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toUpperCase()) {
      case 'CRITICAL': return 'text-risk-critical';
      case 'HIGH': return 'text-risk-credential';
      case 'MEDIUM': return 'text-risk-pii';
      case 'LOW': return 'text-risk-financial';
      default: return 'text-brand-muted';
    }
  };

  return (
    <div className="mb-6 flex flex-col gap-4">
      <h3 className="text-[10px] font-mono text-brand-muted uppercase tracking-wider mb-1">Risk Insights & Education</h3>
      {uniqueEntities.map((entity) => {
        const insight = getInsight(entity);
        return (
          <div key={entity.id} className="bg-brand-base rounded-lg border border-brand-border p-4 text-sm flex flex-col gap-2">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <EntityChip type={entity.type as any} label={entity.label} />
              </div>
              <div className={`text-xs font-mono uppercase tracking-wider ${getRiskColor(insight.risk)}`}>
                Risk: {insight.risk}
              </div>
            </div>
            <div>
              <span className="text-xs font-mono text-brand-muted uppercase tracking-wider mr-2">Reason:</span>
              <span className="text-gray-300">{insight.reason}</span>
            </div>
            <div>
              <span className="text-xs font-mono text-brand-muted uppercase tracking-wider mr-2">Recommendation:</span>
              <span className="text-gray-300">{insight.recommendation}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
