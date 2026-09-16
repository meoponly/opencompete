import React from 'react';

export const BrandLogo: React.FC<{ size?: number; className?: string; showText?: boolean }> = ({
  size = 28,
  className = '',
  showText = true,
}) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Crisp transparent logo without cheap solid container boxes */}
      <div 
        className="relative flex items-center justify-center flex-shrink-0 transition-transform duration-200 hover:scale-105"
        style={{ width: size, height: size }}
      >
        <img
          src="/logo-transparent.svg"
          alt="OpenCompete"
          className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]"
          onError={(e) => {
            // If svg fails, fallback to clean logo.png with screen blend
            const target = e.currentTarget;
            target.src = '/logo.png';
            target.style.mixBlendMode = 'screen';
          }}
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="text-sm font-semibold tracking-tight text-[#FAFAFA] dark:text-[#FAFAFA] leading-none flex items-center gap-1.5">
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
