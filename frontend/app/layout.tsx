import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Sidebar } from '../components/Sidebar';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'TalentIQ — AI Recruitment & Candidate Matching Platform',
  description: 'Upload candidate resumes, parse structured data using Gemini Flash 1.5, define job descriptions, and execute ranked matching algorithms.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                } else {
                  document.documentElement.classList.add('light');
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full flex bg-surface-primary text-text-primary`}
      >
        {/* Left Side Navigation */}
        <Sidebar />

        {/* Right Side Main Content */}
        <main className="flex-1 ml-64 min-h-screen bg-surface-primary flex flex-col">
          <div className="flex-1 p-8 max-w-7xl w-full mx-auto">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
