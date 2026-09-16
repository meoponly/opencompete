import React, { useState } from 'react';
import { X, Plus, FolderArchive, Link, FileText, Sparkles } from 'lucide-react';
import { useStore } from '../../lib/store';
import { ResourceType } from '../../types';

export const AddResourceModal: React.FC = () => {
  const { isAddResourceOpen, setIsAddResourceOpen, addResource, selectedGroup } = useStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<ResourceType>('pdf');
  const [tagsString, setTagsString] = useState('');

  if (!isAddResourceOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    const tags = tagsString
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    addResource({
      title: title.trim(),
      description: description.trim() || undefined,
      url: url.trim(),
      type,
      tags: tags.length > 0 ? tags : ['Study Material'],
      fileSize: type === 'pdf' ? '12.4 MB' : undefined,
    });

    setTitle('');
    setDescription('');
    setUrl('');
    setTagsString('');
  };

  const types: { id: ResourceType; label: string }[] = [
    { id: 'pdf', label: 'PDF Document' },
    { id: 'cheatsheet', label: 'Cheatsheet' },
    { id: 'notes', label: 'Study Notes' },
    { id: 'link', label: 'Curated Link / Repo' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#121215] border border-[#222226] rounded-xl shadow-2xl p-6 overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-[#222226]">
          <div className="flex items-center gap-2">
            <FolderArchive className="w-5 h-5 text-white" />
            <h2 className="text-sm font-semibold tracking-tight text-[#FAFAFA]">
              Add to Resource Vault
            </h2>
          </div>
          <button
            onClick={() => setIsAddResourceOpen(false)}
            className="p-1.5 rounded-lg text-[#71717A] hover:text-white hover:bg-[#1C1C21] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-[11px] uppercase font-mono tracking-wider text-[#71717A] mb-1">
              Resource Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Pathfinder Rotational Dynamics Full Solutions"
              className="w-full px-3 py-2 text-xs bg-[#09090B] border border-[#222226] focus:border-white/40 rounded-lg text-[#FAFAFA] placeholder:text-[#52525B] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase font-mono tracking-wider text-[#71717A] mb-1">
              Resource URL or Link *
            </label>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 text-xs bg-[#09090B] border border-[#222226] focus:border-white/40 rounded-lg text-[#FAFAFA] placeholder:text-[#52525B] focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase font-mono tracking-wider text-[#71717A] mb-1">
              Resource Category
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {types.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id)}
                  className={`py-1.5 text-xs font-mono rounded-md border transition-all ${
                    type === t.id
                      ? 'bg-white text-black border-white font-semibold'
                      : 'bg-[#09090B] text-[#71717A] border-[#222226] hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase font-mono tracking-wider text-[#71717A] mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsString}
              onChange={(e) => setTagsString(e.target.value)}
              placeholder="Physics, Mechanics, Solved Examples"
              className="w-full px-3 py-2 text-xs bg-[#09090B] border border-[#222226] focus:border-white/40 rounded-lg text-[#FAFAFA] placeholder:text-[#52525B] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase font-mono tracking-wider text-[#71717A] mb-1">
              Short Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief context on how this material helps with syllabus..."
              rows={2}
              className="w-full px-3 py-2 text-xs bg-[#09090B] border border-[#222226] focus:border-white/40 rounded-lg text-[#FAFAFA] placeholder:text-[#52525B] focus:outline-none resize-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2 rounded-lg bg-white text-black font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-neutral-200 transition-all shadow-md"
            >
              <Plus className="w-4 h-4" /> Save Material to #{selectedGroup.name.slice(0, 12)}
            </button>
            <button
              type="button"
              onClick={() => setIsAddResourceOpen(false)}
              className="px-4 py-2 rounded-lg bg-[#1C1C21] text-[#71717A] hover:text-white text-xs transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
