import React, { useState } from 'react';
import { useStore } from '../../lib/store';
import { ChatHeader } from '../chat/ChatHeader';
import { ChatMessagesList } from '../chat/ChatMessagesList';
import { ChatComposer } from '../chat/ChatComposer';
import { GroupInfoDrawer } from '../chat/GroupInfoDrawer';
import { MediaLightbox, VideoPlayerModal } from '../discussions/MediaLightbox';

export const MainChatPane: React.FC = () => {
  const { selectedGroup } = useStore();
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const handleJumpToReply = (messageId: string) => {
    const el = document.getElementById(`msg-${messageId}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="flex-1 flex h-full overflow-hidden relative">
      {/* Central Conversation Column */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#09090B]">
        <ChatHeader onToggleInfo={() => setIsInfoOpen(!isInfoOpen)} />
        <ChatMessagesList onJumpToReply={handleJumpToReply} />
        <ChatComposer />
      </div>

      {/* WhatsApp Right Group Info Drawer */}
      <GroupInfoDrawer isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />

      {/* Media & Video Lightbox Modals */}
      <MediaLightbox />
      <VideoPlayerModal />
    </div>
  );
};
