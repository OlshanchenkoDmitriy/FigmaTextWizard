import React from 'react';
import { FEATURES } from './constants';

export function FeatureGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {FEATURES.map((feature, index) => (
        <div key={index} className="flex items-start gap-3">
          <div className="p-2 rounded-lg" style={{ backgroundColor: '#3A6BF0' }}>
            <feature.icon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-medium mb-1" style={{ color: '#E8EAED' }}>
              {feature.title}
            </h3>
            <p className="text-sm" style={{ color: '#9CA3AF' }}>
              {feature.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}