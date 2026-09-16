import React, { useState } from 'react';
import { Pin, ChevronRight, ChevronDown, X, CornerDownRight } from 'lucide-react';
import { Message } from '../../types';

interface PinnedBannerProps {
  pinnedMessages: Message[];
  onJumpToMessage: (messageId: string) => void;
  onUnpin: (messageId: string) => void;
}

export const PinnedBanner: React.FC<PinnedBannerProps> = ({
  pinnedMessages,
  onJumpToMessage,
  onUnpin,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (pinnedMessages.length === 0) return null;

  const activeMsg = pinnedMessages[currentIndex] || pinnedMessages[0];

  return (
    <div className="border-b border-[#222226] bg-[#121215]/90 backdrop-blur-md px-4 py-2 select-none z-10">
      <div className="flex items-center justify-between gap-3">
        <div
          onClick={() => onJumpToMessage(activeMsg.id)}
          className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer group"
        >
          <div className="w-6 h-6 rounded-md bg-[#1C1C21] border border-[#2E2E35] flex items-center justify-center flex-shrink-0 text-white">
            <Pin className="w-3.5 h-3.5" />
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-semibold text-white uppercase tracking-wider">
                Pinned Announcement
              </span>
              {pinnedMessages.length > 1 && (
                <span className="text-[10px] font-mono text-[#71717A]">
                  ({currentIndex + 1}/{pinnedMessages.length})
                </span>
              )}
            </div>
            <p className="text-xs text-[#FAFAFA] group-hover:text-white truncate max-w-2xl">
              {activeMsg.content || 'Session broadcast or attachment'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {pinnedMessages.length > 1 && (
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % pinnedMessages.length)}
              className="p-1 rounded text-[#71717A] hover:text-white hover:bg-[#1C1C21] transition-colors"
              title="Next Pinned"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => onJumpToMessage(activeMsg.id)}
            title="Jump to message"
            className="px-2 py-1 rounded bg-[#1C1C21] border border-[#2E2E35] text-[10px] font-mono text-white hover:bg-[#25252B] flex items-center gap-1"
          >
            <CornerDownRight className="w-3 h-3" />
            Jump
          </button>
        </div>
      </div>
    </div>
  );
};
