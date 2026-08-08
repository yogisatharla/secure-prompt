import React from 'react';

interface SafePromptCardProps {
  content: string;
  censored?: any[];
}

export const SafePromptCard: React.FC<SafePromptCardProps> = ({ content, censored }) => {
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="bg-brand-base rounded-lg border border-brand-border p-4 text-sm leading-relaxed whitespace-pre-wrap select-text text-brand-text font-sans h-full min-h-[100px]">
        {content}
      </div>
    </div>
  );
};

