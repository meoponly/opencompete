import React, { useState } from 'react';
import {
  Search,
  Plus,
  Megaphone,
  Users,
  Filter,
  CheckCheck,
  FolderPlus,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../lib/store';
import { Group } from '../../types';

export const ChatListPane: React.FC<{
  onOpenCreateGroup: () => void;
}> = ({ onOpenCreateGroup }) => {
  const {
    selectedCommunity,
    groups,
    selectedGroup,
    setSelectedGroup,
    currentUser,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'announcements'>('all');

  // Filter groups in the active community
  const communityGroups = groups.filter((g) => g.communityId === selectedCommunity.id);

  const filteredGroups = communityGroups.filter((g) => {
    if (filterType === 'announcements' && !g.isAnnouncementGroup) return false;
    if (filterType === 'unread' && (!g.unreadCount || g.unreadCount === 0)) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = g.name.toLowerCase().includes(q);
      const matchDesc = g.description?.toLowerCase().includes(q);
      if (!matchName && !matchDesc) return false;
    }

    return true;
  });

  return (
    <div className="w-80 md:w-88 h-full bg-[#09090B] border-r border-[#222226] flex flex-col select-none flex-shrink-0">
      {/* Top Header: Community Meta */}
      <div className="p-4 border-b border-[#222226] flex items-center justify-between bg-[#09090B]">
        <div className="flex items-center gap-3 truncate">
          <div className="w-10 h-10 rounded-2xl overflow-hidden bg-[#121215] border border-[#222226] flex items-center justify-center flex-shrink-0">
            {selectedCommunity.avatarUrl ? (
              <img src={selectedCommunity.avatarUrl} alt={selectedCommunity.name} className="w-full h-full object-cover" />
            ) : (
              <Users className="w-5 h-5 text-white" />
            )}
          </div>
          <div className="flex flex-col truncate">
            <h2 className="text-sm font-bold text-white tracking-tight truncate">
              {selectedCommunity.name}
            </h2>
            <span className="text-[10px] font-mono text-[#71717A] truncate">
              {communityGroups.length} Sub-groups
            </span>
          </div>
        </div>

        {/* New Group Button */}
        <button
          onClick={onOpenCreateGroup}
          title="Create Sub-Group in Community"
          className="p-2 rounded-xl bg-[#121215] border border-[#222226] text-[#71717A] hover:text-white hover:border-[#2E2E35] transition-colors flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Search & Filter Pills */}
      <div className="p-3 border-b border-[#222226] space-y-2.5">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#52525B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sub-groups..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#121215] border border-[#222226] focus:border-[#3F3F46] rounded-xl text-white placeholder:text-[#52525B] focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          <button
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 text-[11px] font-mono rounded-lg border transition-all ${
              filterType === 'all'
                ? 'bg-white text-black font-semibold'
                : 'bg-[#121215] text-[#71717A] border-[#222226] hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('announcements')}
            className={`px-2.5 py-1 text-[11px] font-mono rounded-lg border transition-all flex items-center gap-1 ${
              filterType === 'announcements'
                ? 'bg-amber-400 text-black font-semibold'
                : 'bg-[#121215] text-[#71717A] border-[#222226] hover:text-white'
            }`}
          >
            <Megaphone className="w-3 h-3" />
            Announcements
          </button>
          <button
            onClick={() => setFilterType('unread')}
            className={`px-2.5 py-1 text-[11px] font-mono rounded-lg border transition-all ${
              filterType === 'unread'
                ? 'bg-white text-black font-semibold'
                : 'bg-[#121215] text-[#71717A] border-[#222226] hover:text-white'
            }`}
          >
            Unread
          </button>
        </div>
      </div>

      {/* Sub-Groups Scroll List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-[#222226]/50">
        {filteredGroups.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-xs text-[#52525B] font-mono">No sub-groups match filter</p>
          </div>
        ) : (
          filteredGroups.map((grp) => {
            const isSelected = selectedGroup.id === grp.id;
            return (
              <div
                key={grp.id}
                onClick={() => setSelectedGroup(grp)}
                className={`p-3 flex items-start gap-3 cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-[#121215] border-l-2 border-white'
                    : 'hover:bg-[#121215]/50 border-l-2 border-transparent'
                }`}
              >
                {/* Group Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-11 h-11 rounded-full overflow-hidden bg-[#17171C] border border-[#222226] flex items-center justify-center">
                    {grp.avatarUrl ? (
                      <img src={grp.avatarUrl} alt={grp.name} className="w-full h-full object-cover" />
                    ) : grp.isAnnouncementGroup ? (
                      <Megaphone className="w-5 h-5 text-amber-400" />
                    ) : (
                      <Users className="w-5 h-5 text-[#71717A]" />
                    )}
                  </div>
                  {grp.isAnnouncementGroup && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-[#09090B] flex items-center justify-center text-[7px] font-bold text-black">
                      📢
                    </span>
                  )}
                </div>

                {/* Info & Last Message Snippet */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h3
                      className={`text-xs truncate ${
                        isSelected ? 'font-bold text-white' : 'font-medium text-[#FAFAFA]'
                      }`}
                    >
                      {grp.name}
                    </h3>
                    <span className="text-[10px] font-mono text-[#52525B] flex-shrink-0">
                      {grp.lastMessage
                        ? new Date(grp.lastMessage.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : ''}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#71717A] truncate font-sans">
                    {grp.lastMessage ? (
                      <span>
                        <span className="font-mono text-white/80 font-medium">
                          {grp.lastMessage.user.fullName || grp.lastMessage.user.username}:{' '}
                        </span>
                        {grp.lastMessage.content || 'Attached media/document'}
                      </span>
                    ) : (
                      grp.description || 'Tap to start discussion'
                    )}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
