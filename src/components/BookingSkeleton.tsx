import React from 'react';
import ContentLoader from 'react-content-loader';

export const BookingSkeleton: React.FC = () => (
  <ContentLoader
    speed={2}
    width={600}
    height={300}
    viewBox="0 0 600 300"
    backgroundColor="#f3f4f6"
    foregroundColor="#e5e7eb"
    className="w-full h-full"
  >
    <rect x="24" y="24" rx="4" ry="4" width="200" height="24" />
    <rect x="24" y="60" rx="12" ry="12" width="100" height="24" />
    
    <rect x="500" y="24" rx="4" ry="4" width="32" height="32" />
    <rect x="544" y="24" rx="4" ry="4" width="32" height="32" />
    
    <rect x="24" y="120" rx="4" ry="4" width="300" height="20" />
    
    <rect x="24" y="160" rx="4" ry="4" width="400" height="16" />
    <rect x="24" y="188" rx="4" ry="4" width="200" height="16" />
    
    <rect x="24" y="240" rx="6" ry="6" width="260" height="40" />
    <rect x="300" y="240" rx="6" ry="6" width="120" height="40" />
  </ContentLoader>
);

export const BookingsGridSkeleton: React.FC = () => (
  <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
    {[1, 2, 3, 4].map((key) => (
      <div key={key} className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <BookingSkeleton />
      </div>
    ))}
  </div>
);