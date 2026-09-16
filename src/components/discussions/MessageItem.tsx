import React, { useState } from 'react';
import {
  Smile,
  Reply,
  Edit2,
  Trash2,
  Pin,
  Check,
  X,
  ExternalLink,
  Flame,
  Clock,
  Sparkles,
  Play,
  FileText,
  Eye,
} from 'lucide-react';
import { Message, User } from '../../types';
import { useStore } from '../../lib/store';
import { UserAvatar } from '../common/UserAvatar';
import { TagBadge } from '../common/TagBadge';

interface MessageItemProps {
  message: Message;
  currentUser: User | null;
  onJumpToReply: (messageId: string) => void;
  isHighlighted?: boolean;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  currentUser,
  onJumpToReply,
  isHighlighted = false,
}) => {
  const {
    toggleReaction,
    setReplyingToMessage,
    editMessage,
    deleteMessage,
    togglePinMessage,
    setPreviewImage,
    setPreviewVideo,
  } = useStore();

  const [isHovered, setIsHovered] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content || '');

  const isAuthor = currentUser ? message.userId === currentUser.id : false;
  const isDeleted = message.isDeleted;

  const quickEmojis = ['👍', '❤️', '🔥', '💯', '🧠', '💀', '⚡', '👏'];

  const formatTimestamp = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const formatDuration = (sec: number) => {
    const hours = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
    if (hours > 0) return `${hours}h`;
    return `${mins}m`;
  };

  // Render text with clickable links
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
            className="text-neutral-300 underline underline-offset-4 hover:text-white transition-colors break-all"
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </a>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const handleSaveEdit = () => {
    if (editContent.trim()) {
      editMessage(message.id, editContent.trim());
      setIsEditing(false);
    }
  };

  // Deleted message rendering
  if (isDeleted) {
    return (
      <div
        id={`msg-${message.id}`}
        className="py-1.5 px-4 my-1 rounded-lg bg-transparent text-[#71717A] italic text-xs font-mono flex items-center gap-2 border border-dashed border-[#222226]"
      >
        <Trash2 className="w-3.5 h-3.5 opacity-50" />
        <span>[Message deleted]</span>
        <span className="text-[10px] text-[#52525B] not-italic ml-auto">
          {formatTimestamp(message.createdAt)}
        </span>
      </div>
    );
  }

  // Focus Session Broadcast card
  if (message.sessionBroadcast) {
    const session = message.sessionBroadcast;
    return (
      <div
        id={`msg-${message.id}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setShowEmojiPicker(false);
        }}
        className={`relative group my-2.5 p-4 rounded-xl bg-gradient-to-r from-[#121215] to-[#17171C] border border-[#2E2E35] shadow-lg transition-all ${
          isHighlighted ? 'ring-2 ring-white/50 animate-flash-highlight' : ''
        }`}
      >
        {/* Hover Toolbar */}
        {isHovered && (
          <div className="absolute -top-3.5 right-4 z-20 flex items-center gap-1 bg-[#1C1C21] border border-[#2E2E35] rounded-lg p-1 shadow-xl">
            {quickEmojis.slice(0, 4).map((emoji) => (
              <button
                key={emoji}
                onClick={() => toggleReaction(message.id, emoji)}
                className="w-6 h-6 rounded hover:bg-white/10 text-xs flex items-center justify-center transition-transform hover:scale-125"
              >
                {emoji}
              </button>
            ))}
            <button
              onClick={() => setReplyingToMessage(message)}
              title="Reply"
              className="p-1 rounded text-[#71717A] hover:text-white hover:bg-white/10"
            >
              <Reply className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => togglePinMessage(message.id)}
              title="Pin"
              className={`p-1 rounded ${
                message.isPinned ? 'text-white bg-white/10' : 'text-[#71717A] hover:text-white hover:bg-white/10'
              }`}
            >
              <Pin className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="flex items-start gap-3">
          <UserAvatar user={message.user} size="md" showStatus />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-xs font-semibold text-[#FAFAFA]">{message.user.fullName}</span>
              <span className="text-[10px] font-mono text-[#71717A]">
                @{message.user.username}
              </span>
              <span className="text-[10px] font-mono text-[#52525B]">
                {formatTimestamp(message.createdAt)}
              </span>
              {message.isPinned && (
                <span className="flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-white border border-white/20">
                  <Pin className="w-2.5 h-2.5" /> PINNED
                </span>
              )}
            </div>

            {/* Session Card Banner */}
            <div className="mt-1.5 p-3 rounded-lg bg-[#09090B]/80 border border-[#222226] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">
                      Logged {formatDuration(session.durationSec)}
                    </span>
                    <TagBadge category={session.category} size="sm" />
                  </div>
                  <span className="text-xs text-[#71717A] mt-0.5 truncate">{session.title}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-mono text-amber-300 bg-amber-950/30 px-2 py-1 rounded border border-amber-800/40 flex-shrink-0">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>+Verified XP</span>
              </div>
            </div>

            {/* Reactions */}
            {message.reactions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {Object.entries(
                  message.reactions.reduce<{ [emoji: string]: number }>((acc, r) => {
                    acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                    return acc;
                  }, {})
                ).map(([emoji, count]) => {
                  const hasReacted = currentUser ? message.reactions?.some(
                    (r) => r.userId === currentUser.id && r.emoji === emoji
                  ) : false;
                  return (
                    <button
                      key={emoji}
                      onClick={() => toggleReaction(message.id, emoji)}
                      className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs border transition-all ${
                        hasReacted
                          ? 'bg-white/15 text-white border-white/40 shadow-sm'
                          : 'bg-[#121215] text-[#FAFAFA] border-[#222226] hover:border-[#2E2E35]'
                      }`}
                    >
                      <span>{emoji}</span>
                      <span className="text-[10px] font-mono font-medium">{count}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Standard Discussion Message
  return (
    <div
      id={`msg-${message.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowEmojiPicker(false);
      }}
      className={`relative group py-2.5 px-3 rounded-xl transition-all my-1 ${
        isHighlighted ? 'bg-white/10 ring-2 ring-white/50 animate-flash-highlight' : 'hover:bg-[#121215]/60'
      }`}
    >
      {/* Hover Action Toolbar */}
      {isHovered && !isEditing && (
        <div className="absolute -top-3.5 right-4 z-20 flex items-center gap-0.5 bg-[#1C1C21] border border-[#2E2E35] rounded-lg p-1 shadow-xl animate-in fade-in zoom-in-95 duration-100">
          {quickEmojis.slice(0, 5).map((emoji) => (
            <button
              key={emoji}
              onClick={() => toggleReaction(message.id, emoji)}
              className="w-6 h-6 rounded hover:bg-white/10 text-xs flex items-center justify-center transition-transform hover:scale-125"
            >
              {emoji}
            </button>
          ))}

          <div className="w-[1px] h-4 bg-[#2E2E35] mx-1" />

          {/* Reply Button */}
          <button
            onClick={() => setReplyingToMessage(message)}
            title="Reply in-line"
            className="p-1 rounded text-[#71717A] hover:text-white hover:bg-white/10 transition-colors"
          >
            <Reply className="w-3.5 h-3.5" />
          </button>

          {/* Pin Button */}
          <button
            onClick={() => togglePinMessage(message.id)}
            title={message.isPinned ? 'Unpin' : 'Pin to top'}
            className={`p-1 rounded transition-colors ${
              message.isPinned ? 'text-white bg-white/10' : 'text-[#71717A] hover:text-white hover:bg-white/10'
            }`}
          >
            <Pin className="w-3.5 h-3.5" />
          </button>

          {/* Author Only: Edit & Delete */}
          {isAuthor && (
            <>
              <button
                onClick={() => {
                  setIsEditing(true);
                  setEditContent(message.content || '');
                }}
                title="Edit message"
                className="p-1 rounded text-[#71717A] hover:text-white hover:bg-white/10 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => deleteMessage(message.id)}
                title="Delete message"
                className="p-1 rounded text-[#71717A] hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      )}

      <div className="flex items-start gap-3">
        <UserAvatar user={message.user} size="md" showStatus />

        <div className="flex-1 min-w-0">
          {/* Header Row */}
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-xs font-semibold text-[#FAFAFA]">{message.user.fullName}</span>
            <span className="text-[10px] font-mono text-[#71717A]">
              @{message.user.username}
            </span>
            <span className="text-[10px] font-mono text-[#52525B]">
              {formatTimestamp(message.createdAt)}
            </span>
            {message.isEdited && (
              <span className="text-[10px] font-mono text-[#71717A] italic">(edited)</span>
            )}
            {message.isPinned && (
              <span className="flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-white border border-white/20">
                <Pin className="w-2.5 h-2.5" /> PINNED
              </span>
            )}
          </div>

          {/* Quoted Reply Reference */}
          {message.replyTo && (
            <div
              onClick={() => message.replyToId && onJumpToReply(message.replyToId)}
              className="mb-1.5 px-2.5 py-1.5 rounded-md bg-[#17171C] border-l-2 border-white/50 text-xs text-[#71717A] hover:bg-[#1C1C21] cursor-pointer flex items-center justify-between gap-2 max-w-lg transition-colors"
            >
              <div className="flex flex-col truncate">
                <span className="font-mono font-medium text-white text-[10px]">
                  @{message.replyTo.userName}
                </span>
                <span className="truncate text-[11px] text-[#FAFAFA]/90">
                  {message.replyTo.content}
                </span>
              </div>
            </div>
          )}

          {/* Message Content or Edit Input */}
          {isEditing ? (
            <div className="mt-1 space-y-2 max-w-2xl">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 text-xs bg-[#09090B] border border-[#2E2E35] rounded-lg text-[#FAFAFA] focus:outline-none focus:border-white/50 resize-none font-sans"
                rows={2}
                autoFocus
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1 rounded bg-white text-black font-semibold text-xs flex items-center gap-1 hover:bg-neutral-200 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" /> Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 rounded bg-[#1C1C21] text-[#71717A] hover:text-white text-xs flex items-center gap-1 transition-colors"
                >
                  <X className="w-3.5 h-3.5" /> Cancel
                </button>
              </div>
            </div>
          ) : (
            message.content && (
              <p className="text-xs text-[#FAFAFA] leading-relaxed whitespace-pre-wrap select-text">
                {renderFormattedText(message.content)}
              </p>
            )
          )}

          {/* Media Attachments Grid (1-4 images like Telegram/Twitter) */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2.5 max-w-xl">
              {message.attachments.some((a) => a.fileType === 'video') ? (
                message.attachments.map((att) => (
                  <div
                    key={att.id}
                    onClick={() => setPreviewVideo(att.fileUrl)}
                    className="relative rounded-lg overflow-hidden border border-[#222226] bg-black aspect-video group cursor-pointer max-w-md"
                  >
                    <img
                      src={att.thumbnailUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80'}
                      alt={att.fileName}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-xl group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div
                  className={`grid gap-1.5 rounded-lg overflow-hidden ${
                    message.attachments.length === 1
                      ? 'grid-cols-1'
                      : message.attachments.length === 2
                      ? 'grid-cols-2'
                      : message.attachments.length === 3
                      ? 'grid-cols-3'
                      : 'grid-cols-2'
                  }`}
                >
                  {message.attachments.map((att) => (
                    <div
                      key={att.id}
                      onClick={() => setPreviewImage(att.fileUrl)}
                      className="relative rounded-md overflow-hidden bg-[#121215] border border-[#222226] aspect-video group cursor-pointer"
                    >
                      <img
                        src={att.fileUrl}
                        alt={att.fileName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="p-2 rounded-full bg-black/60 text-white backdrop-blur-sm">
                          <Eye className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Smart OpenGraph Link Preview Card */}
          {message.linkPreview && (
            <a
              href={message.linkPreview.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 block max-w-lg rounded-lg bg-[#121215] border border-[#222226] hover:border-[#2E2E35] overflow-hidden transition-all group/link"
            >
              <div className="flex flex-col sm:flex-row">
                {message.linkPreview.imageUrl && (
                  <div className="sm:w-36 h-28 flex-shrink-0 bg-[#17171C] overflow-hidden">
                    <img
                      src={message.linkPreview.imageUrl}
                      alt={message.linkPreview.title}
                      className="w-full h-full object-cover group-hover/link:scale-105 transition-transform"
                    />
                  </div>
                )}
                <div className="p-3 flex flex-col justify-center min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-mono text-[#71717A] uppercase truncate">
                      {message.linkPreview.siteName}
                    </span>
                    <ExternalLink className="w-3 h-3 text-[#52525B] group-hover/link:text-white transition-colors" />
                  </div>
                  <h4 className="text-xs font-semibold text-[#FAFAFA] group-hover/link:text-white line-clamp-1">
                    {message.linkPreview.title}
                  </h4>
                  {message.linkPreview.description && (
                    <p className="text-[11px] text-[#71717A] line-clamp-2 mt-0.5">
                      {message.linkPreview.description}
                    </p>
                  )}
                </div>
              </div>
            </a>
          )}

          {/* Message Reactions Badges */}
          {message.reactions.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {Object.entries(
                message.reactions.reduce<{ [emoji: string]: number }>((acc, r) => {
                  acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                  return acc;
                }, {})
              ).map(([emoji, count]) => {
                const hasReacted = currentUser ? message.reactions?.some(
                  (r) => r.userId === currentUser.id && r.emoji === emoji
                ) : false;
                return (
                  <button
                    key={emoji}
                    onClick={() => toggleReaction(message.id, emoji)}
                    className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs border transition-all ${
                      hasReacted
                        ? 'bg-white/15 text-white border-white/40 shadow-sm'
                        : 'bg-[#121215] text-[#FAFAFA] border-[#222226] hover:border-[#2E2E35]'
                    }`}
                  >
                    <span>{emoji}</span>
                    <span className="text-[10px] font-mono font-medium">{count}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
