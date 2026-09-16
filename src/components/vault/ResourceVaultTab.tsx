import React, { useState } from 'react';
import {
  FolderArchive,
  Search,
  Plus,
  FileText,
  Link,
  Download,
  ExternalLink,
  Tag,
  Trash2,
  Eye,
  Layers,
  Sparkles,
  FileSpreadsheet,
} from 'lucide-react';
import { useStore } from '../../lib/store';
import { Resource, ResourceType } from '../../types';
import { UserAvatar } from '../common/UserAvatar';
import { AddResourceModal } from './AddResourceModal';

export const ResourceVaultTab: React.FC = () => {
  const { resources, deleteResource, currentUser, selectedGroup, setIsAddResourceOpen } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const types: { id: string; label: string }[] = [
    { id: 'all', label: 'All Materials' },
    { id: 'pdf', label: 'PDF Documents' },
    { id: 'cheatsheet', label: 'Cheatsheets' },
    { id: 'notes', label: 'Study Notes' },
    { id: 'link', label: 'Curated Links' },
  ];

  // Collect all unique tags
  const allTags = Array.from(
    new Set(resources.flatMap((r) => r.tags || []))
  );

  const filteredResources = resources.filter((res) => {
    if (selectedType !== 'all' && res.type !== selectedType) return false;
    if (selectedTag !== 'all' && (!res.tags || !res.tags.includes(selectedTag))) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = res.title.toLowerCase().includes(q);
      const matchDesc = res.description?.toLowerCase().includes(q);
      const matchTags = res.tags?.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTags) return false;
    }

    return true;
  });

  const getResourceIcon = (type: ResourceType) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-rose-400" />;
      case 'cheatsheet':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-400" />;
      case 'notes':
        return <Layers className="w-5 h-5 text-amber-400" />;
      case 'link':
        return <Link className="w-5 h-5 text-cyan-400" />;
      default:
        return <FileText className="w-5 h-5 text-zinc-400" />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#09090B] space-y-6 custom-scrollbar">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#222226]">
        <div>
          <div className="flex items-center gap-2">
            <FolderArchive className="w-5 h-5 text-white" />
            <h2 className="text-base font-semibold tracking-tight text-[#FAFAFA]">
              Resource Vault
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-[#FAFAFA] border border-white/15">
              {resources.length} Items
            </span>
          </div>
          <p className="text-xs text-[#71717A] mt-0.5">
            Organized knowledge repository for #{selectedGroup.name}. All PDFs, notes, and links synced from discussions.
          </p>
        </div>

        <button
          onClick={() => setIsAddResourceOpen(true)}
          className="px-3.5 py-2 rounded-lg bg-white text-black font-semibold text-xs flex items-center gap-1.5 hover:bg-neutral-200 transition-all shadow-md flex-shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Material
        </button>
      </div>

      {/* Filter Row: Search & Type Pills */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, description, or topic tags..."
              className="w-full pl-9 pr-4 py-2 bg-[#121215] border border-[#222226] focus:border-[#3F3F46] rounded-xl text-xs text-[#FAFAFA] placeholder:text-[#52525B] focus:outline-none transition-colors"
            />
          </div>

          {/* Type Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {types.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id)}
                className={`text-xs font-mono px-3 py-2 rounded-xl border transition-all flex-shrink-0 ${
                  selectedType === t.id
                    ? 'bg-[#1C1C21] text-white border-[#2E2E35] font-semibold shadow-sm'
                    : 'bg-[#121215] text-[#71717A] border-[#222226] hover:text-[#FAFAFA]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tags Subfilter */}
        {allTags.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <Tag className="w-3 h-3 text-[#52525B] flex-shrink-0 mr-1" />
            <button
              onClick={() => setSelectedTag('all')}
              className={`text-[11px] font-mono px-2 py-0.5 rounded border transition-all flex-shrink-0 ${
                selectedTag === 'all'
                  ? 'bg-white/15 text-white border-white/40 font-medium'
                  : 'bg-[#09090B] text-[#71717A] border-[#222226] hover:text-white'
              }`}
            >
              All Tags
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? 'all' : tag)}
                className={`text-[11px] font-mono px-2 py-0.5 rounded border transition-all flex-shrink-0 ${
                  selectedTag === tag
                    ? 'bg-white/15 text-white border-white/40 font-medium'
                    : 'bg-[#09090B] text-[#71717A] border-[#222226] hover:text-white'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Resources Grid */}
      {filteredResources.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-[#121215] border border-dashed border-[#222226]">
          <FolderArchive className="w-8 h-8 text-[#52525B] mx-auto mb-2" />
          <p className="text-xs text-[#71717A]">No materials matched your query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredResources.map((res) => {
            const isOwner = res.userId === currentUser.id;
            return (
              <div
                key={res.id}
                className="p-4 rounded-xl bg-[#121215] border border-[#222226] hover:border-[#2E2E35] flex flex-col justify-between transition-all group relative"
              >
                <div>
                  {/* Top line with type badge and date */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#1C1C21] border border-[#222226] flex items-center justify-center flex-shrink-0">
                        {getResourceIcon(res.type)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717A]">
                          {res.type.toUpperCase()}
                        </span>
                        {res.fileSize && (
                          <span className="text-[10px] font-mono text-[#52525B]">
                            {res.fileSize}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {isOwner && (
                        <button
                          onClick={() => deleteResource(res.id)}
                          title="Delete Material"
                          className="p-1 rounded text-[#71717A] hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xs font-bold text-[#FAFAFA] group-hover:text-white transition-colors line-clamp-2">
                    {res.title}
                  </h3>
                  {res.description && (
                    <p className="text-[11px] text-[#71717A] line-clamp-2 mt-1 font-sans">
                      {res.description}
                    </p>
                  )}

                  {/* Tags */}
                  {res.tags && res.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {res.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#09090B] text-[#71717A] border border-[#222226]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Row: Uploader and Action Button */}
                <div className="mt-4 pt-3 border-t border-[#222226] flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <UserAvatar user={res.user || currentUser} size="xs" showStatus={false} />
                    <span className="text-[10px] font-mono text-[#71717A]">
                      {res.user?.fullName || currentUser.fullName}
                    </span>
                  </div>

                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 rounded-md bg-[#1C1C21] border border-[#2E2E35] text-xs font-mono text-white hover:bg-[#25252B] flex items-center gap-1.5 transition-colors"
                  >
                    {res.type === 'pdf' ? (
                      <>
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-3 h-3" />
                        <span>Access</span>
                      </>
                    )}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Resource Modal */}
      <AddResourceModal />
    </div>
  );
};
