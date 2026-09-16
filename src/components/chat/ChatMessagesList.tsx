import React, { useRef, useEffect, useState } from 'react';
import {
  Check,
  CheckCheck,
  Pin,
  Reply,
  Trash2,
  Smile,
  ExternalLink,
  Download,
  FileText,
  Play,
  Eye,
  Shield,
  CornerDownRight,
  ChevronDown,
} from 'lucide-react';
import { useStore } from '../../lib/store';
import { Message, User } from '../../types';
import { UserAvatar } from '../common/UserAvatar';

export const ChatMessagesList: React.FC<{
  onJumpToReply: (messageId: string) => void;
}> = ({ onJumpToReply }) => {
  const {
    messages,
    currentUser,
    selectedGroup,
    toggleReaction,
    setReplyingToMessage,
    deleteMessage,
    togglePinMessage,
    getUserRoleInGroup,
    setPreviewImage,
    setPreviewVideo,
  } = useStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const myRole = currentUser ? getUserRoleInGroup(selectedGroup.id, currentUser.id) : 'member';
  const isAdmin = myRole === 'owner' || myRole === 'community_admin' || myRole === 'group_admin';

  const quickEmojis = ['👍', '❤️', '🔥', '💯', '🧠', '👏'];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    setShowScrollBottom(scrollHeight - scrollTop - clientHeight > 150);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setShowScrollBottom(false);
  };

  // Group messages by Date string
  const groupedMessages: { date: string; items: Message[] }[] = [];
  messages.forEach((msg) => {
    const d = new Date(msg.createdAt).toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    const existing = groupedMessages.find((g) => g.date === d);
    if (existing) {
      existing.items.push(msg);
    } else {
      groupedMessages.push({ date: d, items: [msg] });
    }
  });

  const pinnedMessages = messages.filter((m) => m.isPinned && !m.isDeleted);

  const formatTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const renderFormattedText = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-300 underline underline-offset-2 hover:text-cyan-200 transition-colors break-all"
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </a>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#09090B] relative overflow-hidden">
      {/* Pinned Messages Header Banner */}
      {pinnedMessages.length > 0 && (
        <div className="border-b border-[#222226] bg-[#121215]/90 backdrop-blur-md px-4 py-2 flex items-center justify-between z-10">
          <div
            onClick={() => {
              const el = document.getElementById(`msg-${pinnedMessages[0].id}`);
              el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
            className="flex items-center gap-2 cursor-pointer truncate"
          >
            <Pin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span className="text-[11px] font-mono font-semibold text-white uppercase">
              Pinned:
            </span>
            <span className="text-xs text-[#FAFAFA] truncate">
              {pinnedMessages[0].content || 'Attachment / Announcement'}
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#71717A]">
            {pinnedMessages.length} Pinned
          </span>
        </div>
      )}

      {/* Messages Scroll Feed */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4 custom-scrollbar"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-14 h-14 rounded-2xl bg-[#121215] border border-[#222226] flex items-center justify-center text-[#71717A] mb-3">
              <CheckCheck className="w-7 h-7 text-emerald-400 opacity-80" />
            </div>
            <h3 className="text-sm font-semibold text-white">Welcome to #{selectedGroup.name}</h3>
            <p className="text-xs text-[#71717A] max-w-sm mt-1">
              This group is active. Messages, shared documents, and tagged media are securely synchronized in real time.
            </p>
          </div>
        ) : (
          groupedMessages.map((group) => (
            <div key={group.date} className="space-y-3">
              {/* Date Separator */}
              <div className="flex justify-center my-3">
                <span className="px-3 py-1 rounded-full bg-[#121215] border border-[#222226] text-[10px] font-mono uppercase text-[#71717A] shadow-sm">
                  {group.date}
                </span>
              </div>

              {/* Messages within this date */}
              {group.items.map((msg) => {
                const isMe = msg.userId === currentUser?.id;
                const canDelete = isMe || isAdmin; // Admin moderation delete

                if (msg.isDeleted) {
                  return (
                    <div
                      key={msg.id}
                      id={`msg-${msg.id}`}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className="py-1.5 px-3 rounded-xl bg-[#121215]/50 border border-dashed border-[#222226] text-[#71717A] italic text-xs font-mono flex items-center gap-2">
                        <Trash2 className="w-3.5 h-3.5 opacity-50" />
                        <span>
                          {msg.deletedBy
                            ? `This message was deleted by ${msg.deletedBy.userName} (${msg.deletedBy.role})`
                            : 'This message was deleted'}
                        </span>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    id={`msg-${msg.id}`}
                    className={`flex flex-col group ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`relative max-w-[85%] md:max-w-[70%] rounded-2xl p-3 shadow-md transition-all ${
                        isMe
                          ? 'bg-[#1C1C21] border border-[#2E2E35] text-white rounded-tr-sm'
                          : 'bg-[#121215] border border-[#222226] text-[#FAFAFA] rounded-tl-sm'
                      }`}
                    >
                      {/* Hover Action Bar */}
                      <div
                        className={`absolute -top-3.5 ${
                          isMe ? 'right-2' : 'left-2'
                        } z-20 hidden group-hover:flex items-center gap-0.5 bg-[#17171C] border border-[#2E2E35] rounded-lg p-0.5 shadow-xl`}
                      >
                        {quickEmojis.slice(0, 4).map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => toggleReaction(selectedGroup.id, msg.id, emoji)}
                            className="w-5 h-5 rounded hover:bg-white/10 text-xs flex items-center justify-center transition-transform hover:scale-125"
                          >
                            {emoji}
                          </button>
                        ))}
                        <div className="w-[1px] h-3 bg-[#2E2E35] mx-0.5" />
                        <button
                          onClick={() => setReplyingToMessage(msg)}
                          title="Reply"
                          className="p-1 rounded text-[#71717A] hover:text-white hover:bg-white/10"
                        >
                          <Reply className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => togglePinMessage(selectedGroup.id, msg.id)}
                          title="Pin"
                          className="p-1 rounded text-[#71717A] hover:text-white hover:bg-white/10"
                        >
                          <Pin className="w-3 h-3" />
                        </button>
                        {canDelete && (
                          <button
                            onClick={() => deleteMessage(selectedGroup.id, msg.id)}
                            title={isMe ? 'Delete for everyone' : 'Admin: Delete message'}
                            className="p-1 rounded text-[#71717A] hover:text-rose-400 hover:bg-rose-950/40"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {/* Author Header (for others) */}
                      {!isMe && (
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[11px] font-bold text-amber-300 font-mono">
                            ~{msg.user.fullName || msg.user.username}
                          </span>
                          <span className="text-[9px] font-mono text-[#71717A]">
                            @{msg.user.username}
                          </span>
                        </div>
                      )}

                      {/* Quoted Reply Snippet */}
                      {msg.replyTo && (
                        <div
                          onClick={() => msg.replyToId && onJumpToReply(msg.replyToId)}
                          className="mb-2 p-2 rounded-lg bg-black/40 border-l-2 border-amber-400 text-xs text-[#A1A1AA] cursor-pointer hover:bg-black/60 transition-colors"
                        >
                          <span className="block text-[10px] font-bold text-amber-300 font-mono">
                            {msg.replyTo.userName}
                          </span>
                          <span className="text-[11px] text-white/90 line-clamp-1">
                            {msg.replyTo.content}
                          </span>
                        </div>
                      )}

                      {/* Message Content */}
                      {msg.content && (
                        <p className="text-xs leading-relaxed whitespace-pre-wrap select-text">
                          {renderFormattedText(msg.content)}
                        </p>
                      )}

                      {/* Attachments with Tags (Photos, Videos, PDFs) */}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-2 space-y-1.5">
                          {msg.attachments.map((att) => (
                            <div key={att.id} className="space-y-1">
                              {att.fileType === 'image' ? (
                                <div
                                  onClick={() => setPreviewImage(att.fileUrl)}
                                  className="relative rounded-lg overflow-hidden bg-black/50 border border-white/10 aspect-video max-w-sm cursor-pointer group/img"
                                >
                                  <img
                                    src={att.fileUrl}
                                    alt={att.fileName}
                                    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform"
                                  />
                                </div>
                              ) : att.fileType === 'video' ? (
                                <div
                                  onClick={() => setPreviewVideo(att.fileUrl)}
                                  className="relative rounded-lg overflow-hidden bg-black aspect-video max-w-sm cursor-pointer flex items-center justify-center group/vid"
                                >
                                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                                    <Play className="w-4 h-4 fill-current ml-0.5" />
                                  </div>
                                </div>
                              ) : (
                                <a
                                  href={att.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2.5 rounded-xl bg-black/40 border border-white/10 hover:border-white/25 flex items-center justify-between gap-3 transition-colors group/doc max-w-sm"
                                >
                                  <div className="flex items-center gap-2.5 truncate">
                                    <div className="w-8 h-8 rounded-lg bg-rose-950/50 border border-rose-800/40 flex items-center justify-center text-rose-400 flex-shrink-0">
                                      <FileText className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col truncate">
                                      <span className="text-xs text-white font-medium truncate">
                                        {att.fileName}
                                      </span>
                                      <span className="text-[10px] font-mono text-[#71717A]">
                                        Document
                                      </span>
                                    </div>
                                  </div>
                                  <Download className="w-4 h-4 text-[#71717A] group-hover/doc:text-white flex-shrink-0" />
                                </a>
                              )}

                              {/* File Tags Badge Row */}
                              {att.tags && att.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {att.tags.map((t) => (
                                    <span
                                      key={t}
                                      className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-white border border-white/15"
                                    >
                                      #{t}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* OpenGraph Link Preview Card */}
                      {msg.linkPreview && (
                        <a
                          href={msg.linkPreview.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 block rounded-xl bg-black/40 border border-white/10 overflow-hidden hover:border-white/30 transition-all max-w-sm"
                        >
                          {msg.linkPreview.imageUrl && (
                            <img
                              src={msg.linkPreview.imageUrl}
                              alt="preview"
                              className="w-full h-28 object-cover"
                            />
                          )}
                          <div className="p-2.5">
                            <span className="text-[9px] font-mono text-[#71717A] uppercase block">
                              {msg.linkPreview.siteName}
                            </span>
                            <span className="text-xs font-semibold text-white line-clamp-1">
                              {msg.linkPreview.title}
                            </span>
                          </div>
                        </a>
                      )}

                      {/* Footer: Timestamp & Delivered Checkmarks */}
                      <div className="flex items-center justify-end gap-1.5 mt-1.5">
                        {msg.isPinned && <Pin className="w-2.5 h-2.5 text-amber-400" />}
                        <span className="text-[9px] font-mono text-[#71717A]">
                          {formatTime(msg.createdAt)}
                        </span>
                        {isMe && <CheckCheck className="w-3 h-3 text-cyan-400" />}
                      </div>
                    </div>

                    {/* Reactions Pill Row */}
                    {msg.reactions && msg.reactions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1 px-1">
                        {Object.entries(
                          msg.reactions.reduce<{ [e: string]: number }>((acc, r) => {
                            acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                            return acc;
                          }, {})
                        ).map(([emoji, count]) => (
                          <button
                            key={emoji}
                            onClick={() => toggleReaction(selectedGroup.id, msg.id, emoji)}
                            className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#17171C] border border-[#2E2E35] text-[10px] text-white hover:scale-105 transition-transform"
                          >
                            <span>{emoji}</span>
                            <span className="font-mono">{count}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Floating 'Scroll to bottom' button */}
      {showScrollBottom && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-20 right-6 p-2.5 rounded-full bg-[#1C1C21] border border-[#2E2E35] text-white shadow-2xl hover:bg-[#25252B] transition-all z-20 animate-bounce"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
