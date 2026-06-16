'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { IconChevronLeft } from '@tabler/icons-react';
import { ResumeUpload } from '../../../components/ResumeUpload';

export default function UploadCandidate() {
  const router = useRouter();

  const handleUploadSuccess = (candidate: any) => {
    // Redirect to the newly created candidate's detail page
    router.push(`/candidates/${candidate.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header back button */}
      <div>
        <Link
          href="/candidates"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-accent transition-colors"
        >
          <IconChevronLeft size={16} />
          <span>Back to Candidates</span>
        </Link>
      </div>

      <div className="border-b border-subtle pb-6">
        <h1 className="text-xl font-medium tracking-tight text-text-primary">Upload Candidate Resume</h1>
        <p className="text-sm text-text-secondary mt-1">
          Upload a resume in PDF or DOCX format. The file is saved to storage and automatically analyzed by Gemini Flash 1.5 to build the profile.
        </p>
      </div>

      {/* Upload zone */}
      <div className="bg-surface-primary border border-subtle p-8 rounded-lg">
        <ResumeUpload onUploadSuccess={handleUploadSuccess} />
      </div>
    </div>
  );
}
