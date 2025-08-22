import React from 'react';
import { TOOLS } from './constants';

export function ToolsList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {TOOLS.map((tool, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#3A6BF0' }}></div>
          <span className="text-sm" style={{ color: '#E8EAED' }}>{tool}</span>
        </div>
      ))}
    </div>
  );
}