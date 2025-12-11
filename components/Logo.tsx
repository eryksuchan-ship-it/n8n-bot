import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  return (
    <div 
      className={`${className} flex items-center justify-center bg-emerald-800 text-white font-semibold text-[8px] leading-none whitespace-nowrap lowercase select-none`}
      role="img"
      aria-label="Restore Assistant Logo"
    >
      restore
    </div>
  );
};
