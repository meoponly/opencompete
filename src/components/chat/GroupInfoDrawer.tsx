import React, { useState } from 'react';
import {
  X,
  Users,
  Shield,
  ShieldAlert,
  Bell,
  BellOff,
  Image as ImageIcon,
  FileText,
  Link as LinkIcon,
  ChevronRight,
  UserCheck,
  UserX,
  LogOut,
  Trash2,
  Lock,
  Unlock,
  Check,
  Edit2,
  Tag,
  Download,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { useStore } from '../../lib/store';
import { Group, User, MediaTabType, UserRole } from '../../types';
import { UserAvatar } from '../common/UserAvatar';

export const GroupInfoDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const {
    selectedGroup,
    selectedCommunity,
    currentUser,
    allUsers,
    messages,
    updateGroupInfo,
    updateGroupPermissions,
    promoteMember,
    demoteMember,
    removeMember,
    toggleMuteGroup,
    leaveGroup,
    getUserRoleInGroup,
    setPreviewImage,
  } = useStore();

  const [activeMediaTab, setActiveMediaTab] = useState<MediaTabType>('media');
  const [isEditingName, setIsEditingName] = useState(false);
  const [groupName, setGroupName] = useState(selectedGroup.name);
  const [groupDesc, setGroupDesc] = useState(selectedGroup.description || '');
  const [participantSearch, setParticipantSearch] = useState('');
  const [selectedDocTag, setSelectedDocTag] = useState<string>('all');

  if (!isOpen) return null;

  const myRole = currentUser ? getUserRoleInGroup(selectedGroup.id, currentUser.id) : 'member';
  const isAdmin = myRole === 'owner' || myRole === 'community_admin' || myRole === 'group_admin';
  const isMuted = currentUser && selectedGroup.notificationSettings?.[currentUser.id]?.muted;

  // Extract shared media, docs, and links from messages
  const allAttachments = messages.flatMap((m) => m.attachments || []);
  const sharedMedia = allAttachments.filter((a) => a.fileType === 'image' || a.fileType === 'video');
  const sharedDocs = allAttachments.filter((a) => a.fileType === 'document');
  const sharedLinks = messages.filter((m) => m.linkPreview).map((m) => m.linkPreview!);

  const allDocTags = Array.from(new Set(sharedDocs.flatMap((d) => d.tags || [])));

  const filteredDocs = sharedDocs.filter((d) => {
    if (selectedDocTag === 'all') return true;
    return d.tags?.includes(selectedDocTag);
  });

  // Collect participants
  const participants: { user: User; role: UserRole }[] = allUsers.map((u) => {
    return {
      user: u,
      role: getUserRoleInGroup(selectedGroup.id, u.id),
    };
  });

  const filteredParticipants = participants.filter((p) => {
    if (!participantSearch.trim()) return true;
    const q = participantSearch.toLowerCase();
    return (
      p.user.fullName.toLowerCase().includes(q) ||
      p.user.username.toLowerCase().includes(q)
    );
  });

  const handleSaveInfo = async () => {
    await updateGroupInfo(selectedGroup.id, {
      name: groupName.trim(),
      description: groupDesc.trim(),
    });
    setIsEditingName(false);
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'owner':
        return (
          <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-800/40 font-semibold">
            Owner
          </span>
        );
      case 'community_admin':
        return (
          <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-purple-950/40 text-purple-300 border border-purple-800/40 font-semibold">
            Community Admin
          </span>
        );
      case 'group_admin':
        return (
          <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-800/40 font-semibold">
            Group Admin
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <aside className="w-80 md:w-96 h-full bg-[#121215] border-l border-[#222226] flex flex-col flex-shrink-0 z-30 animate-in slide-in-from-right duration-200 overflow-hidden select-none">
      {/* Drawer Header */}
      <div className="h-14 px-4 border-b border-[#222226] flex items-center justify-between bg-[#09090B]">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-white" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white">Group Info</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-[#71717A] hover:text-white hover:bg-[#1C1C21] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Drawer Body Scroll */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
        {/* Group Hero Profile */}
        <div className="flex flex-col items-center text-center pb-4 border-b border-[#222226]">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-[#17171C] border-2 border-[#2E2E35] mb-3 flex items-center justify-center">
            {selectedGroup.avatarUrl ? (
              <img src={selectedGroup.avatarUrl} alt={selectedGroup.name} className="w-full h-full object-cover" />
            ) : (
              <Users className="w-8 h-8 text-[#71717A]" />
            )}
          </div>

          {isEditingName ? (
            <div className="w-full space-y-2">
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-[#09090B] border border-[#222226] focus:border-white/40 rounded-lg text-white font-semibold text-center"
              />
              <textarea
                value={groupDesc}
                onChange={(e) => setGroupDesc(e.target.value)}
                placeholder="Group description..."
                rows={2}
                className="w-full p-2 text-xs bg-[#09090B] border border-[#222226] focus:border-white/40 rounded-lg text-[#FAFAFA] resize-none text-center"
              />
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={handleSaveInfo}
                  className="px-3 py-1 rounded bg-white text-black text-xs font-semibold flex items-center gap-1"
                >
                  <Check className="w-3 h-3" /> Save
                </button>
                <button
                  onClick={() => setIsEditingName(false)}
                  className="px-3 py-1 rounded bg-[#1C1C21] text-[#71717A] text-xs hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-bold text-white tracking-tight">{selectedGroup.name}</h2>
                {isAdmin && (
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="p-1 rounded text-[#71717A] hover:text-white"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                )}
              </div>
              <p className="text-xs text-[#71717A] mt-1 font-sans">
                {selectedGroup.description || 'No group description provided.'}
              </p>
              <span className="text-[10px] font-mono text-[#52525B] mt-2">
                Part of {selectedCommunity.name} • Created {new Date(selectedGroup.createdAt).toLocaleDateString()}
              </span>
            </>
          )}
        </div>

        {/* Notification Controls */}
        <div className="p-3 rounded-xl bg-[#09090B] border border-[#222226] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {isMuted ? (
              <BellOff className="w-4 h-4 text-amber-400" />
            ) : (
              <Bell className="w-4 h-4 text-[#71717A]" />
            )}
            <div className="flex flex-col">
              <span className="text-xs font-medium text-white">Mute Notifications</span>
              <span className="text-[10px] text-[#71717A] font-mono">
                {isMuted ? 'Muted' : 'Unmuted'}
              </span>
            </div>
          </div>
          <button
            onClick={() => toggleMuteGroup(selectedGroup.id)}
            className={`px-3 py-1 text-xs font-mono rounded-lg border transition-all ${
              isMuted
                ? 'bg-amber-950/40 text-amber-300 border-amber-800/40'
                : 'bg-[#1C1C21] text-[#71717A] border-[#222226] hover:text-white'
            }`}
          >
            {isMuted ? 'Unmute' : 'Mute'}
          </button>
        </div>

        {/* Shared Media, Links & Docs Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-mono tracking-wider text-[#71717A]">
              Media, Links & Docs
            </span>
            <span className="text-[10px] font-mono text-[#52525B]">
              {allAttachments.length + sharedLinks.length} Items
            </span>
          </div>

          {/* Subtabs */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-[#09090B] border border-[#222226] rounded-lg">
            <button
              onClick={() => setActiveMediaTab('media')}
              className={`py-1 text-xs font-mono rounded transition-all flex items-center justify-center gap-1 ${
                activeMediaTab === 'media'
                  ? 'bg-[#1C1C21] text-white border border-[#2E2E35] font-semibold'
                  : 'text-[#71717A] hover:text-white'
              }`}
            >
              <ImageIcon className="w-3 h-3" />
              Media ({sharedMedia.length})
            </button>
            <button
              onClick={() => setActiveMediaTab('docs')}
              className={`py-1 text-xs font-mono rounded transition-all flex items-center justify-center gap-1 ${
                activeMediaTab === 'docs'
                  ? 'bg-[#1C1C21] text-white border border-[#2E2E35] font-semibold'
                  : 'text-[#71717A] hover:text-white'
              }`}
            >
              <FileText className="w-3 h-3" />
              Docs ({sharedDocs.length})
            </button>
            <button
              onClick={() => setActiveMediaTab('links')}
              className={`py-1 text-xs font-mono rounded transition-all flex items-center justify-center gap-1 ${
                activeMediaTab === 'links'
                  ? 'bg-[#1C1C21] text-white border border-[#2E2E35] font-semibold'
                  : 'text-[#71717A] hover:text-white'
              }`}
            >
              <LinkIcon className="w-3 h-3" />
              Links ({sharedLinks.length})
            </button>
          </div>

          {/* Tab Content */}
          {activeMediaTab === 'media' && (
            <div>
              {sharedMedia.length === 0 ? (
                <p className="text-xs text-[#52525B] text-center py-4 italic font-mono">
                  No images or videos shared yet
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-1.5 max-h-48 overflow-y-auto custom-scrollbar">
                  {sharedMedia.map((att) => (
                    <div
                      key={att.id}
                      onClick={() => setPreviewImage(att.fileUrl)}
                      className="aspect-square rounded-md overflow-hidden bg-[#09090B] border border-[#222226] cursor-pointer group"
                    >
                      <img
                        src={att.fileUrl}
                        alt={att.fileName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeMediaTab === 'docs' && (
            <div className="space-y-2">
              {allDocTags.length > 0 && (
                <div className="flex items-center gap-1 overflow-x-auto pb-1">
                  <Tag className="w-3 h-3 text-[#52525B] flex-shrink-0" />
                  <button
                    onClick={() => setSelectedDocTag('all')}
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-all ${
                      selectedDocTag === 'all'
                        ? 'bg-white text-black font-semibold'
                        : 'bg-[#09090B] text-[#71717A] border-[#222226]'
                    }`}
                  >
                    All
                  </button>
                  {allDocTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedDocTag(tag)}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-all ${
                        selectedDocTag === tag
                          ? 'bg-white text-black font-semibold'
                          : 'bg-[#09090B] text-[#71717A] border-[#222226]'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              )}

              {filteredDocs.length === 0 ? (
                <p className="text-xs text-[#52525B] text-center py-4 italic font-mono">
                  No documents found
                </p>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar">
                  {filteredDocs.map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-[#09090B] border border-[#222226] hover:border-[#2E2E35] flex items-center justify-between transition-colors group"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-rose-400 flex-shrink-0" />
                        <div className="flex flex-col truncate">
                          <span className="text-xs text-white group-hover:text-white truncate">
                            {doc.fileName}
                          </span>
                          {doc.tags && doc.tags.length > 0 && (
                            <div className="flex items-center gap-1 mt-0.5">
                              {doc.tags.map((t) => (
                                <span key={t} className="text-[9px] font-mono text-[#71717A]">
                                  #{t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <Download className="w-3.5 h-3.5 text-[#52525B] group-hover:text-white flex-shrink-0" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeMediaTab === 'links' && (
            <div>
              {sharedLinks.length === 0 ? (
                <p className="text-xs text-[#52525B] text-center py-4 italic font-mono">
                  No shared links yet
                </p>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar">
                  {sharedLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-[#09090B] border border-[#222226] hover:border-[#2E2E35] flex items-center justify-between transition-colors group"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <LinkIcon className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                        <div className="flex flex-col truncate">
                          <span className="text-xs text-white truncate font-medium">{link.title}</span>
                          <span className="text-[10px] text-[#71717A] truncate font-mono">
                            {link.siteName || link.url}
                          </span>
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-[#52525B] group-hover:text-white flex-shrink-0" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Group Permissions & Moderation (Admins Only) */}
        {isAdmin && (
          <div className="space-y-3 pt-3 border-t border-[#222226]">
            <span className="text-[11px] uppercase font-mono tracking-wider text-[#71717A] flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-white" />
              Group Permissions (Admin Controls)
            </span>

            <div className="p-3 rounded-xl bg-[#09090B] border border-[#222226] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs text-white font-medium">Send Messages</span>
                  <span className="text-[10px] text-[#71717A] font-mono">
                    {selectedGroup.permissions.sendMessages === 'admins_only' ? 'Admins only' : 'All members'}
                  </span>
                </div>
                <button
                  onClick={() =>
                    updateGroupPermissions(selectedGroup.id, {
                      ...selectedGroup.permissions,
                      sendMessages:
                        selectedGroup.permissions.sendMessages === 'admins_only' ? 'all' : 'admins_only',
                    })
                  }
                  className={`px-2.5 py-1 text-xs font-mono rounded-md border ${
                    selectedGroup.permissions.sendMessages === 'admins_only'
                      ? 'bg-rose-950/40 text-rose-300 border-rose-800/40'
                      : 'bg-[#1C1C21] text-[#FAFAFA] border-[#2E2E35]'
                  }`}
                >
                  {selectedGroup.permissions.sendMessages === 'admins_only' ? 'Admins Only' : 'All Members'}
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#222226]">
                <div className="flex flex-col">
                  <span className="text-xs text-white font-medium">Edit Group Info</span>
                  <span className="text-[10px] text-[#71717A] font-mono">
                    {selectedGroup.permissions.editGroupInfo === 'admins_only' ? 'Admins only' : 'All members'}
                  </span>
                </div>
                <button
                  onClick={() =>
                    updateGroupPermissions(selectedGroup.id, {
                      ...selectedGroup.permissions,
                      editGroupInfo:
                        selectedGroup.permissions.editGroupInfo === 'admins_only' ? 'all' : 'admins_only',
                    })
                  }
                  className={`px-2.5 py-1 text-xs font-mono rounded-md border ${
                    selectedGroup.permissions.editGroupInfo === 'admins_only'
                      ? 'bg-purple-950/40 text-purple-300 border-purple-800/40'
                      : 'bg-[#1C1C21] text-[#FAFAFA] border-[#2E2E35]'
                  }`}
                >
                  {selectedGroup.permissions.editGroupInfo === 'admins_only' ? 'Admins Only' : 'All Members'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Participants List */}
        <div className="space-y-3 pt-3 border-t border-[#222226]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-mono tracking-wider text-[#71717A]">
              {participants.length} Participants
            </span>
          </div>

          <input
            type="text"
            value={participantSearch}
            onChange={(e) => setParticipantSearch(e.target.value)}
            placeholder="Search participants..."
            className="w-full px-3 py-1.5 text-xs bg-[#09090B] border border-[#222226] focus:border-white/40 rounded-lg text-white placeholder:text-[#52525B] focus:outline-none"
          />

          <div className="space-y-1.5 max-h-56 overflow-y-auto custom-scrollbar">
            {filteredParticipants.map(({ user, role }) => {
              const isMe = user.id === currentUser?.id;
              return (
                <div
                  key={user.id}
                  className="p-2 rounded-lg bg-[#09090B] border border-[#222226] flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <UserAvatar user={user} size="sm" showStatus />
                    <div className="flex flex-col truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-white truncate">
                          {user.fullName}
                        </span>
                        {isMe && (
                          <span className="text-[9px] font-mono uppercase px-1 rounded bg-white text-black font-bold">
                            YOU
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-[#71717A] truncate">
                        @{user.username}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {getRoleBadge(role)}

                    {/* Admin Action Menu */}
                    {isAdmin && !isMe && role !== 'owner' && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {role === 'member' ? (
                          <button
                            onClick={() => promoteMember(selectedGroup.id, user.id, 'group_admin')}
                            title="Make Group Admin"
                            className="p-1 rounded text-[#71717A] hover:text-emerald-400 hover:bg-[#1C1C21]"
                          >
                            <Shield className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => demoteMember(selectedGroup.id, user.id)}
                            title="Dismiss as Admin"
                            className="p-1 rounded text-[#71717A] hover:text-amber-400 hover:bg-[#1C1C21]"
                          >
                            <ShieldAlert className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => removeMember(selectedGroup.id, user.id)}
                          title="Remove from Group"
                          className="p-1 rounded text-[#71717A] hover:text-rose-400 hover:bg-rose-950/40"
                        >
                          <UserX className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Exit / Leave Group */}
        <div className="pt-4 border-t border-[#222226]">
          <button
            onClick={() => leaveGroup(selectedGroup.id)}
            className="w-full py-2.5 px-3 rounded-xl bg-rose-950/30 border border-rose-800/40 text-rose-300 hover:bg-rose-950/50 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Leave {selectedGroup.name}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
