import React from 'react';
import { User } from '../../types';

interface UserAvatarProps {
  user?: Partial<User>;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showStatus?: boolean;
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  size = 'md',
  showStatus = true,
  className = '',
}) => {
  const sizeClasses = {
    xs: 'w-5 h-5 text-[9px]',
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-xs',
    lg: 'w-11 h-11 text-sm',
    xl: 'w-14 h-14 text-base',
  };

  const statusDotSizes = {
    xs: 'w-1.5 h-1.5 bottom-0 right-0',
    sm: 'w-2 h-2 bottom-0 right-0',
    md: 'w-2.5 h-2.5 bottom-0 right-0',
    lg: 'w-3 h-3 bottom-0.5 right-0.5',
    xl: 'w-3.5 h-3.5 bottom-0.5 right-0.5',
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const isStudying = user?.isStudying;
  const isOnline = user?.isOnline;

  return (
    <div className={`relative inline-flex flex-shrink-0 ${className}`}>
      {user?.avatarUrl ? (
        <img
          src={user.avatarUrl}
          alt={user.fullName || 'User'}
          className={`${sizeClasses[size]} rounded-full object-cover border border-[#222226] bg-[#121215]`}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} rounded-full bg-[#17171C] border border-[#222226] flex items-center justify-center font-mono font-medium text-[#FAFAFA]`}
        >
          {getInitials(user?.fullName || user?.username)}
        </div>
      )}

      {showStatus && (
        <>
          {isStudying ? (
            <span
              title="Currently in active study session"
              className={`absolute ${statusDotSizes[size]} rounded-full bg-emerald-400 ring-2 ring-[#09090B] animate-pulse`}
            />
          ) : isOnline ? (
            <span
              title="Online"
              className={`absolute ${statusDotSizes[size]} rounded-full bg-[#71717A] ring-2 ring-[#09090B]`}
            />
          ) : null}
        </>
      )}
    </div>
  );
};
