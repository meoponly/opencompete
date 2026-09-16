import React from 'react';
import { Play, Pause, Maximize2, Timer, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../lib/store';
import { TagBadge } from '../common/TagBadge';

export const FocusTimerDock: React.FC = () => {
  const {
    timerStatus,
    timerSeconds,
    timerTargetSeconds,
    timerMode,
    timerTaskTitle,
    timerCategory,
    pauseTimer,
    resumeTimer,
    completeTimerSession,
    setIsTimerModalOpen,
  } = useStore();

  if (timerStatus === 'idle') return null;

  const formatTime = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const displayTime =
    timerMode === 'pomodoro' ? Math.max(0, timerTargetSeconds - timerSeconds) : timerSeconds;

  return (
    <div className="fixed bottom-5 right-6 z-40 flex items-center gap-3 px-4 py-2.5 bg-[#121215]/95 backdrop-blur-md border border-[#2E2E35] rounded-xl shadow-2xl shadow-black/80 animate-in slide-in-from-bottom-5 duration-300">
      {/* Live pulse dot */}
      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />

      {/* Task Info */}
      <div className="flex flex-col max-w-[200px] truncate">
        <span className="text-xs font-semibold text-[#FAFAFA] truncate">
          {timerTaskTitle || 'Focus Session'}
        </span>
        <div className="flex items-center gap-1.5 mt-0.5">
          <TagBadge category={timerCategory} size="sm" />
          <span className="text-[10px] font-mono text-[#71717A] uppercase">{timerMode}</span>
        </div>
      </div>

      {/* Digits */}
      <div className="px-2.5 py-1 rounded-md bg-[#09090B] border border-[#222226] font-mono font-bold text-sm text-[#FAFAFA] tabular-nums">
        {formatTime(displayTime)}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1 pl-1 border-l border-[#222226]">
        {timerStatus === 'running' ? (
          <button
            onClick={pauseTimer}
            title="Pause Timer"
            className="p-1.5 rounded-md hover:bg-[#1C1C21] text-[#71717A] hover:text-[#FAFAFA] transition-colors"
          >
            <Pause className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={resumeTimer}
            title="Resume Timer"
            className="p-1.5 rounded-md hover:bg-[#1C1C21] text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
          </button>
        )}

        <button
          onClick={completeTimerSession}
          title="Finish & Broadcast"
          className="p-1.5 rounded-md hover:bg-[#1C1C21] text-[#FAFAFA] hover:text-white transition-colors"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setIsTimerModalOpen(true)}
          title="Expand Focus Engine"
          className="p-1.5 rounded-md hover:bg-[#1C1C21] text-[#71717A] hover:text-[#FAFAFA] transition-colors"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
