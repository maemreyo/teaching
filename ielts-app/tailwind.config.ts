import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        highlight: 'rgb(var(--highlight) / <alpha-value>)',
        'highlight-foreground': 'rgb(var(--highlight-foreground) / <alpha-value>)',
        'highlight-positive': 'rgb(var(--highlight-positive) / <alpha-value>)',
        'highlight-positive-foreground': 'rgb(var(--highlight-positive-foreground) / <alpha-value>)',
        'highlight-negative': 'rgb(var(--highlight-negative) / <alpha-value>)',
        'highlight-negative-foreground': 'rgb(var(--highlight-negative-foreground) / <alpha-value>)',
        'highlight-neutral': 'rgb(var(--highlight-neutral) / <alpha-value>)',
        'highlight-neutral-foreground': 'rgb(var(--highlight-neutral-foreground) / <alpha-value>)',
      },
    },
  },
  plugins: [],
};

export default config;
