"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { PanelLeft, Columns, Grid, Minus, Equal, Plus } from 'lucide-react';

interface ReadingViewProps {
  children: React.ReactNode;
  title: string;
}

export function ReadingView({ children, title }: ReadingViewProps) {
  const [columnCount, setColumnCount] = useState(1);
  const [lineSpacing, setLineSpacing] = useState('leading-loose');

  const lineSpacings = [
    { name: 'Small', class: 'leading-normal', icon: <Minus size={20} /> },
    { name: 'Medium', class: 'leading-relaxed', icon: <Equal size={20} /> },
    { name: 'Large', class: 'leading-loose', icon: <Plus size={20} /> },
  ];

  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { className: cn(child.props.className, lineSpacing, 'mb-8') } as any);
    }
    return child;
  });

  return (
    <div>
      <div className="flex items-center justify-center space-x-4 p-4 bg-gray-100 rounded-lg mb-4">
        <div>
          <span className="font-semibold">Columns:</span>
          <div className="inline-flex rounded-md shadow-sm ml-2">
            <button onClick={() => setColumnCount(1)} className={`p-2 ${columnCount === 1 ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'} border border-gray-200 rounded-l-lg hover:bg-gray-50`}><PanelLeft size={20} /></button>
            <button onClick={() => setColumnCount(2)} className={`p-2 ${columnCount === 2 ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'} border-t border-b border-gray-200 hover:bg-gray-50`}><Columns size={20} /></button>
            <button onClick={() => setColumnCount(3)} className={`p-2 ${columnCount === 3 ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'} border border-gray-200 rounded-r-lg hover:bg-gray-50`}><Grid size={20} /></button>
          </div>
        </div>
        <div>
          <span className="font-semibold">Line Spacing:</span>
          <div className="inline-flex rounded-md shadow-sm ml-2">
            {lineSpacings.map((spacing, index) => (
              <button 
                key={spacing.name} 
                onClick={() => setLineSpacing(spacing.class)} 
                className={`p-2 ${lineSpacing === spacing.class ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'} border border-gray-200 ${index === 0 ? 'rounded-l-lg' : ''} ${index === lineSpacings.length - 1 ? 'rounded-r-lg' : 'border-r-0'} hover:bg-gray-50`}
              >
                {spacing.icon}
              </button>
            ))}
          </div>
        </div>
      </div>
      <h1 className="text-3xl font-bold text-center my-8">{title}</h1>
      <div 
        className={cn('prose lg:prose-2xl max-w-none')} 
        style={{ columnCount: columnCount, columnGap: '2rem' }}
      >
        {childrenWithProps}
      </div>
    </div>
  );
}
