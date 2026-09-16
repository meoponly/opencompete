import React from 'react';

export const EmblemLogo: React.FC<{ size?: number; className?: string; showText?: boolean }> = ({
  size = 22,
  className = '',
  showText = true,
}) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div 
        className="relative flex items-center justify-center rounded-lg bg-surface-elevated border border-border text-foreground shadow-sm overflow-hidden"
        style={{ width: size + 10, height: size + 10 }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white"
        >
          {/* Geometric Emblem: Hourglass and Prism */}
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="text-sm font-semibold tracking-tight text-[#FAFAFA] leading-none flex items-center gap-1.5">
            OpenCompete
            <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/10 text-white font-mono border border-white/15">
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
