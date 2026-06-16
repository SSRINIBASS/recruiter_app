'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  IconLayoutDashboard, 
  IconUsers, 
  IconBriefcase, 
  IconUpload, 
  IconSparkles,
  IconSun,
  IconMoon
} from '@tabler/icons-react';

type NavItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: IconLayoutDashboard },
  { name: 'Candidates', href: '/candidates', icon: IconUsers },
  { name: 'Upload Resume', href: '/candidates/upload', icon: IconUpload },
  { name: 'Job Descriptions', href: '/jobs', icon: IconBriefcase },
];

export function Sidebar() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <aside className="w-64 bg-surface-secondary border-r border-subtle h-screen flex flex-col fixed left-0 top-0">
      {/* Brand logo section */}
      <div className="h-16 flex items-center px-6 border-b border-subtle gap-3">
        <div className="w-8 h-8 bg-accent rounded-md flex items-center justify-center text-white">
          <IconSparkles size={18} />
        </div>
        <span className="font-medium text-lg tracking-tight text-accent-text">TalentIQ</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <div className="px-3 mb-2 text-xs font-medium text-text-secondary uppercase tracking-wider">
          Recruitment
        </div>
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 text-base rounded-md font-medium transition-colors ${
                isActive
                  ? 'bg-accent-light text-accent-text'
                  : 'text-text-secondary hover:bg-accent-light/30 hover:text-text-primary'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom info section */}
      <div className="p-4 border-t border-subtle bg-surface-secondary/50 space-y-4">
        {/* Day / Night Theme Toggle Switch */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-md border border-subtle hover:bg-accent-light/10 hover:text-accent-text transition-colors text-text-secondary text-sm font-medium"
        >
          <span className="flex items-center gap-2">
            {theme === 'dark' ? (
              <>
                <IconMoon size={16} className="text-accent" />
                <span>Night Mode</span>
              </>
            ) : (
              <>
                <IconSun size={16} className="text-amber-500" />
                <span>Day Mode</span>
              </>
            )}
          </span>
          <span className="text-[10px] uppercase font-bold text-text-secondary border border-subtle px-1.5 py-0.5 rounded bg-surface-primary">
            Toggle
          </span>
        </button>

        <div className="text-xs text-text-secondary text-center font-medium">
          Demo Job Recruitment App
        </div>
      </div>
    </aside>
  );
}
