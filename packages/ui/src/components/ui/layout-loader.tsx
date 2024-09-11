import React from 'react';

import { Skeleton } from './skeleton'; // Assuming Material UI for skeleton loader

export const LayoutLoader = () => {
  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <div className="w-64 bg-gray-100 p-4">
        <div className="mb-4">
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="mb-2">
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="mb-2">
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="mb-2">
          <Skeleton className="h-6 w-40" />
        </div>
      </div>

      {/* Right Side Content Area */}
      <div className="flex-1 bg-white p-6">
        {/* Skeleton loading for the main content */}
        <Skeleton className="h-8 w-1/2 mb-6" />
        <Skeleton className="h-48 w-full mb-4" />
        <Skeleton className="h-6 w-3/4 mb-4" />
        <Skeleton className="h-6 w-3/4 mb-4" />
        <Skeleton className="h-6 w-3/4 mb-4" />
      </div>
    </div>
  );
};
