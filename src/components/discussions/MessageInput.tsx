import React, { useState, useRef, useEffect } from 'react';
import {
  Paperclip,
  Smile,
  Send,
  X,
  Image as ImageIcon,
  Film,
  FileText,
  CornerDownRight,
  Upload,
} from 'lucide-react';
import { useStore } from '../../lib/store';
import { Attachment } from '../../types';

export const MessageInput: React.FC = () => {
  const {
    sendMessage,
    replyingToMessage,
    setReplyingToMessage,
    typingUsers,
    selectedGroup,
  } = useStore();

  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const emojiList = ['👍', '❤️', '🔥', '💯', '🧠', '💀', '⚡', '👏', '🚀', '🎯', '📚', '💡', '✅', '👀', '✨'];

  useEffect(() => {
    if (replyingToMessage && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [replyingToMessage]);

  const handleSend = () => {
    if (!text.trim() && attachments.length === 0) return;
    sendMessage(text, attachments);
    setText('');
    setAttachments([]);
    setShowEmojiPicker(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Convert file to mock upload attachment with real data URL
    Array.from(files).forEach((file) => {
      const isVideo = file.type.startsWith('video');
      const isImage = file.type.startsWith('image');
      const reader = new FileReader();

      reader.onload = (event) => {
        const fileUrl = event.target?.result as string;
        const newAtt: Attachment = {
          id: `att_${Date.now()}_${Math.random()}`,
          messageId: '',
          fileUrl,
          fileType: isVideo ? 'video' : isImage ? 'image' : 'document',
          fileName: file.name,
          fileSize: file.size,
        };
        setAttachments((prev) => [...prev, newAtt]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        const isVideo = file.type.startsWith('video');
        const isImage = file.type.startsWith('image');
        const reader = new FileReader();

        reader.onload = (event) => {
          const fileUrl = event.target?.result as string;
          const newAtt: Attachment = {
            id: `att_${Date.now()}_${Math.random()}`,
            messageId: '',
            fileUrl,
            fileType: isVideo ? 'video' : isImage ? 'image' : 'document',
            fileName: file.name,
            fileSize: file.size,
          };
          setAttachments((prev) => [...prev, newAtt]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`p-3 bg-[#09090B] border-t border-[#222226] select-none relative transition-colors ${
        isDragging ? 'bg-[#121215] border-white/40' : ''
      }`}
    >
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        multiple
        accept="image/*,video/*,application/pdf"
        className="hidden"
      />

      {/* Typing Indicators */}
      <div className="h-4 mb-1 px-1 flex items-center">
        {typingUsers.length > 0 ? (
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#71717A] animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>{typingUsers.join(', ')} is typing...</span>
          </div>
        ) : (
          <span className="text-[10px] font-mono text-[#52525B]">
            Press Enter to send, Shift + Enter for newline
          </span>
        )}
      </div>

      {/* Replying Banner */}
      {replyingToMessage && (
        <div className="mb-2 p-2 rounded-lg bg-[#121215] border border-[#222226] flex items-center justify-between animate-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center gap-2 truncate">
            <CornerDownRight className="w-3.5 h-3.5 text-white flex-shrink-0" />
            <span className="text-[11px] font-mono font-medium text-white">
              Replying to @{replyingToMessage.user.fullName}:
            </span>
            <span className="text-xs text-[#71717A] truncate">
              {replyingToMessage.content || 'Media / Focus session'}
            </span>
          </div>
          <button
            onClick={() => setReplyingToMessage(null)}
            className="p-1 text-[#71717A] hover:text-white rounded"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Attachment Previews */}
      {attachments.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {attachments.map((att) => (
            <div
              key={att.id}
              className="relative rounded-lg overflow-hidden border border-[#2E2E35] bg-[#121215] p-1 flex items-center gap-2 group"
            >
              {att.fileType === 'image' ? (
                <img src={att.fileUrl} alt={att.fileName} className="w-10 h-10 object-cover rounded" />
              ) : att.fileType === 'video' ? (
                <div className="w-10 h-10 bg-black flex items-center justify-center rounded text-white">
                  <Film className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-10 h-10 bg-[#1C1C21] flex items-center justify-center rounded text-white">
                  <FileText className="w-4 h-4" />
                </div>
              )}
              <span className="text-xs text-[#FAFAFA] max-w-[120px] truncate pr-2">
                {att.fileName}
              </span>
              <button
                onClick={() => removeAttachment(att.id)}
                className="absolute top-1 right-1 p-0.5 rounded-full bg-black/80 text-white hover:bg-rose-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Box Wrapper */}
      <div className="flex items-end gap-2 bg-[#121215] border border-[#222226] focus-within:border-[#3F3F46] rounded-xl p-2 transition-all shadow-inner">
        {/* Attachment button (SVG paperclip icon) */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          title="Attach media or PDF"
          className="p-2 rounded-lg text-[#71717A] hover:text-[#FAFAFA] hover:bg-[#1C1C21] transition-colors flex-shrink-0"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
          }}
          onKeyDown={handleKeyDown}
          placeholder={`Message #${selectedGroup.name}...`}
          rows={1}
          className="flex-1 bg-transparent text-xs text-[#FAFAFA] placeholder:text-[#52525B] focus:outline-none resize-none font-sans max-h-36 py-1 leading-relaxed"
        />

        {/* Emoji Reaction Picker Trigger */}
        <div className="relative flex-shrink-0">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            title="Emoji reactions"
            className={`p-2 rounded-lg transition-colors ${
              showEmojiPicker ? 'text-white bg-[#1C1C21]' : 'text-[#71717A] hover:text-[#FAFAFA] hover:bg-[#1C1C21]'
            }`}
          >
            <Smile className="w-4 h-4" />
          </button>

          {/* Emoji Popover */}
          {showEmojiPicker && (
            <div className="absolute bottom-full right-0 mb-2 p-2 bg-[#121215] border border-[#2E2E35] rounded-xl shadow-2xl z-30 grid grid-cols-5 gap-1.5 w-48 animate-in fade-in zoom-in-95 duration-100">
              {emojiList.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    setText((prev) => prev + emoji);
                    setShowEmojiPicker(false);
                    textareaRef.current?.focus();
                  }}
                  className="w-8 h-8 rounded-lg hover:bg-white/10 text-sm flex items-center justify-center transition-transform hover:scale-125"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Send Button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={!text.trim() && attachments.length === 0}
          className={`p-2 rounded-lg transition-all flex-shrink-0 ${
            text.trim() || attachments.length > 0
              ? 'bg-white text-black hover:bg-neutral-200 active:scale-95 shadow-sm'
              : 'bg-[#17171C] text-[#52525B] cursor-not-allowed'
          }`}
          title="Send message (Enter)"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
