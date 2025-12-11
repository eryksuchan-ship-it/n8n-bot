import React from 'react';
import { Settings } from 'lucide-react';
import { Logo } from './Logo';

interface HeaderProps {
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  return (
    <header className="bg-purple-800 text-white shadow-lg z-10 flex-shrink-0 relative overflow-hidden">
      {/* Subtle background pattern/gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-purple-800/50 pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-4">
          <div className="bg-white/10 p-1.5 rounded-full backdrop-blur-md shadow-inner border border-white/10">
            <Logo className="w-10 h-10 rounded-full" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-white">Restore Assistant</h1>
            {/* Removed "Powered by n8n" as requested */}
          </div>
        </div>
        <button
          onClick={onOpenSettings}
          className="p-2.5 text-purple-200 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
