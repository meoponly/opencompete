import React, { useState } from 'react';
import {
  Flame,
  Terminal,
  Activity,
  ChevronDown,
  Hash,
  Plus,
  Compass,
  Timer,
  Settings,
  LogIn,
} from 'lucide-react';
import { useStore } from '../../lib/store';
import { BrandLogo } from '../common/BrandLogo';
import { UserAvatar } from '../common/UserAvatar';

export const Sidebar: React.FC = () => {
  const {
    communities,
    selectedCommunity,
    setSelectedCommunity,
    groups,
    selectedGroup,
    setSelectedGroup,
    currentUser,
    setIsTimerModalOpen,
    setIsSettingsOpen,
    setIsAuthModalOpen,
    timerStatus,
  } = useStore();

  const [isCommunityDropdownOpen, setIsCommunityDropdownOpen] = useState(false);

  const getCommunityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame':
        return <Flame className="w-4 h-4 text-amber-400" />;
      case 'Terminal':
        return <Terminal className="w-4 h-4 text-emerald-400" />;
      case 'Activity':
        return <Activity className="w-4 h-4 text-rose-400" />;
      default:
        return <Compass className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <aside className="w-64 h-full flex flex-col bg-[#09090B] border-r border-[#222226] select-none flex-shrink-0">
      {/* Platform Branding using actual Logo */}
      <div className="p-4 border-b border-[#222226]">
        <BrandLogo size={22} />
      </div>

      {/* Level 1: Community Switcher */}
      <div className="p-3 border-b border-[#222226] relative">
        <label className="text-[10px] font-mono uppercase tracking-widest text-[#71717A] px-1 mb-1.5 block">
          Community Hub
        </label>
        <button
          onClick={() => setIsCommunityDropdownOpen(!isCommunityDropdownOpen)}
          className="w-full flex items-center justify-between p-2 rounded-lg bg-[#121215] border border-[#222226] hover:border-[#2E2E35] transition-all text-left group"
        >
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-6 h-6 rounded-md bg-[#1C1C21] border border-[#222226] flex items-center justify-center flex-shrink-0">
              {getCommunityIcon(selectedCommunity.iconName)}
            </div>
            <span className="text-xs font-medium text-[#FAFAFA] truncate">
              {selectedCommunity.name}
            </span>
          </div>
          <ChevronDown
            className={`w-3.5 h-3.5 text-[#71717A] group-hover:text-white transition-transform ${
              isCommunityDropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isCommunityDropdownOpen && (
          <div className="absolute top-full left-3 right-3 mt-1 bg-[#121215] border border-[#2E2E35] rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            {communities.map((comm) => (
              <button
                key={comm.id}
                onClick={() => {
                  setSelectedCommunity(comm);
                  setIsCommunityDropdownOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-left transition-colors text-xs ${
                  selectedCommunity.id === comm.id
                    ? 'bg-[#1C1C21] text-white font-medium border border-[#2E2E35]'
                    : 'text-[#71717A] hover:text-[#FAFAFA] hover:bg-[#17171C]'
                }`}
              >
                <div className="w-5 h-5 rounded bg-[#09090B] flex items-center justify-center">
                  {getCommunityIcon(comm.iconName)}
                </div>
                <div className="flex flex-col truncate">
                  <span className="truncate">{comm.name}</span>
                  <span className="text-[10px] text-[#71717A] truncate font-mono">
                    {comm.groupCount || 2} squads active
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Level 2: Squads / Cohorts List */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4 custom-scrollbar">
        <div>
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#71717A]">
              Study Squads ({groups.length})
            </span>
            <button
              title="Request New Squad"
              className="p-1 rounded text-[#71717A] hover:text-[#FAFAFA] hover:bg-[#121215] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1">
            {groups.map((grp) => {
              const isSelected = selectedGroup.id === grp.id;
              return (
                <button
                  key={grp.id}
                  onClick={() => setSelectedGroup(grp)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-all group ${
                    isSelected
                      ? 'bg-[#121215] text-[#FAFAFA] border border-[#222226] shadow-sm font-medium'
                      : 'text-[#71717A] hover:text-[#FAFAFA] hover:bg-[#121215]/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Hash
                      className={`w-3.5 h-3.5 flex-shrink-0 ${
                        isSelected ? 'text-white' : 'text-[#52525B] group-hover:text-[#71717A]'
                      }`}
                    />
                    <span className="text-xs truncate">{grp.name}</span>
                  </div>

                  {/* Active studying count */}
                  {grp.activeStudyingCount > 0 && (
                    <div className="flex items-center gap-1.5 flex-shrink-0 pl-1.5">
                      <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {grp.activeStudyingCount}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Focus Timer Launch Bar in Sidebar */}
        <div className="p-3 bg-[#121215] border border-[#222226] rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717A] flex items-center gap-1.5">
              <Timer className="w-3.5 h-3.5 text-white" />
              Focus Status
            </span>
            <span
              className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded border ${
                timerStatus === 'running'
                  ? 'bg-emerald-950/50 text-emerald-400 border-emerald-800/50'
                  : 'bg-white/5 text-[#71717A] border-[#222226]'
              }`}
            >
              {timerStatus === 'running' ? 'Active' : 'Offline'}
            </span>
          </div>

          <button
            onClick={() => setIsTimerModalOpen(true)}
            className="w-full py-2 px-3 rounded-lg bg-white text-black font-semibold text-xs flex items-center justify-center gap-2 hover:bg-neutral-200 transition-all shadow-sm"
          >
            <Timer className="w-3.5 h-3.5" />
            {timerStatus === 'running' ? 'Open Active Timer' : 'Launch Focus Session'}
          </button>
        </div>
      </div>

      {/* User Profile Card & Settings Bar at Bottom (Gemini Style) */}
      <div className="p-3 border-t border-[#222226] bg-[#09090B]">
        {currentUser ? (
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#121215] border border-[#222226] hover:border-[#2E2E35] transition-all">
            {/* Clickable user profile trigger */}
            <div
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-2.5 truncate flex-1 cursor-pointer group"
            >
              <UserAvatar user={currentUser} size="sm" showStatus />
              <div className="flex flex-col truncate">
                <span className="text-xs font-semibold text-[#FAFAFA] group-hover:text-white truncate">
                  {currentUser.fullName || currentUser.username}
                </span>
                <span className="text-[10px] font-mono text-[#71717A] truncate">
                  @{currentUser.username}
                </span>
              </div>
            </div>

            {/* Settings Cog Icon Button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              title="Open Settings"
              className="p-1.5 rounded-lg text-[#71717A] hover:text-[#FAFAFA] hover:bg-[#1C1C21] transition-colors flex-shrink-0"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full py-2 px-3 rounded-xl bg-[#121215] border border-[#222226] hover:border-white/40 text-white font-medium text-xs flex items-center justify-center gap-2 transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In / Register</span>
          </button>
        )}
      </div>
    </aside>
  );
};
