import React from 'react';
import ContentLoader from 'react-content-loader';

export function WelcomeHeaderSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-start">
          <div>
            <ContentLoader
              height={40}
              width={200}
              viewBox="0 0 200 40"
              className="w-full"
              backgroundColor="#f0f0f0"
              foregroundColor="#e0e0e0"
            >
              <rect x="0" y="0" rx="4" ry="4" width="140" height="20" />
              <rect x="0" y="25" rx="3" ry="3" width="100" height="15" />
            </ContentLoader>
          </div>
          <div className="p-2 bg-gray-200 rounded-full w-10 h-10"></div>
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4)
          .fill(null)
          .map((_, index) => (
            <div key={index} className="bg-gray-200 rounded-xl p-4 border border-gray-100">
              <ContentLoader
                height={80}
                width={200}
                viewBox="0 0 200 80"
                className="w-full"
                backgroundColor="#f0f0f0"
                foregroundColor="#e0e0e0"
              >
                <rect x="0" y="0" rx="4" ry="4" width="50" height="50" />
                <rect x="60" y="5" rx="3" ry="3" width="120" height="15" />
                <rect x="60" y="30" rx="3" ry="3" width="80" height="15" />
              </ContentLoader>
            </div>
          ))}
      </div>

      {/* Courts Skeleton */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="mb-6">
          <ContentLoader
            height={20}
            width={200}
            viewBox="0 0 200 20"
            className="w-full"
            backgroundColor="#f0f0f0"
            foregroundColor="#e0e0e0"
          >
            <rect x="0" y="0" rx="3" ry="3" width="150" height="20" />
          </ContentLoader>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array(3)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className="relative bg-gray-200 rounded-lg overflow-hidden"
              >
                <ContentLoader
                  height={200}
                  width="100%"
                  viewBox="0 0 400 200"
                  className="w-full"
                  backgroundColor="#f0f0f0"
                  foregroundColor="#e0e0e0"
                >
                  <rect x="0" y="0" rx="4" ry="4" width="100%" height="140" />
                  <rect x="10" y="150" rx="3" ry="3" width="150" height="15" />
                  <rect x="10" y="170" rx="3" ry="3" width="100" height="15" />
                </ContentLoader>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
