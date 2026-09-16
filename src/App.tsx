import React, { useEffect } from 'react';
import { useStore } from './lib/store';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DiscussionsTab } from './components/discussions/DiscussionsTab';
import { LeaderboardTab } from './components/leaderboard/LeaderboardTab';
import { ResourceVaultTab } from './components/vault/ResourceVaultTab';
import { FocusTimerModal } from './components/focus/FocusTimerModal';
import { FocusTimerDock } from './components/focus/FocusTimerDock';

export const App: React.FC = () => {
  const { activeTab, setIsTimerModalOpen } = useStore();

  // Global keyboard shortcut to open focus timer (Cmd/Ctrl + K or Alt + T)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsTimerModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsTimerModalOpen]);

  return (
    <div className="flex h-screen w-screen bg-[#09090B] text-[#FAFAFA] overflow-hidden">
      {/* Level 1 & 2 Sidebar */}
      <Sidebar />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Header & Tabs */}
        <Header />

        {/* Tab Viewport */}
        <main className="flex-1 flex min-w-0 overflow-hidden relative">
          {activeTab === 'discussions' && <DiscussionsTab />}
          {activeTab === 'leaderboard' && <LeaderboardTab />}
          {activeTab === 'vault' && <ResourceVaultTab />}
        </main>
      </div>

      {/* Floating Focus Timer Engine Modal & Dock */}
      <FocusTimerModal />
      <FocusTimerDock />
    </div>
  );
};
