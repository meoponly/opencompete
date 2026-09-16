import React from 'react';

interface TagBadgeProps {
  category?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const TagBadge: React.FC<TagBadgeProps> = ({
  category = 'Deep Work',
  size = 'md',
  className = '',
}) => {
  const getStyle = (cat: string) => {
    switch (cat) {
      case 'Theory':
        return 'bg-blue-950/40 text-blue-300 border-blue-800/40';
      case 'Practice':
        return 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40';
      case 'Revision':
        return 'bg-amber-950/40 text-amber-300 border-amber-800/40';
      case 'Deep Work':
        return 'bg-purple-950/40 text-purple-300 border-purple-800/40';
      case 'Lecture':
        return 'bg-cyan-950/40 text-cyan-300 border-cyan-800/40';
      default:
        return 'bg-white/5 text-zinc-300 border-white/10';
    }
  };

  const sizeClass = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5';

  return (
    <span
      className={`inline-flex items-center font-mono font-medium rounded border ${getStyle(
        category
      )} ${sizeClass} ${className}`}
    >
      {category}
    </span>
  );
};
