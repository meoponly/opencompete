import React, { useState, useRef } from 'react';
import {
  Paperclip,
  Smile,
  Send,
  X,
  Image as ImageIcon,
  FileText,
  Tag,
  CornerDownRight,
  Lock,
} from 'lucide-react';
import { useStore } from '../../lib/store';
import { Attachment } from '../../types';

export const ChatComposer: React.FC = () => {
  const {
    sendMessage,
    replyingToMessage,
    setReplyingToMessage,
    selectedGroup,
    currentUser,
    getUserRoleInGroup,
  } = useStore();

  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [pendingUploadFile, setPendingUploadFile] = useState<File | null>(null);
  const [showTagDialog, setShowTagDialog] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const myRole = currentUser ? getUserRoleInGroup(selectedGroup.id, currentUser.id) : 'member';
  const isAdmin = myRole === 'owner' || myRole === 'community_admin' || myRole === 'group_admin';
  const canSend = selectedGroup.permissions.sendMessages === 'all' || isAdmin;

  const emojiList = ['👍', '❤️', '🔥', '💯', '🧠', '👏', '✨', '🚀', '🎯', '📚', '💡', '✅', '👀', '⚡', '🎉'];

  const handleSend = () => {
    if (!text.trim() && attachments.length === 0) return;
    sendMessage(selectedGroup.id, text, attachments, replyingToMessage?.id || null);
    setText('');
    setAttachments([]);
    setShowEmojiPicker(false);
    setShowAttachMenu(false);
    setReplyingToMessage(null);
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

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>, isDoc: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingUploadFile(file);
    setShowAttachMenu(false);
    setShowTagDialog(true);
    setTagInput('');
    if (e.target) e.target.value = '';
  };

  const confirmAttachmentUpload = () => {
    if (!pendingUploadFile) return;

    const tags = tagInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const isVideo = pendingUploadFile.type.startsWith('video');
    const isImage = pendingUploadFile.type.startsWith('image');
    const reader = new FileReader();

    reader.onload = (event) => {
      const fileUrl = event.target?.result as string;
      const newAtt: Attachment = {
        id: `att_${Date.now()}`,
        messageId: '',
        fileUrl,
        fileType: isVideo ? 'video' : isImage ? 'image' : 'document',
        fileName: pendingUploadFile.name,
        fileSize: pendingUploadFile.size,
        tags: tags.length > 0 ? tags : undefined,
      };
      setAttachments((prev) => [...prev, newAtt]);
      setPendingUploadFile(null);
      setShowTagDialog(false);
    };
    reader.readAsDataURL(pendingUploadFile);
  };

  if (!canSend) {
    return (
      <div className="p-3 bg-[#09090B] border-t border-[#222226] text-center select-none">
        <div className="py-2.5 px-4 rounded-xl bg-[#121215] border border-[#222226] inline-flex items-center gap-2 text-xs font-mono text-[#71717A]">
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>Only group admins can send messages to this channel</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 bg-[#09090B] border-t border-[#222226] select-none relative">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFileSelected(e, false)}
        accept="image/*,video/*"
        className="hidden"
      />
      <input
        type="file"
        ref={docInputRef}
        onChange={(e) => handleFileSelected(e, true)}
        accept="application/pdf,.doc,.docx,.txt"
        className="hidden"
      />

      {/* File Tagging Dialog */}
      {showTagDialog && pendingUploadFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-[#121215] border border-[#2E2E35] rounded-xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-white" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
                  Add File Tags
                </h3>
              </div>
              <button
                onClick={() => setShowTagDialog(false)}
                className="p-1 rounded text-[#71717A] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-lg bg-[#09090B] border border-[#222226]">
              <span className="text-xs text-white font-medium truncate block">
                {pendingUploadFile.name}
              </span>
              <span className="text-[10px] font-mono text-[#71717A]">
                {(pendingUploadFile.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#71717A] mb-1">
                Tags (e.g. Physics, Rotational, Notes)
              </label>
              <input
                type="text"
                autoFocus
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Comma-separated tags..."
                className="w-full px-3 py-2 text-xs bg-[#09090B] border border-[#222226] focus:border-white/40 rounded-lg text-white focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={confirmAttachmentUpload}
                className="flex-1 py-2 rounded-lg bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors"
              >
                Attach File
              </button>
              <button
                onClick={() => setShowTagDialog(false)}
                className="px-3 py-2 rounded-lg bg-[#1C1C21] text-[#71717A] text-xs hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Replying-to Quote Banner */}
      {replyingToMessage && (
        <div className="mb-2 p-2 rounded-lg bg-[#121215] border border-[#222226] flex items-center justify-between animate-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center gap-2 truncate">
            <CornerDownRight className="w-3.5 h-3.5 text-white flex-shrink-0" />
            <span className="text-[11px] font-mono font-medium text-amber-300">
              Replying to @{replyingToMessage.user.fullName || replyingToMessage.user.username}:
            </span>
            <span className="text-xs text-[#71717A] truncate">
              {replyingToMessage.content || 'Media / Document'}
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

      {/* Attachments Preview Row */}
      {attachments.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {attachments.map((att) => (
            <div
              key={att.id}
              className="relative rounded-lg overflow-hidden border border-[#2E2E35] bg-[#121215] p-1.5 flex items-center gap-2 group"
            >
              {att.fileType === 'image' ? (
                <img src={att.fileUrl} alt={att.fileName} className="w-10 h-10 object-cover rounded" />
              ) : (
                <div className="w-10 h-10 bg-[#1C1C21] flex items-center justify-center rounded text-rose-400">
                  <FileText className="w-5 h-5" />
                </div>
              )}
              <div className="flex flex-col pr-3 truncate max-w-[120px]">
                <span className="text-xs text-white truncate">{att.fileName}</span>
                {att.tags && (
                  <span className="text-[9px] font-mono text-[#71717A] truncate">
                    #{att.tags.join(', #')}
                  </span>
                )}
              </div>
              <button
                onClick={() => setAttachments((prev) => prev.filter((a) => a.id !== att.id))}
                className="absolute top-1 right-1 p-0.5 rounded-full bg-black/80 text-white hover:bg-rose-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* WhatsApp-Style Input Bar */}
      <div className="flex items-end gap-2 bg-[#121215] border border-[#222226] focus-within:border-[#3F3F46] rounded-2xl p-2 transition-all shadow-inner">
        {/* Attachment Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowAttachMenu(!showAttachMenu)}
            title="Attach Media or Documents"
            className="p-2 rounded-lg text-[#71717A] hover:text-[#FAFAFA] hover:bg-[#1C1C21] transition-colors flex-shrink-0"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          {/* Attachment Dropup Menu */}
          {showAttachMenu && (
            <div className="absolute bottom-full left-0 mb-2 p-1.5 bg-[#17171C] border border-[#2E2E35] rounded-xl shadow-2xl z-30 flex flex-col gap-1 w-44 animate-in fade-in zoom-in-95 duration-100">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-white hover:bg-[#222226] transition-colors text-left"
              >
                <ImageIcon className="w-4 h-4 text-purple-400" />
                <span>Photos & Videos</span>
              </button>
              <button
                type="button"
                onClick={() => docInputRef.current?.click()}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-white hover:bg-[#222226] transition-colors text-left"
              >
                <FileText className="w-4 h-4 text-rose-400" />
                <span>Document / PDF</span>
              </button>
            </div>
          )}
        </div>

        {/* Text Input Area */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
          }}
          onKeyDown={handleKeyDown}
          placeholder={`Message #${selectedGroup.name}...`}
          rows={1}
          className="flex-1 bg-transparent text-xs text-[#FAFAFA] placeholder:text-[#52525B] focus:outline-none resize-none font-sans max-h-32 py-1 leading-relaxed"
        />

        {/* Emoji Trigger */}
        <div className="relative flex-shrink-0">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`p-2 rounded-lg transition-colors ${
              showEmojiPicker ? 'text-white bg-[#1C1C21]' : 'text-[#71717A] hover:text-[#FAFAFA] hover:bg-[#1C1C21]'
            }`}
          >
            <Smile className="w-4 h-4" />
          </button>

          {showEmojiPicker && (
            <div className="absolute bottom-full right-0 mb-2 p-2 bg-[#17171C] border border-[#2E2E35] rounded-xl shadow-2xl z-30 grid grid-cols-5 gap-1.5 w-48 animate-in fade-in zoom-in-95 duration-100">
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
          className={`p-2 rounded-xl transition-all flex-shrink-0 ${
            text.trim() || attachments.length > 0
              ? 'bg-white text-black hover:bg-neutral-200 active:scale-95 shadow-sm font-bold'
              : 'bg-[#17171C] text-[#52525B] cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
