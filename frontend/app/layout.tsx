import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google';
import { Sidebar } from '../components/Sidebar';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Eligo — AI Recruitment & Candidate Matching Platform',
  description: 'Upload candidate resumes, parse structured data using Gemini Flash 1.5, define job descriptions, and execute ranked matching algorithms.',
  icons: {
    icon: '/logo-icon.svg',
  },
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
        className={`${plusJakartaSans.variable} ${playfairDisplay.variable} antialiased h-full flex bg-surface-primary text-text-primary font-sans relative`}
      >
        {/* Ambient background glows */}
        <div className="ambient-glow-top" />
        <div className="ambient-glow-bottom" />

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
