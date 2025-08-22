import React from 'react';
import { TECHNOLOGIES } from './constants';

export function TechStack() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {TECHNOLOGIES.map((tech, index) => (
        <div key={index} className="flex items-center justify-between">
          <div>
            <div className="font-medium" style={{ color: '#E8EAED' }}>{tech.name}</div>
            <div className="text-sm" style={{ color: '#9CA3AF' }}>{tech.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
}