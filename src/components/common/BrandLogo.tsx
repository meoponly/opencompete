import React from 'react';

export const BrandLogo: React.FC<{ size?: number; className?: string; showText?: boolean }> = ({
  size = 28,
  className = '',
  showText = true,
}) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div 
        className="relative flex items-center justify-center rounded-lg bg-[#121215] dark:bg-[#121215] border border-[#222226] shadow-sm overflow-hidden flex-shrink-0"
        style={{ width: size + 8, height: size + 8 }}
      >
        <img
          src="/logo.png"
          alt="OpenCompete Logo"
          className="w-full h-full object-contain p-1"
          onError={(e) => {
            // Fallback to geometric SVG if needed
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="text-sm font-semibold tracking-tight text-[#FAFAFA] dark:text-[#FAFAFA] light:text-[#09090B] leading-none flex items-center gap-1.5">
            OpenCompete
            <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/10 dark:bg-white/10 text-white font-mono border border-white/15">
              PRO
            </span>
          </span>
          <span className="text-[10px] font-mono text-[#71717A] tracking-wider uppercase mt-1">
            Built By Hours
          </span>
        </div>
      )}
    </div>
  );
};
