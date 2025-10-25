"use client";

import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { PanelLeft, Columns, Grid, Minus, Equal, Plus, Sun, Moon, BookOpen } from 'lucide-react';
import { ReadingProgressBar } from './reading-progress-bar';
import useLocalStorage from '@/hooks/use-local-storage';

interface ReadingViewProps {
  children: React.ReactNode;
  title: string;
  readingTime: number;
}

export function ReadingView({ children, title, readingTime }: ReadingViewProps) {
  const [columnCount, setColumnCount] = useLocalStorage('reading-columnCount', 1);
  const [lineSpacing, setLineSpacing] = useLocalStorage('reading-lineSpacing', 'leading-loose');
  const [fontSize, setFontSize] = useLocalStorage('reading-fontSize', 24);
  const [fontFamily, setFontFamily] = useLocalStorage('reading-fontFamily', 'font-sans');
  const [theme, setTheme] = useLocalStorage('reading-theme', 'light');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark');
    root.removeAttribute('data-theme');

    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'sepia') {
      root.setAttribute('data-theme', 'sepia');
    }
  }, [theme]);

  const lineSpacings = [
    { name: 'Small', class: 'leading-normal', icon: <Minus size={20} /> },
    { name: 'Medium', class: 'leading-relaxed', icon: <Equal size={20} /> },
    { name: 'Large', class: 'leading-loose', icon: <Plus size={20} /> },
  ];

  const fontFamilies = [
    { name: 'Sans', class: 'font-sans' },
    { name: 'Serif', class: 'font-serif' },
    { name: 'Mono', class: 'font-mono' },
  ];

  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { 
        className: cn(child.props.className, lineSpacing, fontFamily),
        style: { fontSize: `${fontSize}px` }
      } as any);
    }
    return child;
  });

  return (
    <div className="bg-background text-foreground min-h-screen">
      <ReadingProgressBar />
      <div className="p-4 bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b">
        <div className="flex items-center justify-center space-x-2 md:space-x-4">
          {/* Theme Controls */}
          <div className="flex items-center space-x-1">
            <button onClick={() => setTheme('light')} className={`p-2 rounded-md ${theme === 'light' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}><Sun size={20}/></button>
            <button onClick={() => setTheme('sepia')} className={`p-2 rounded-md ${theme === 'sepia' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}><BookOpen size={20}/></button>
            <button onClick={() => setTheme('dark')} className={`p-2 rounded-md ${theme === 'dark' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}><Moon size={20}/></button>
          </div>

          {/* Font Family Controls */}
          <div>
            <div className="inline-flex rounded-md shadow-sm">
              {fontFamilies.map((font, index) => (
                <button 
                  key={font.name} 
                  onClick={() => setFontFamily(font.class)} 
                  className={`px-3 py-2 text-sm ${fontFamily === font.class ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground'} border ${index === 0 ? 'rounded-l-lg' : ''} ${index === fontFamilies.length - 1 ? 'rounded-r-lg' : 'border-l-0'} hover:bg-muted`}
                >
                  {font.name}
                </button>
              ))}
            </div>
          </div>

          {/* Font Size Controls */}
          <div className="flex items-center space-x-2">
            <span className="text-sm">A-</span>
            <input type="range" min="16" max="40" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-24" />
            <span className="text-lg">A+</span>
          </div>

          {/* Column Controls */}
          <div className="hidden md:flex items-center space-x-1">
            <button onClick={() => setColumnCount(1)} className={`p-2 rounded-md ${columnCount === 1 ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}><PanelLeft size={20} /></button>
            <button onClick={() => setColumnCount(2)} className={`p-2 rounded-md ${columnCount === 2 ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}><Columns size={20} /></button>
            <button onClick={() => setColumnCount(3)} className={`p-2 rounded-md ${columnCount === 3 ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}><Grid size={20} /></button>
          </div>

          {/* Line Spacing Controls */}
          <div className="hidden md:flex items-center space-x-1">
            {lineSpacings.map((spacing) => (
                <button 
                  key={spacing.name} 
                  onClick={() => setLineSpacing(spacing.class)} 
                  className={`p-2 rounded-md ${lineSpacing === spacing.class ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                >
                  {spacing.icon}
                </button>
              ))}
          </div>
        </div>
      </div>
      
      <div className="container mx-auto p-4 md:p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">{title}</h1>
          <p className="text-sm text-muted-foreground">{readingTime} min read</p>
        </div>
        <div 
          className={cn('max-w-none')} 
          style={{ columnCount: columnCount, columnGap: '2.5rem' }}
        >
          {childrenWithProps}
        </div>
      </div>
    </div>
  );
}
