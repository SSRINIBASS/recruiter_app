'use client';

import React, { useState, useRef } from 'react';
import { IconUpload, IconFileCheck, IconLoader2, IconAlertCircle } from '@tabler/icons-react';

type ResumeUploadProps = {
  onUploadSuccess: (candidate: any) => void;
  onUploadStart?: () => void;
};

export function ResumeUpload({ onUploadSuccess, onUploadStart }: ResumeUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const uploadFile = async (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx') {
      setError('Unsupported file type. Only PDF and DOCX are allowed.');
      return;
    }

    setLoading(true);
    setError(null);
    if (onUploadStart) onUploadStart();

    try {
      // Import api dynamically to avoid SSR/timing problems
      const { api } = await import('../lib/api');
      const candidate = await api.uploadCandidate(file);
      onUploadSuccess(candidate);
    } catch (err: any) {
      setError(err.message || 'Failed to upload and parse resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await uploadFile(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileSelect}
        className={`w-full min-h-[220px] rounded-lg border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-colors ${
          isDragging 
            ? 'border-accent bg-accent-light/40' 
            : 'border-subtle hover:bg-surface-secondary/40'
        } ${loading ? 'pointer-events-none opacity-80' : ''}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.docx"
          className="hidden"
          disabled={loading}
        />

        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <IconLoader2 className="w-8 h-8 text-accent animate-spin" />
            <div>
              <p className="text-base font-medium text-text-primary">Uploading & Parsing Resume...</p>
              <p className="text-sm text-text-secondary mt-1">Gemini AI is extracting candidate profile info.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent-light flex items-center justify-center text-accent">
              <IconUpload size={20} />
            </div>
            <div>
              <p className="text-base font-medium text-text-primary">
                Drag and drop your resume file here
              </p>
              <p className="text-sm text-text-secondary mt-1">
                or <span className="text-accent font-medium hover:text-accent-text transition-colors">browse files</span> from your computer
              </p>
            </div>
            <p className="text-xs text-text-secondary font-medium tracking-wide uppercase mt-1">
              Supports PDF, DOCX
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-destructive-fill rounded-md border border-destructive-text/10 flex items-start gap-2 text-destructive-text text-sm font-medium">
          <IconAlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
