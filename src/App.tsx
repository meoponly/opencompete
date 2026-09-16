import React, { useState } from 'react';
import { useStore } from './lib/store';
import { CommunitiesRail } from './components/layout/CommunitiesRail';
import { ChatListPane } from './components/layout/ChatListPane';
import { MainChatPane } from './components/layout/MainChatPane';
import { CreateGroupModal } from './components/chat/CreateGroupModal';
import { CreateCommunityModal } from './components/chat/CreateCommunityModal';
import { AuthModal } from './components/auth/AuthModal';
import { OnboardingModal } from './components/auth/OnboardingModal';
import { SettingsModal } from './components/settings/SettingsModal';

export const App: React.FC = () => {
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [isCreateCommunityOpen, setIsCreateCommunityOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen bg-[#09090B] text-[#FAFAFA] overflow-hidden select-none font-sans">
      {/* 1. WhatsApp Communities Leftmost Rail (Top communities + Bottom Settings) */}
      <CommunitiesRail onOpenCreateCommunity={() => setIsCreateCommunityOpen(true)} />

      {/* 2. Middle Pane: Active Community & Sub-Groups List */}
      <ChatListPane onOpenCreateGroup={() => setIsCreateGroupOpen(true)} />

      {/* 3. Main Pane: Active Conversation & Collapsible Group Info Drawer */}
      <MainChatPane />

      {/* Creation Modals */}
      <CreateGroupModal
        isOpen={isCreateGroupOpen}
        onClose={() => setIsCreateGroupOpen(false)}
      />
      <CreateCommunityModal
        isOpen={isCreateCommunityOpen}
        onClose={() => setIsCreateCommunityOpen(false)}
      />

      {/* Google Auth, Onboarding & Settings Modals */}
      <AuthModal />
      <OnboardingModal />
      <SettingsModal />
    </div>
  );
};
