import React, { useRef } from 'react';
import { Paperclip, FileText } from 'lucide-react';

interface UploadButtonProps {
  onFileUpload: (content: string, fileName: string) => void;
  uploadedFileName?: string | null;
}

export const UploadButton: React.FC<UploadButtonProps> = ({ onFileUpload, uploadedFileName }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === 'string') {
          onFileUpload(result, file.name);
        }
      };
      reader.readAsText(file);
    }
    // reset input so same file can be selected again
    if (e.target) {
      e.target.value = '';
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".txt,.md,.csv,.json,.log,.doc,.docx,text/*"
        className="hidden"
      />
      <button
        onClick={handleClick}
        type="button"
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-brand-base/80 hover:bg-brand-card text-brand-muted hover:text-brand-text transition-all border border-brand-border text-xs font-mono cursor-pointer"
        title="Upload file (.txt, .md, .csv, .json, .log)"
      >
        {uploadedFileName ? (
          <>
            <FileText className="w-3.5 h-3.5 text-risk-project" />
            <span className="max-w-[120px] truncate text-[11px] font-mono text-brand-text">
              {uploadedFileName}
            </span>
          </>
        ) : (
          <>
            <Paperclip className="w-3.5 h-3.5" />
            <span className="text-[11px] font-mono">Upload File</span>
          </>
        )}
      </button>
    </>
  );
};
