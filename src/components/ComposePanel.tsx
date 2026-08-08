import React, { useState } from 'react';
import { UploadButton } from './UploadButton';
import { Scan, Upload, FileText, X } from 'lucide-react';
import BorderGlow from './BorderGlow';

interface ComposePanelProps {
  onScan: (text: string) => void;
  isScanning: boolean;
  scanResult: any;
}

export const ComposePanel = ({ onScan, isScanning, scanResult }: ComposePanelProps) => {
  const [text, setText] = useState('Hi, can you help me draft a follow-up email to Sarah Chen about the Q3 renewal? Her account number is 4471820094 and the invoice was for $128,500. Also our API key sk-live-8fJ2kQwErT9zXa is failing in staging for Project Nightingale — she can be reached at sarah.chen@northgate.com or 415-555-0199.');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (content: string, fileName: string) => {
    setText(content);
    setUploadedFileName(fileName);
  };

  const handleClearFile = () => {
    setUploadedFileName(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === 'string') {
          handleFileUpload(result, file.name);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <BorderGlow
      className="h-full w-full"
      glowColor="40 80 80"
      backgroundColor="var(--color-brand-panel)"
      borderRadius={12}
      glowRadius={30}
      edgeSensitivity={30}
      colors={['#c084fc', '#f472b6', '#38bdf8']}
    >
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex flex-col h-full transition-colors p-5 relative overflow-hidden ${
          isDragging ? 'bg-brand-panel/90 border border-risk-pii rounded-xl' : ''
        }`}
      >
        {isDragging && (
          <div className="absolute inset-0 bg-brand-base/90 z-20 flex flex-col items-center justify-center gap-3 border-2 border-dashed border-risk-pii rounded-xl backdrop-blur-sm">
            <Upload className="w-10 h-10 text-risk-pii animate-bounce" />
            <p className="text-sm font-mono text-brand-text font-bold uppercase tracking-wider">
              Drop file to load content
            </p>
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-mono text-brand-muted uppercase tracking-wider">Compose or Upload</h2>
            {uploadedFileName && (
              <div className="flex items-center gap-1 bg-brand-base px-2 py-0.5 rounded border border-brand-border text-[10px] font-mono text-brand-text">
                <FileText className="w-3 h-3 text-risk-project" />
                <span className="max-w-[140px] truncate">{uploadedFileName}</span>
                <button
                  onClick={handleClearFile}
                  className="hover:text-risk-critical ml-1 transition-colors"
                  title="Clear file tag"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <UploadButton
              onFileUpload={handleFileUpload}
              uploadedFileName={uploadedFileName}
            />
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-base border border-brand-border text-[10px] font-mono tracking-wider text-risk-financial">
              <span className="w-1.5 h-1.5 rounded-full bg-risk-financial animate-pulse" />
              LIVE SCAN
            </div>
          </div>
        </div>

        <div className="flex-1 mb-4 relative">
          <textarea
            className="w-full h-full bg-transparent resize-none outline-none text-sm text-brand-text leading-relaxed font-sans"
            placeholder="Paste or drop a prompt file (.txt, .md, .json, .csv, .log) before sending it to AI models."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className="flex justify-between items-center border-t border-brand-border pt-4">
          {scanResult ? (
            <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono tracking-wider">
              <span className="text-risk-pii"><span className="inline-block w-1.5 h-1.5 rounded-full bg-risk-pii mr-1" />PII • {scanResult.stats.pii}</span>
              <span className="text-risk-financial"><span className="inline-block w-1.5 h-1.5 rounded-full bg-risk-financial mr-1" />FINANCIAL • {scanResult.stats.financial}</span>
              <span className="text-risk-project"><span className="inline-block w-1.5 h-1.5 rounded-full bg-risk-project mr-1" />PROJECT • {scanResult.stats.project}</span>
              <span className="text-risk-credential"><span className="inline-block w-1.5 h-1.5 rounded-full bg-risk-credential mr-1" />CREDENTIAL • {scanResult.stats.credential}</span>
              <span className={`ml-2 ${scanResult.risk.level === 'CRITICAL' ? 'text-risk-critical' : 'text-brand-muted'}`}>
                RISK {scanResult.risk.score} • {scanResult.risk.level}
              </span>
            </div>
          ) : (
            <div className="flex items-center text-[10px] font-mono text-brand-muted uppercase tracking-wider">
              Ready to scan
            </div>
          )}
          
          <button
            onClick={() => onScan(text)}
            disabled={isScanning || !text.trim()}
            className="flex items-center gap-2 bg-risk-pii text-[#0B0F17] hover:bg-risk-pii/90 px-6 py-2.5 rounded-md text-xs font-mono font-bold tracking-wide transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isScanning ? (
              <span className="animate-pulse">SCANNING...</span>
            ) : (
              <>
                <Scan className="w-4 h-4" />
                SCAN & REWRITE
              </>
            )}
          </button>
        </div>
      </div>
    </BorderGlow>
  );
};
