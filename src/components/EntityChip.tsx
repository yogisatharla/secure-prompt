import React from 'react';

interface EntityChipProps {
  type: string;
  label: string;
}

export const EntityChip = ({ type, label }: EntityChipProps) => {
  const getColors = () => {
    switch (type) {
      case 'PERSON':
      case 'EMAIL':
      case 'PHONE':
      case 'ADDRESS':
        return 'text-risk-pii bg-risk-pii/10 border-risk-pii/30';
      case 'API_KEY':
      case 'PASSWORD':
        return 'text-risk-credential bg-risk-credential/10 border-risk-credential/30';
      case 'FINANCIAL_AMOUNT':
      case 'ACCOUNT_NUMBER':
        return 'text-risk-financial bg-risk-financial/10 border-risk-financial/30';
      case 'PROJECT_NAME':
      case 'ORGANIZATION':
        return 'text-risk-project bg-risk-project/10 border-risk-project/30';
      default: return 'text-brand-muted bg-brand-border/10 border-brand-border/30';
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono border ${getColors()}`}>
      {label}
    </span>
  );
};
