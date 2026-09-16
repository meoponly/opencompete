import React, { useRef, useEffect, useState } from 'react';
import { ChevronDown, MessageSquare } from 'lucide-react';
import { useStore } from '../../lib/store';
import { PinnedBanner } from './PinnedBanner';
import { MessageItem } from './MessageItem';
import { MessageInput } from './MessageInput';
import { MediaLightbox, VideoPlayerModal } from './MediaLightbox';

export const DiscussionsTab: React.FC = () => {
  const { messages, currentUser, togglePinMessage, selectedGroup } = useStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const pinnedMessages = messages.filter((m) => m.isPinned && !m.isDeleted);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (!showScrollBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isUp = scrollHeight - scrollTop - clientHeight > 150;
    setShowScrollBottom(isUp);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setShowScrollBottom(false);
  };

  const handleJumpToMessage = (messageId: string) => {
    const el = document.getElementById(`msg-${messageId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedMessageId(messageId);
      setTimeout(() => {
        setHighlightedMessageId(null);
      }, 2000);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#09090B] relative overflow-hidden">
      {/* Pinned Messages Banner */}
      <PinnedBanner
        pinnedMessages={pinnedMessages}
        onJumpToMessage={handleJumpToMessage}
        onUnpin={togglePinMessage}
      />

      {/* Message Feed Container */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-1 custom-scrollbar"
      >
        {/* Empty or Welcome State */}
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-12 h-12 rounded-xl bg-[#121215] border border-[#222226] flex items-center justify-center text-[#71717A] mb-3">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-[#FAFAFA]">Welcome to #{selectedGroup.name}</h3>
            <p className="text-xs text-[#71717A] max-w-sm mt-1 font-sans">
              This is the dedicated Telegram-replacement study squad channel. Share derivations, questions, and verified focus sessions.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageItem
              key={msg.id}
              message={msg}
              currentUser={currentUser}
              onJumpToReply={handleJumpToMessage}
              isHighlighted={highlightedMessageId === msg.id}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Floating 'New messages below' pill */}
      {showScrollBottom && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-20 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-[#1C1C21] border border-[#2E2E35] text-xs font-mono text-white flex items-center gap-1.5 shadow-2xl hover:bg-[#25252B] transition-all z-20 animate-bounce"
        >
          <ChevronDown className="w-3.5 h-3.5" />
          <span>New messages below</span>
        </button>
      )}

      {/* Telegram-Grade Message Input */}
      <MessageInput />

      {/* Media Lightbox & Video Player Modals */}
      <MediaLightbox />
      <VideoPlayerModal />
    </div>
  );
};
