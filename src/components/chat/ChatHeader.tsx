import React from 'react';
import {
  Users,
  Search,
  MoreVertical,
  BellOff,
  FolderArchive,
  Megaphone,
  ChevronLeft,
  Pin,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../lib/store';
import { UserAvatar } from '../common/UserAvatar';

export const ChatHeader: React.FC<{
  onToggleInfo: () => void;
  onBackMobile?: () => void;
}> = ({ onToggleInfo, onBackMobile }) => {
  const { selectedGroup, selectedCommunity, typingUsers, currentUser } = useStore();

  const isMuted = currentUser && selectedGroup.notificationSettings?.[currentUser.id]?.muted;

  return (
    <header className="h-14 border-b border-[#222226] bg-[#09090B] px-4 flex items-center justify-between select-none flex-shrink-0 z-20">
      {/* Left Group Profile */}
      <div className="flex items-center gap-3 min-w-0">
        {onBackMobile && (
          <button
            onClick={onBackMobile}
            className="md:hidden p-1.5 rounded-lg text-[#71717A] hover:text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        <div
          onClick={onToggleInfo}
          className="flex items-center gap-3 cursor-pointer group min-w-0"
        >
          <div className="relative">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-[#121215] border border-[#222226] flex items-center justify-center flex-shrink-0">
              {selectedGroup.avatarUrl ? (
                <img src={selectedGroup.avatarUrl} alt={selectedGroup.name} className="w-full h-full object-cover" />
              ) : selectedGroup.isAnnouncementGroup ? (
                <Megaphone className="w-4 h-4 text-amber-400" />
              ) : (
                <Users className="w-4 h-4 text-[#71717A]" />
              )}
            </div>
            {selectedGroup.isAnnouncementGroup && (
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-[#09090B] flex items-center justify-center text-[8px] font-bold text-black">
                📢
              </span>
            )}
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold text-[#FAFAFA] group-hover:text-white truncate">
                {selectedGroup.name}
              </h2>
              {isMuted && <BellOff className="w-3 h-3 text-amber-400 flex-shrink-0" />}
            </div>

            {typingUsers.length > 0 ? (
              <span className="text-[11px] font-mono text-emerald-400 animate-pulse truncate">
                {typingUsers.join(', ')} is typing...
              </span>
            ) : (
              <span className="text-[10px] text-[#71717A] group-hover:text-[#A1A1AA] truncate font-mono">
                {selectedGroup.isAnnouncementGroup
                  ? 'Announcement Channel • Read only'
                  : `click here for group info • ${selectedCommunity.name}`}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          onClick={onToggleInfo}
          title="Group Info & Shared Media"
          className="p-2 rounded-lg text-[#71717A] hover:text-[#FAFAFA] hover:bg-[#121215] transition-colors"
        >
          <FolderArchive className="w-4 h-4" />
        </button>
        <button
          onClick={onToggleInfo}
          title="Group Settings & Members"
          className="p-2 rounded-lg text-[#71717A] hover:text-[#FAFAFA] hover:bg-[#121215] transition-colors"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
