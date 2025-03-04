import React from 'react';
import { MessageSquare } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="glass-effect border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-gray-800 dark:text-gray-200" />
          <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400">
            Tweetique
          </span>
        </div>
        
        <div className="glass-button rounded-full px-4 py-1.5 text-sm font-medium">
          Welcome, Guest
        </div>
      </div>
    </header>
  );
};

export default Header;