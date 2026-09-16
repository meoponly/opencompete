import React, { useState } from 'react';
import { X, Plus, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useStore } from '../../lib/store';

export const CreateCommunityModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { createCommunity } = useStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await createCommunity({
      name: name.trim(),
      description: description.trim(),
      avatarUrl: avatarUrl.trim() || undefined,
    });

    setName('');
    setDescription('');
    setAvatarUrl('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#121215] border border-[#222226] rounded-2xl shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#222226]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-white" />
            <h3 className="text-sm font-semibold text-white">Create New Community</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-[#71717A] hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase font-mono text-[#71717A] mb-1">
              Community Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Oxford Physics & Astronomy"
              className="w-full px-3 py-2 text-xs bg-[#09090B] border border-[#222226] focus:border-white/40 rounded-lg text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase font-mono text-[#71717A] mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Broad overview of what groups in this community represent..."
              rows={2}
              className="w-full p-2.5 text-xs bg-[#09090B] border border-[#222226] focus:border-white/40 rounded-lg text-white focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase font-mono text-[#71717A] mb-1">
              Community Icon Image URL
            </label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 text-xs bg-[#09090B] border border-[#222226] focus:border-white/40 rounded-lg text-white focus:outline-none font-mono"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2 rounded-lg bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Create Community
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#1C1C21] text-[#71717A] text-xs hover:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
