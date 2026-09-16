import React from 'react';
import {
  Trophy,
  MessageSquare,
  FolderArchive,
  Search,
  Timer,
  Users,
  Bell,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useStore } from '../../lib/store';
import { ActiveTab } from '../../types';

export const Header: React.FC = () => {
  const {
    selectedGroup,
    activeTab,
    setActiveTab,
    setIsTimerModalOpen,
    timerStatus,
    timerSeconds,
    timerTargetSeconds,
    timerMode,
  } = useStore();

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'discussions',
      label: 'Discussions',
      icon: <MessageSquare className="w-4 h-4" />,
    },
    {
      id: 'leaderboard',
      label: 'Focus Leaderboard',
      icon: <Trophy className="w-4 h-4" />,
    },
    {
      id: 'vault',
      label: 'Resource Vault',
      icon: <FolderArchive className="w-4 h-4" />,
    },
  ];

  const formatHeaderTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <header className="h-14 border-b border-[#222226] bg-[#09090B] px-4 flex items-center justify-between select-none flex-shrink-0 z-20">
      {/* Squad Meta */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold tracking-tight text-[#FAFAFA]">
              {selectedGroup.name}
            </h1>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#121215] border border-[#222226] text-[11px] font-mono text-[#71717A]">
              <Users className="w-3 h-3 text-[#71717A]" />
              <span>{selectedGroup.membersCount} members</span>
            </div>
          </div>
        </div>
      </div>

      {/* Level 3 Group Tabs */}
      <div className="flex items-center p-1 rounded-lg bg-[#121215] border border-[#222226]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#1C1C21] text-white border border-[#2E2E35] shadow-sm font-semibold'
                  : 'text-[#71717A] hover:text-[#FAFAFA] hover:bg-[#17171C]/60 border border-transparent'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Active Timer Quick Toggle Pill */}
        <button
          onClick={() => setIsTimerModalOpen(true)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono font-medium transition-all ${
            timerStatus === 'running'
              ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40 animate-pulse'
              : timerStatus === 'paused'
              ? 'bg-amber-950/40 text-amber-300 border-amber-800/40'
              : 'bg-[#121215] text-[#FAFAFA] border-[#222226] hover:border-[#2E2E35]'
          }`}
        >
          <Timer className="w-3.5 h-3.5 text-white" />
          <span>
            {timerStatus === 'running'
              ? formatHeaderTime(timerMode === 'pomodoro' ? timerTargetSeconds - timerSeconds : timerSeconds)
              : 'Timer'}
          </span>
        </button>
      </div>
    </header>
  );
};
