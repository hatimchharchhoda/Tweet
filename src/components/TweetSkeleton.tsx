import React from 'react';

const TweetSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse tweet-card">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800"></div>
        
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="mx-2 h-4 w-2 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
          </div>
          
          <div className="space-y-2 mb-3">
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-800 rounded"></div>
          </div>
          
          <div className="flex items-center">
            <div className="h-4 w-12 bg-gray-200 dark:bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TweetSkeletonList: React.FC = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <TweetSkeleton key={i} />
      ))}
    </div>
  );
};

export default TweetSkeleton;