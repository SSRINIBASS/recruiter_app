import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: { DEFAULT: '#5B5BD6', light: '#EEEDFE', text: '#3C3489' },
        score: {
          high: { fill: '#E1F5EE', text: '#085041' },
          mid: { fill: '#FAEEDA', text: '#633806' },
          low: { fill: '#FCEBEB', text: '#791F1F' },
        },
        surface: { 
          primary: 'var(--color-surface-primary)', 
          secondary: 'var(--color-surface-secondary)' 
        },
        destructive: { fill: '#FCEBEB', text: '#791F1F' },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
        },
      },
      fontSize: {
        xs: ['11px', { lineHeight: '1.4' }],
        sm: ['13px', { lineHeight: '1.5' }],
        base: ['14px', { lineHeight: '1.6' }],
        lg: ['16px', { lineHeight: '1.5' }],
        xl: ['22px', { lineHeight: '1.3' }],
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      boxShadow: {
        premium: '0 4px 20px -2px rgba(91, 91, 214, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'premium-hover': '0 12px 28px -3px rgba(91, 91, 214, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.05)',
        glow: '0 0 20px 2px rgba(91, 91, 214, 0.2)',
      },
      borderRadius: {
        sm: '6px',
        md: '8px',
        lg: '10px',
      },
    },
  },
  plugins: [],
};
export default config;
