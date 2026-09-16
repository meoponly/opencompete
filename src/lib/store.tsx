import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import {
  User,
  Community,
  Group,
  GroupPermissions,
  Message,
  Attachment,
  UserRole,
} from '../types';
import { INITIAL_COMMUNITIES, INITIAL_GROUPS } from './mockData';
import { soundEngine } from './audio';
import {
  auth,
  signInWithGoogle,
  logOutUser,
  saveUserProfile,
  fetchUserProfile,
  subscribeToAllUsers,
  subscribeToSquadMessages,
  pushRealtimeMessage,
  updateRealtimeMessage,
} from './firebase';

interface StoreContextType {
  // Auth & Profile (Google OAuth)
  currentUser: User | null;
  authLoading: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;

  // Theme
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;

  // Communities & Groups
  communities: Community[];
  selectedCommunity: Community;
  setSelectedCommunity: (c: Community) => void;
  groups: Group[];
  selectedGroup: Group;
  setSelectedGroup: (g: Group) => void;
  allUsers: User[];

  createCommunity: (data: { name: string; description: string; avatarUrl?: string }) => Promise<void>;
  createGroup: (data: { communityId: string; name: string; description: string; isAnnouncementGroup?: boolean }) => Promise<void>;
  updateGroupInfo: (groupId: string, data: { name?: string; description?: string; avatarUrl?: string }) => Promise<void>;
  updateGroupPermissions: (groupId: string, permissions: GroupPermissions) => Promise<void>;
  promoteMember: (groupId: string, userId: string, role: UserRole) => Promise<void>;
  demoteMember: (groupId: string, userId: string) => Promise<void>;
  removeMember: (groupId: string, userId: string) => Promise<void>;
  toggleMuteGroup: (groupId: string) => Promise<void>;
  leaveGroup: (groupId: string) => Promise<void>;
  getUserRoleInGroup: (groupId: string, userId: string) => UserRole;

  // Realtime Discussions
  messages: Message[];
  typingUsers: string[];
  replyingToMessage: Message | null;
  setReplyingToMessage: (msg: Message | null) => void;
  sendMessage: (groupId: string, content: string, attachments?: Attachment[], replyToId?: string | null) => Promise<void>;
  editMessage: (groupId: string, messageId: string, newContent: string) => Promise<void>;
  deleteMessage: (groupId: string, messageId: string) => Promise<void>;
  togglePinMessage: (groupId: string, messageId: string) => Promise<void>;
  toggleReaction: (groupId: string, messageId: string, emoji: string) => Promise<void>;

