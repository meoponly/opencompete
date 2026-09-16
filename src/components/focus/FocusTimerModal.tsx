import React, { useState } from 'react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Volume2,
  VolumeX,
  X,
  Flame,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useStore } from '../../lib/store';
import { CategoryType } from '../../types';

export const FocusTimerModal: React.FC = () => {
  const {
    isTimerModalOpen,
    setIsTimerModalOpen,
    timerMode,
    setTimerMode,
    timerStatus,
    timerSeconds,
    timerTargetSeconds,
    setTimerTargetSeconds,
    timerTaskTitle,
    setTimerTaskTitle,
    timerCategory,
    setTimerCategory,
    isSoundEnabled,
    setIsSoundEnabled,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    completeTimerSession,
    currentUser,
    selectedGroup,
  } = useStore();

  if (!isTimerModalOpen) return null;

  const categories: CategoryType[] = ['Theory', 'Practice', 'Revision', 'Deep Work', 'Lecture', 'Problem Solving'];
  const pomodoroPresets = [
    { label: '25m', sec: 25 * 60 },
    { label: '45m', sec: 45 * 60 },
    { label: '60m', sec: 60 * 60 },
    { label: '90m', sec: 90 * 60 },
  ];

  // Format mm:ss or hh:mm:ss
  const formatTime = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent =
    timerMode === 'pomodoro'
      ? Math.min(100, Math.round((timerSeconds / timerTargetSeconds) * 100))
      : 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#121215] border border-[#222226] rounded-xl shadow-2xl p-6 overflow-hidden">
        {/* Subtle Background Glow Accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#222226]">
          <div className="flex items-center gap-2">
            <Timer className="w-5 h-5 text-white" />
            <h2 className="text-base font-semibold tracking-tight text-[#FAFAFA]">Focus Engine</h2>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/10 text-[#FAFAFA] border border-white/15">
              Live Sync
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsSoundEnabled(!isSoundEnabled)}
              title={isSoundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
              className="p-1.5 rounded-lg text-[#71717A] hover:text-[#FAFAFA] hover:bg-[#1C1C21] transition-colors"
            >
              {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsTimerModalOpen(false)}
              className="p-1.5 rounded-lg text-[#71717A] hover:text-[#FAFAFA] hover:bg-[#1C1C21] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-2 gap-1.5 p-1 my-5 bg-[#09090B] border border-[#222226] rounded-lg">
          <button
            onClick={() => {
              if (timerStatus === 'idle') setTimerMode('pomodoro');
            }}
            disabled={timerStatus !== 'idle'}
            className={`py-1.5 text-xs font-mono font-medium rounded-md transition-all flex items-center justify-center gap-1.5 ${
              timerMode === 'pomodoro'
                ? 'bg-[#1C1C21] text-white border border-[#2E2E35] shadow-sm'
                : 'text-[#71717A] hover:text-[#FAFAFA]'
            } ${timerStatus !== 'idle' ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <Layers className="w-3.5 h-3.5" />
            Pomodoro Interval
          </button>
          <button
            onClick={() => {
              if (timerStatus === 'idle') setTimerMode('stopwatch');
            }}
            disabled={timerStatus !== 'idle'}
            className={`py-1.5 text-xs font-mono font-medium rounded-md transition-all flex items-center justify-center gap-1.5 ${
              timerMode === 'stopwatch'
                ? 'bg-[#1C1C21] text-white border border-[#2E2E35] shadow-sm'
                : 'text-[#71717A] hover:text-[#FAFAFA]'
            } ${timerStatus !== 'idle' ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <Zap className="w-3.5 h-3.5" />
            Open Stopwatch
          </button>
        </div>

        {/* Timer Digital Display */}
        <div className="flex flex-col items-center justify-center py-6 my-2 rounded-xl bg-[#09090B] border border-[#222226] relative">
          {/* Circular SVG Ring for Pomodoro */}
          {timerMode === 'pomodoro' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <svg className="w-44 h-44 -rotate-90 transform" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  className="stroke-[#222226]"
                  strokeWidth="3"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  className="stroke-white transition-all duration-1000"
                  strokeWidth="3"
                  strokeDasharray="282.7"
                  strokeDashoffset={282.7 - (282.7 * progressPercent) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
            </div>
          )}

          <span className="text-5xl md:text-6xl font-mono font-bold tracking-tight text-[#FAFAFA] tabular-nums">
            {formatTime(timerMode === 'pomodoro' ? timerTargetSeconds - timerSeconds : timerSeconds)}
          </span>

          <div className="flex items-center gap-2 mt-3">
            <span
              className={`w-2 h-2 rounded-full ${
                timerStatus === 'running'
                  ? 'bg-emerald-400 animate-pulse'
                  : timerStatus === 'paused'
                  ? 'bg-amber-400'
                  : 'bg-[#71717A]'
              }`}
            />
            <span className="text-xs font-mono uppercase tracking-widest text-[#71717A]">
              {timerStatus === 'running'
                ? 'Session Live'
                : timerStatus === 'paused'
                ? 'Session Paused'
                : 'Ready to Grind'}
            </span>
          </div>
        </div>

        {/* Pomodoro Presets */}
        {timerMode === 'pomodoro' && timerStatus === 'idle' && (
          <div className="grid grid-cols-4 gap-2 mb-4">
            {pomodoroPresets.map((preset) => (
              <button
                key={preset.sec}
                onClick={() => setTimerTargetSeconds(preset.sec)}
                className={`py-1 text-xs font-mono rounded border transition-all ${
                  timerTargetSeconds === preset.sec
                    ? 'bg-white text-black border-white font-semibold'
                    : 'bg-[#17171C] text-[#71717A] border-[#222226] hover:text-[#FAFAFA] hover:border-[#2E2E35]'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        )}

        {/* Task Title & Category Inputs */}
        <div className="space-y-3 mb-6">
          <div>
            <label className="block text-[11px] uppercase font-mono tracking-wider text-[#71717A] mb-1.5">
              Task Objective
            </label>
            <input
              type="text"
              value={timerTaskTitle}
              onChange={(e) => setTimerTaskTitle(e.target.value)}
              placeholder="e.g. Pathfinder Rotational Dynamics Problems 10-25"
              className="w-full px-3 py-2 text-xs bg-[#09090B] border border-[#222226] focus:border-white/40 rounded-lg text-[#FAFAFA] placeholder:text-[#52525B] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase font-mono tracking-wider text-[#71717A] mb-1.5">
              Category Tag
            </label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setTimerCategory(cat)}
                  className={`text-[11px] font-mono px-2.5 py-1 rounded-md border transition-all ${
                    timerCategory === cat
                      ? 'bg-white/15 text-white border-white/40 font-medium'
                      : 'bg-[#09090B] text-[#71717A] border-[#222226] hover:text-[#FAFAFA] hover:border-[#2E2E35]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Timer Control Buttons */}
        <div className="flex items-center gap-2">
          {timerStatus === 'idle' ? (
            <button
              onClick={startTimer}
              className="flex-1 py-2.5 px-4 rounded-lg bg-white text-black font-semibold text-xs flex items-center justify-center gap-2 hover:bg-neutral-200 active:scale-[0.99] transition-all shadow-lg"
            >
              <Play className="w-4 h-4 fill-current" />
              Start Focus Session
            </button>
          ) : timerStatus === 'running' ? (
            <>
              <button
                onClick={pauseTimer}
                className="flex-1 py-2.5 px-4 rounded-lg bg-[#1C1C21] text-[#FAFAFA] border border-[#2E2E35] font-medium text-xs flex items-center justify-center gap-2 hover:bg-[#25252B] transition-all"
              >
                <Pause className="w-4 h-4" />
                Pause
              </button>
              <button
                onClick={completeTimerSession}
                className="flex-1 py-2.5 px-4 rounded-lg bg-white text-black font-semibold text-xs flex items-center justify-center gap-2 hover:bg-neutral-200 transition-all shadow-lg"
              >
                <CheckCircle2 className="w-4 h-4" />
                Complete & Broadcast
              </button>
            </>
          ) : (
            <>
              <button
                onClick={resumeTimer}
                className="flex-1 py-2.5 px-4 rounded-lg bg-white text-black font-semibold text-xs flex items-center justify-center gap-2 hover:bg-neutral-200 transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                Resume
              </button>
              <button
                onClick={completeTimerSession}
                className="flex-1 py-2.5 px-4 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-emerald-500/30 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                Log Early
              </button>
              <button
                onClick={resetTimer}
                className="p-2.5 rounded-lg bg-[#1C1C21] text-[#71717A] border border-[#222226] hover:text-white transition-colors"
                title="Discard Session"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Broadcast Guarantee Notice */}
        <div className="mt-4 pt-3 border-t border-[#222226] flex items-center justify-between text-[11px] text-[#71717A]">
          <div className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Current Streak: {currentUser?.streakDays || 0} Days</span>
          </div>
          <span className="font-mono text-[10px]">Squad: {selectedGroup.name.slice(0, 20)}...</span>
        </div>
      </div>
    </div>
  );
};
