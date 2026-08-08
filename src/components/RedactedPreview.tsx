import React, { useState, useEffect } from 'react';

export const RedactedPreview = ({ content }: { content: any[] }) => {
  return (
    <div className="bg-brand-base rounded-lg border border-brand-border p-4 text-sm leading-relaxed whitespace-pre-wrap">
      {content.map((segment, idx) => {
        if (segment.type === 'redacted') {
          return (
            <span
              key={idx}
              className="inline-block bg-black text-black px-1 mx-0.5 rounded select-none relative overflow-hidden"
              title="Redacted"
            >
              {/* Add invisible text for layout but render a black bar */}
              <span className="opacity-0">{segment.content}</span>
              <span className="absolute inset-0 bg-[#0B0F17]"></span>
            </span>
          );
        }
        return <span key={idx}>{segment.content}</span>;
      })}
    </div>
  );
};
