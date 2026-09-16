import React from 'react';
import {
  Trophy,
  Flame,
  Clock,
  Zap,
  TrendingUp,
  Medal,
  Crown,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { useStore } from '../../lib/store';
import { UserAvatar } from '../common/UserAvatar';
import { TagBadge } from '../common/TagBadge';
import { TimeframeFilter } from '../../types';

export const LeaderboardTab: React.FC = () => {
  const {
    timeframe,
    setTimeframe,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    leaderboardEntries,
    currentUser,
    selectedGroup,
    setIsTimerModalOpen,
  } = useStore();

  const timeframes: { id: TimeframeFilter; label: string }[] = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'all-time', label: 'All-Time' },
  ];

  const categories = ['All', 'Theory', 'Practice', 'Revision', 'Deep Work'];

  const formatHoursMinutes = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    if (hours === 0 && mins === 0) return '0m';
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const top3 = leaderboardEntries.slice(0, 3);
  const remaining = leaderboardEntries.slice(3);

  const currentUserEntry = leaderboardEntries.find((e) => e.user.id === currentUser.id);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#09090B] space-y-6 custom-scrollbar">
      {/* Top Banner & Timeframe Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#222226]">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-white" />
            <h2 className="text-base font-semibold tracking-tight text-[#FAFAFA]">
              Verified Focus Rankings
            </h2>
          </div>
          <p className="text-xs text-[#71717A] mt-0.5">
            Rankings computed from verified stopwatch and pomodoro logs in #{selectedGroup.name}.
          </p>
        </div>

        {/* Timeframe Filter Pills */}
        <div className="flex items-center p-1 rounded-lg bg-[#121215] border border-[#222226]">
          {timeframes.map((tf) => (
            <button
              key={tf.id}
              onClick={() => setTimeframe(tf.id)}
              className={`px-3 py-1 text-xs font-mono rounded-md transition-all ${
                timeframe === tf.id
                  ? 'bg-[#1C1C21] text-white border border-[#2E2E35] font-semibold shadow-sm'
                  : 'text-[#71717A] hover:text-[#FAFAFA]'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="w-3.5 h-3.5 text-[#52525B] flex-shrink-0" />
        <span className="text-[11px] font-mono text-[#71717A] uppercase mr-1 flex-shrink-0">
          Filter:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategoryFilter(cat)}
            className={`text-xs font-mono px-2.5 py-1 rounded-md border transition-all flex-shrink-0 ${
              selectedCategoryFilter === cat
                ? 'bg-white/15 text-white border-white/40 font-medium'
                : 'bg-[#121215] text-[#71717A] border-[#222226] hover:text-[#FAFAFA] hover:border-[#2E2E35]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Podium Display (Top 3) */}
      {top3.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {/* #2 Silver */}
          {top3[1] && (
            <div className="p-4 rounded-xl bg-[#121215] border border-[#222226] flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-[#2E2E35] transition-all order-2 md:order-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#71717A] mb-2 flex items-center gap-1">
                <Medal className="w-3.5 h-3.5 text-zinc-400" /> Rank #2
              </span>
              <UserAvatar user={top3[1].user} size="lg" showStatus />
              <h3 className="text-xs font-bold text-[#FAFAFA] mt-2 truncate max-w-full">
                {top3[1].user.fullName}
              </h3>
              <span className="text-[11px] font-mono text-[#71717A]">
                @{top3[1].user.username}
              </span>

              <div className="mt-3 px-3 py-1 rounded-md bg-[#09090B] border border-[#222226] font-mono font-bold text-sm text-white">
                {formatHoursMinutes(top3[1].totalDurationSec)}
              </div>

              <div className="flex items-center gap-1.5 mt-2 text-[11px] font-mono text-amber-400">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>{top3[1].streakDays}d Streak</span>
              </div>
            </div>
          )}

          {/* #1 Gold / Champion */}
          {top3[0] && (
            <div className="p-5 rounded-xl bg-gradient-to-b from-[#17171C] to-[#121215] border border-white/20 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl order-1 md:order-2">
              <div className="absolute top-2 right-2">
                <Crown className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 mb-2 flex items-center gap-1 font-semibold">
                👑 Champion (#1)
              </span>
              <UserAvatar user={top3[0].user} size="xl" showStatus />
              <h3 className="text-sm font-bold text-white mt-2 truncate max-w-full">
                {top3[0].user.fullName}
              </h3>
              <span className="text-[11px] font-mono text-[#71717A]">
                @{top3[0].user.username}
              </span>

              <div className="mt-3 px-4 py-1.5 rounded-lg bg-[#09090B] border border-white/20 font-mono font-extrabold text-base text-white shadow-inner">
                {formatHoursMinutes(top3[0].totalDurationSec)}
              </div>

              <div className="flex items-center gap-1.5 mt-2.5 text-xs font-mono text-amber-400 font-semibold">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>{top3[0].streakDays}d Continuous Streak</span>
              </div>

              {top3[0].isStudying && (
                <div className="mt-2 text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Currently studying
                </div>
              )}
            </div>
          )}

          {/* #3 Bronze */}
          {top3[2] && (
            <div className="p-4 rounded-xl bg-[#121215] border border-[#222226] flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-[#2E2E35] transition-all order-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#71717A] mb-2 flex items-center gap-1">
                <Medal className="w-3.5 h-3.5 text-amber-600" /> Rank #3
              </span>
              <UserAvatar user={top3[2].user} size="lg" showStatus />
              <h3 className="text-xs font-bold text-[#FAFAFA] mt-2 truncate max-w-full">
                {top3[2].user.fullName}
              </h3>
              <span className="text-[11px] font-mono text-[#71717A]">
                @{top3[2].user.username}
              </span>

              <div className="mt-3 px-3 py-1 rounded-md bg-[#09090B] border border-[#222226] font-mono font-bold text-sm text-white">
                {formatHoursMinutes(top3[2].totalDurationSec)}
              </div>

              <div className="flex items-center gap-1.5 mt-2 text-[11px] font-mono text-amber-400">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>{top3[2].streakDays}d Streak</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="bg-[#121215] border border-[#222226] rounded-xl overflow-hidden shadow-lg">
        <div className="p-3 bg-[#09090B] border-b border-[#222226] flex items-center justify-between text-[11px] font-mono uppercase text-[#71717A]">
          <div className="flex items-center gap-4">
            <span className="w-8 text-center">Rank</span>
            <span>Academic Peer</span>
          </div>
          <div className="flex items-center gap-8 pr-4">
            <span className="hidden sm:inline">Streak</span>
            <span className="w-20 text-right">Time Logged</span>
          </div>
        </div>

        <div className="divide-y divide-[#222226]">
          {leaderboardEntries.map((entry) => {
            const isMe = entry.user.id === currentUser.id;
            return (
              <div
                key={entry.user.id}
                className={`flex items-center justify-between p-3 transition-colors ${
                  isMe ? 'bg-white/5 font-semibold' : 'hover:bg-[#17171C]/50'
                }`}
              >
                {/* Left: Rank & User */}
                <div className="flex items-center gap-3">
                  <div className="w-8 flex items-center justify-center font-mono text-xs font-bold">
                    {entry.rank === 1 ? (
                      <span className="text-amber-400">#1</span>
                    ) : entry.rank === 2 ? (
                      <span className="text-zinc-300">#2</span>
                    ) : entry.rank === 3 ? (
                      <span className="text-amber-600">#3</span>
                    ) : (
                      <span className="text-[#71717A]">#{entry.rank}</span>
                    )}
                  </div>

                  <UserAvatar user={entry.user} size="sm" showStatus />

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#FAFAFA] truncate">
                        {entry.user.fullName}
                      </span>
                      {isMe && (
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-white text-black font-bold">
                          YOU
                        </span>
                      )}
                      {entry.isStudying && (
                        <span className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Studying
                        </span>
                      )}
                    </div>
                    {entry.currentTask && entry.isStudying && (
                      <span className="text-[10px] text-[#71717A] truncate max-w-xs font-mono">
                        {entry.currentTask}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Stats */}
                <div className="flex items-center gap-8 pr-4">
                  <div className="hidden sm:flex items-center gap-1 text-xs font-mono text-amber-400">
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    <span>{entry.streakDays}d</span>
                  </div>

                  <div className="w-20 text-right font-mono font-bold text-xs text-white">
                    {formatHoursMinutes(entry.totalDurationSec)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Action / Motivate */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#121215] to-[#17171C] border border-[#222226] flex items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold text-white">Ready to climb the squad ranks?</h4>
          <p className="text-[11px] text-[#71717A] mt-0.5">
            Every session tracked with the stopwatch or pomodoro counts towards verified hours.
          </p>
        </div>
        <button
          onClick={() => setIsTimerModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-white text-black font-semibold text-xs flex items-center gap-2 hover:bg-neutral-200 transition-all shadow-md flex-shrink-0"
        >
          <Clock className="w-3.5 h-3.5" />
          Log Focus Session
        </button>
      </div>
    </div>
  );
};