  // Media Lightbox
  previewImage: string | null;
  setPreviewImage: (url: string | null) => void;
  previewVideo: string | null;
  setPreviewVideo: (url: string | null) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('opencompete_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Theme state
  const [theme, setThemeState] = useState<'dark' | 'light'>('dark');

  const setTheme = (t: 'dark' | 'light') => {
    setThemeState(t);
    localStorage.setItem('opencompete_theme', t);
    if (t === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  };

  useEffect(() => {
    const savedTheme = (localStorage.getItem('opencompete_theme') as 'dark' | 'light') || 'dark';
    setTheme(savedTheme);
  }, []);

  // Communities & Groups
  const [communities, setCommunities] = useState<Community[]>(() => {
    const saved = localStorage.getItem('opencompete_communities');
    return saved ? JSON.parse(saved) : INITIAL_COMMUNITIES;
  });

  const [selectedCommunity, setSelectedCommunity] = useState<Community>(() => {
    return communities[0] || INITIAL_COMMUNITIES[0];
  });

  const [groups, setGroups] = useState<Group[]>(() => {
    const saved = localStorage.getItem('opencompete_groups');
    return saved ? JSON.parse(saved) : INITIAL_GROUPS;
  });

  const [selectedGroup, setSelectedGroup] = useState<Group>(() => {
    const commGroups = groups.filter((g) => g.communityId === selectedCommunity.id);
    return commGroups[0] || groups[0] || INITIAL_GROUPS[0];
  });

  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [replyingToMessage, setReplyingToMessage] = useState<Message | null>(null);

  // Lightbox
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);

  // Save communities and groups
  useEffect(() => {
    localStorage.setItem('opencompete_communities', JSON.stringify(communities));
  }, [communities]);

  useEffect(() => {
    localStorage.setItem('opencompete_groups', JSON.stringify(groups));
  }, [groups]);

  // Firebase Google OAuth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      setAuthLoading(true);
      if (fbUser) {
        const profile = await fetchUserProfile(fbUser.uid);
        if (profile && profile.fullName && profile.username) {
          setCurrentUser(profile);
          setIsAuthModalOpen(false);
          setIsOnboardingOpen(false);
          localStorage.setItem('opencompete_user', JSON.stringify(profile));
        } else {
          const initialUser: User = {
            id: fbUser.uid,
            email: fbUser.email || '',
            username: fbUser.email?.split('@')[0]?.toLowerCase().replace(/[^a-z0-9_]/g, '') || `student_${fbUser.uid.slice(0, 5)}`,
            fullName: fbUser.displayName || '',
            avatarUrl: fbUser.photoURL || '',
            streakDays: 1,
            isOnline: true,
            createdAt: new Date().toISOString(),
          };
          setCurrentUser(initialUser);
          setIsAuthModalOpen(false);
          setIsOnboardingOpen(true);
        }
      } else {
        setCurrentUser(null);
        localStorage.removeItem('opencompete_user');
        setIsAuthModalOpen(true);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sync users
  useEffect(() => {
    const unsub = subscribeToAllUsers((usersList) => {
      if (usersList && usersList.length > 0) {
        setAllUsers(usersList);
      } else if (currentUser) {
        setAllUsers([currentUser]);
      }
    });
    return () => unsub();
  }, [currentUser?.id]);

  // Sync realtime messages for selected group
  useEffect(() => {
    const unsub = subscribeToSquadMessages(selectedGroup.id, (data) => {
      if (data && typeof data === 'object') {
        const msgList: Message[] = Object.values(data);
        msgList.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        setMessages(msgList);

        // Update lastMessage on selectedGroup
        if (msgList.length > 0) {
          const last = msgList[msgList.length - 1];
          setGroups((prev) =>
            prev.map((g) => (g.id === selectedGroup.id ? { ...g, lastMessage: last } : g))
          );
        }
      } else {
        setMessages([]);
      }
    });
    return () => unsub();
  }, [selectedGroup.id]);

  // Auto switch group if community changes
  useEffect(() => {
    const commGroups = groups.filter((g) => g.communityId === selectedCommunity.id);
    if (commGroups.length > 0 && !commGroups.some((g) => g.id === selectedGroup.id)) {
      setSelectedGroup(commGroups[0]);
    }
  }, [selectedCommunity, groups]);

  // Google Auth Methods
  const loginWithGoogle = async () => {
    await signInWithGoogle();
  };

  const logout = async () => {
    await logOutUser();
    setCurrentUser(null);
    setIsAuthModalOpen(true);
  };

  const updateUserProfile = async (data: Partial<User>) => {
    if (!currentUser) return;
    const updated: User = {
      ...currentUser,
      ...data,
    };
    setCurrentUser(updated);
    localStorage.setItem('opencompete_user', JSON.stringify(updated));
    await saveUserProfile(updated);
    setIsOnboardingOpen(false);
  };

  // Community & Group Management
  const createCommunity = async (data: { name: string; description: string; avatarUrl?: string }) => {
    if (!currentUser) return;
    const newComm: Community = {
      id: `comm_${Date.now()}`,
      name: data.name,
      slug: data.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      description: data.description,
      avatarUrl: data.avatarUrl,
      ownerId: currentUser.id,
      adminIds: [currentUser.id],
      createdAt: new Date().toISOString(),
    };

    // Default announcement group
    const defaultAnnounceGroup: Group = {
      id: `grp_${Date.now()}_announcements`,
      communityId: newComm.id,
      name: 'Announcements',
      description: `Official updates and announcements for ${newComm.name}`,
      isAnnouncementGroup: true,
      ownerId: currentUser.id,
      memberIds: [currentUser.id],
      adminIds: [currentUser.id],
      permissions: {
        sendMessages: 'admins_only',
        editGroupInfo: 'admins_only',
        addMembers: 'admins_only',
      },
      createdAt: new Date().toISOString(),
    };

    setCommunities((prev) => [...prev, newComm]);
    setGroups((prev) => [...prev, defaultAnnounceGroup]);
    setSelectedCommunity(newComm);
    setSelectedGroup(defaultAnnounceGroup);
  };

  const createGroup = async (data: {
    communityId: string;
    name: string;
    description: string;
    isAnnouncementGroup?: boolean;
  }) => {
    if (!currentUser) return;
    const newGrp: Group = {
      id: `grp_${Date.now()}`,
      communityId: data.communityId,
      name: data.name,
      description: data.description,
      isAnnouncementGroup: data.isAnnouncementGroup || false,
      ownerId: currentUser.id,
      memberIds: [currentUser.id],
      adminIds: [currentUser.id],
      permissions: {
        sendMessages: data.isAnnouncementGroup ? 'admins_only' : 'all',
        editGroupInfo: 'admins_only',
        addMembers: 'all',
      },
      createdAt: new Date().toISOString(),
    };
    setGroups((prev) => [...prev, newGrp]);
    setSelectedGroup(newGrp);
  };

  const updateGroupInfo = async (
    groupId: string,
    data: { name?: string; description?: string; avatarUrl?: string }
  ) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, ...data } : g))
    );
    if (selectedGroup.id === groupId) {
      setSelectedGroup((prev) => ({ ...prev, ...data }));
    }
  };

  const updateGroupPermissions = async (groupId: string, permissions: GroupPermissions) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, permissions } : g))
    );
    if (selectedGroup.id === groupId) {
      setSelectedGroup((prev) => ({ ...prev, permissions }));
    }
  };

  const getUserRoleInGroup = (groupId: string, userId: string): UserRole => {
    const grp = groups.find((g) => g.id === groupId);
    const comm = communities.find((c) => c.id === grp?.communityId);

    if (grp?.ownerId === userId || comm?.ownerId === userId) return 'owner';
    if (comm?.adminIds.includes(userId)) return 'community_admin';
    if (grp?.adminIds.includes(userId)) return 'group_admin';
    return 'member';
  };

  const promoteMember = async (groupId: string, userId: string, role: UserRole) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          const currentAdmins = g.adminIds || [];
          if (!currentAdmins.includes(userId)) {
            return { ...g, adminIds: [...currentAdmins, userId] };
          }
        }
        return g;
      })
    );
  };

  const demoteMember = async (groupId: string, userId: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          return { ...g, adminIds: (g.adminIds || []).filter((id) => id !== userId) };
        }
        return g;
      })
    );
  };

  const removeMember = async (groupId: string, userId: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          return {
            ...g,
            memberIds: (g.memberIds || []).filter((id) => id !== userId),
            adminIds: (g.adminIds || []).filter((id) => id !== userId),
          };
        }
        return g;
      })
    );
  };

  const toggleMuteGroup = async (groupId: string) => {
    if (!currentUser) return;
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          const settings = g.notificationSettings || {};
          const current = settings[currentUser.id] || { muted: false };
          return {
            ...g,
            notificationSettings: {
              ...settings,
              [currentUser.id]: { ...current, muted: !current.muted },
            },
          };
        }
        return g;
      })
    );
  };

  const leaveGroup = async (groupId: string) => {
    if (!currentUser) return;
    await removeMember(groupId, currentUser.id);
  };

  // Discussions & Messaging
  const parseLinkPreview = (text: string) => {
    const urlMatch = text.match(/(https?:\/\/[^\s]+)/g);
    if (!urlMatch) return null;
    const url = urlMatch[0];
    try {
      const parsed = new URL(url);
      return {
        url,
        title: parsed.hostname.includes('github')
          ? 'GitHub Repository'
          : parsed.hostname.includes('youtube')
          ? 'YouTube Video'
          : `Resource at ${parsed.hostname}`,
        description: 'Link shared in group discussion.',
        siteName: parsed.hostname,
      };
    } catch {
      return null;
    }
  };

  const sendMessage = async (
    groupId: string,
    content: string,
    attachments?: Attachment[],
    replyToId?: string | null
  ) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    soundEngine.playMessageSent();
    const linkPreview = parseLinkPreview(content);

    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      groupId,
      userId: currentUser.id,
      user: currentUser,
      content: content.trim() || null,
      replyToId: replyToId || null,
      replyTo: replyingToMessage
        ? {
            id: replyingToMessage.id,
            userName: replyingToMessage.user.fullName || replyingToMessage.user.username,
            content: replyingToMessage.content || 'Media / Document',
          }
        : null,
      attachments: attachments || [],
      reactions: [],
      linkPreview,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setReplyingToMessage(null);
    await pushRealtimeMessage(groupId, newMsg);
  };

  const editMessage = async (groupId: string, messageId: string, newContent: string) => {
    const linkPreview = parseLinkPreview(newContent);
    const updates = {
      content: newContent,
      isEdited: true,
      linkPreview,
      updatedAt: new Date().toISOString(),
    };
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, ...updates } : m))
    );
    await updateRealtimeMessage(groupId, messageId, updates);
  };

  const deleteMessage = async (groupId: string, messageId: string) => {
    if (!currentUser) return;
    const myRole = getUserRoleInGroup(groupId, currentUser.id);

    const updates = {
      isDeleted: true,
      content: null,
      attachments: [],
      linkPreview: null,
      deletedBy: {
        userId: currentUser.id,
        userName: currentUser.fullName || currentUser.username,
        role: myRole,
      },
    };

    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, ...updates } : m))
    );
    await updateRealtimeMessage(groupId, messageId, updates);
  };

  const togglePinMessage = async (groupId: string, messageId: string) => {
    const target = messages.find((m) => m.id === messageId);
    if (!target) return;
    const newPinned = !target.isPinned;
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, isPinned: newPinned } : m))
    );
    await updateRealtimeMessage(groupId, messageId, { isPinned: newPinned });
  };

  const toggleReaction = async (groupId: string, messageId: string, emoji: string) => {
    if (!currentUser) return;
    soundEngine.playMessageReceived();

    const target = messages.find((m) => m.id === messageId);
    if (!target) return;

    const exists = target.reactions?.find((r) => r.userId === currentUser.id && r.emoji === emoji);
    let newReactions = target.reactions ? [...target.reactions] : [];

    if (exists) {
      newReactions = newReactions.filter((r) => !(r.userId === currentUser.id && r.emoji === emoji));
    } else {
      newReactions.push({
        id: `r_${Date.now()}`,
        messageId,
        userId: currentUser.id,
        userName: currentUser.fullName || currentUser.username,
        emoji,
      });
    }

    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, reactions: newReactions } : m))
    );
    await updateRealtimeMessage(groupId, messageId, { reactions: newReactions });
  };

  return (
    <StoreContext.Provider
      value={{
        currentUser,
        authLoading,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isOnboardingOpen,
        setIsOnboardingOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        loginWithGoogle,
        logout,
        updateUserProfile,

        theme,
        setTheme,

        communities,
        selectedCommunity,
        setSelectedCommunity,
        groups,
        selectedGroup,
        setSelectedGroup,
        allUsers,

        createCommunity,
        createGroup,
        updateGroupInfo,
        updateGroupPermissions,
        promoteMember,
        demoteMember,
        removeMember,
        toggleMuteGroup,
        leaveGroup,
        getUserRoleInGroup,

        messages,
        typingUsers,
        replyingToMessage,
        setReplyingToMessage,
        sendMessage,
        editMessage,
        deleteMessage,
        togglePinMessage,
        toggleReaction,

        previewImage,
        setPreviewImage,
        previewVideo,
        setPreviewVideo,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
