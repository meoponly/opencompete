import React from 'react';
import { Plus, Settings, Users, Sparkles, LogIn } from 'lucide-react';
import { useStore } from '../../lib/store';
import { BrandLogo } from '../common/BrandLogo';
import { UserAvatar } from '../common/UserAvatar';

export const CommunitiesRail: React.FC<{
  onOpenCreateCommunity: () => void;
}> = ({ onOpenCreateCommunity }) => {
  const {
    communities,
    selectedCommunity,
    setSelectedCommunity,
    currentUser,
    setIsSettingsOpen,
    setIsAuthModalOpen,
  } = useStore();

  return (
    <div className="w-16 h-full bg-[#09090B] border-r border-[#222226] flex flex-col items-center justify-between py-3 select-none flex-shrink-0 z-30">
      {/* Top Brand Emblem */}
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="p-1 rounded-xl hover:bg-white/5 transition-colors cursor-pointer" title="OpenCompete">
          <BrandLogo size={28} showText={false} />
        </div>

        <div className="w-8 h-[1px] bg-[#222226]" />

        {/* Communities Avatar Icons List */}
        <div className="flex flex-col items-center gap-2.5 w-full px-2">
          {communities.map((comm) => {
            const isActive = selectedCommunity.id === comm.id;
            return (
              <button
                key={comm.id}
                onClick={() => setSelectedCommunity(comm)}
                title={comm.name}
                className={`relative group flex items-center justify-center transition-all ${
                  isActive ? 'scale-105' : 'hover:scale-105'
                }`}
              >
                {/* Active Left Indicator Bar */}
                {isActive && (
                  <span className="absolute -left-2 top-1.5 bottom-1.5 w-1 rounded-r-full bg-white animate-in fade-in" />
                )}

                <div
                  className={`w-10 h-10 rounded-2xl overflow-hidden flex items-center justify-center transition-all shadow-md ${
                    isActive
                      ? 'ring-2 ring-white border-transparent bg-white text-black font-bold'
                      : 'border border-[#222226] bg-[#121215] text-[#71717A] hover:text-white hover:border-[#2E2E35]'
                  }`}
                >
                  {comm.avatarUrl ? (
                    <img src={comm.avatarUrl} alt={comm.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-mono text-xs font-bold uppercase">
                      {comm.name.slice(0, 2)}
                    </span>
                  )}
                </div>
              </button>
            );
          })}

          {/* Add Community Button */}
          <button
            onClick={onOpenCreateCommunity}
            title="Create Community"
            className="w-10 h-10 rounded-2xl border border-dashed border-[#2E2E35] bg-[#121215]/50 text-[#71717A] hover:text-white hover:border-white/40 flex items-center justify-center transition-all mt-1"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom User Bar & Settings Icon (Gemini Style) */}
      <div className="flex flex-col items-center gap-3 w-full px-2">
        <button
          onClick={() => setIsSettingsOpen(true)}
          title="Settings & Theme"
          className="p-2 rounded-xl text-[#71717A] hover:text-white hover:bg-[#121215] transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>

        <div className="w-8 h-[1px] bg-[#222226]" />

        {currentUser ? (
          <button
            onClick={() => setIsSettingsOpen(true)}
            title={`${currentUser.fullName || currentUser.username} (Settings)`}
            className="transition-transform hover:scale-110 relative"
          >
            <UserAvatar user={currentUser} size="sm" showStatus />
          </button>
        ) : (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            title="Sign in with Google"
            className="w-8 h-8 rounded-full bg-[#121215] border border-[#222226] flex items-center justify-center text-white hover:bg-[#1C1C21]"
          >
            <LogIn className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
