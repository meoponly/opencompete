import React, { useState } from 'react';
import { X, Users, Plus, Megaphone, Shield } from 'lucide-react';
import { useStore } from '../../lib/store';

export const CreateGroupModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { selectedCommunity, createGroup } = useStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isAnnouncement, setIsAnnouncement] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await createGroup({
      communityId: selectedCommunity.id,
      name: name.trim(),
      description: description.trim(),
      isAnnouncementGroup: isAnnouncement,
    });

    setName('');
    setDescription('');
    setIsAnnouncement(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#121215] border border-[#222226] rounded-2xl shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#222226]">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-white" />
            <h3 className="text-sm font-semibold text-white">Create New Sub-Group</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-[#71717A] hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase font-mono text-[#71717A] mb-1">
              Group Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Electrodynamics & Magnetism"
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
              placeholder="Topic focus, study objectives, resources..."
              rows={2}
              className="w-full p-2.5 text-xs bg-[#09090B] border border-[#222226] focus:border-white/40 rounded-lg text-white focus:outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#09090B] border border-[#222226]">
            <div className="flex items-center gap-2.5">
              <Megaphone className="w-4 h-4 text-amber-400" />
              <div className="flex flex-col">
                <span className="text-xs text-white font-medium">Announcement Channel</span>
                <span className="text-[10px] text-[#71717A] font-mono">
                  Only group admins can post updates
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isAnnouncement}
              onChange={(e) => setIsAnnouncement(e.target.checked)}
              className="w-4 h-4 accent-white rounded"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2 rounded-lg bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Create Group
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
