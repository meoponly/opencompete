import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  Community,
  Group,
  Message,
  StudySession,
  Resource,
  ActiveTab,
  TimeframeFilter,
  TimerMode,
  TimerStatus,
  CategoryType,
  LeaderboardEntry,
  Attachment,
} from '../types';
import {
  CURRENT_USER,
  MOCK_USERS,
  MOCK_COMMUNITIES,
  MOCK_GROUPS,
  MOCK_SESSIONS,
  MOCK_MESSAGES,
  MOCK_RESOURCES,
} from './mockData';
import { soundEngine } from './audio';
import { initFirebaseAuth, pushRealtimeMessage, pushRealtimeSession } from './firebase';

interface StoreContextType {
  // Navigation & Hierarchy
  currentUser: User;
  setCurrentUser: (user: User) => void;
  communities: Community[];
  selectedCommunity: Community;
  setSelectedCommunity: (c: Community) => void;
  groups: Group[];
  selectedGroup: Group;
  setSelectedGroup: (g: Group) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  allUsers: User[];

  // Timer & Focus State
  timerMode: TimerMode;
  setTimerMode: (m: TimerMode) => void;
  timerStatus: TimerStatus;
  timerSeconds: number;
  timerTargetSeconds: number;
  setTimerTargetSeconds: (sec: number) => void;
  timerTaskTitle: string;
  setTimerTaskTitle: (title: string) => void;
  timerCategory: CategoryType;
  setTimerCategory: (cat: CategoryType) => void;
  isTimerModalOpen: boolean;
  setIsTimerModalOpen: (open: boolean) => void;
  isSoundEnabled: boolean;
  setIsSoundEnabled: (enabled: boolean) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  completeTimerSession: () => void;

  // Discussions Chat State
  messages: Message[];
  typingUsers: string[];
  replyingToMessage: Message | null;
  setReplyingToMessage: (msg: Message | null) => void;
  sendMessage: (content: string, attachments?: Attachment[]) => void;
  editMessage: (messageId: string, newContent: string) => void;
  deleteMessage: (messageId: string) => void;
  togglePinMessage: (messageId: string) => void;
  toggleReaction: (messageId: string, emoji: string) => void;

  // Vault State
  resources: Resource[];
  addResource: (resource: Omit<Resource, 'id' | 'createdAt' | 'userId' | 'user' | 'downloadsCount' | 'groupId'>) => void;
  deleteResource: (id: string) => void;

  // Leaderboard Data
  timeframe: TimeframeFilter;
  setTimeframe: (tf: TimeframeFilter) => void;
  selectedCategoryFilter: string;
  setSelectedCategoryFilter: (cat: string) => void;
  leaderboardEntries: LeaderboardEntry[];

  // UI Lightbox / Modals
  previewImage: string | null;
  setPreviewImage: (url: string | null) => void;
  previewVideo: string | null;
  setPreviewVideo: (url: string | null) => void;
  isAddResourceOpen: boolean;
  setIsAddResourceOpen: (open: boolean) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // User & Navigation
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('opencompete_user');
    return saved ? JSON.parse(saved) : CURRENT_USER;
  });

  const [communities] = useState<Community[]>(MOCK_COMMUNITIES);
  const [selectedCommunity, setSelectedCommunity] = useState<Community>(MOCK_COMMUNITIES[0]);
  
  const [groups, setGroups] = useState<Group[]>(MOCK_GROUPS);
  const [selectedGroup, setSelectedGroup] = useState<Group>(() => {
    return MOCK_GROUPS.find((g) => g.communityId === MOCK_COMMUNITIES[0].id) || MOCK_GROUPS[0];
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('discussions');
  const [allUsers, setAllUsers] = useState<User[]>(MOCK_USERS);

  // Focus Timer
  const [timerMode, setTimerMode] = useState<TimerMode>('pomodoro');
  const [timerStatus, setTimerStatus] = useState<TimerStatus>('idle');
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [timerTargetSeconds, setTimerTargetSeconds] = useState<number>(25 * 60); // 25 mins default
  const [timerTaskTitle, setTimerTaskTitle] = useState<string>('Quantum Angular Momentum Derivations');
  const [timerCategory, setTimerCategory] = useState<CategoryType>('Practice');
  const [isTimerModalOpen, setIsTimerModalOpen] = useState<boolean>(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);

  // Discussions State
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('opencompete_messages');
    return saved ? JSON.parse(saved) : MOCK_MESSAGES;
  });
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [replyingToMessage, setReplyingToMessage] = useState<Message | null>(null);

  // Sessions & Vault
  const [sessions, setSessions] = useState<StudySession[]>(() => {
    const saved = localStorage.getItem('opencompete_sessions');
    return saved ? JSON.parse(saved) : MOCK_SESSIONS;
  });

  const [resources, setResources] = useState<Resource[]>(() => {
    const saved = localStorage.getItem('opencompete_resources');
    return saved ? JSON.parse(saved) : MOCK_RESOURCES;
  });

  // Leaderboard filters
  const [timeframe, setTimeframe] = useState<TimeframeFilter>('today');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  // Media preview modals
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const [isAddResourceOpen, setIsAddResourceOpen] = useState<boolean>(false);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('opencompete_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('opencompete_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('opencompete_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('opencompete_resources', JSON.stringify(resources));
  }, [resources]);

  // Firebase auth initialization
  useEffect(() => {
    initFirebaseAuth((fbUser) => {
      if (fbUser) {
        console.log('Firebase ready with user:', fbUser.uid);
      }
    });
  }, []);

  // Update selected group when community changes
  useEffect(() => {
    const available = groups.filter((g) => g.communityId === selectedCommunity.id);
    if (available.length > 0 && !available.some((g) => g.id === selectedGroup.id)) {
      setSelectedGroup(available[0]);
    }
  }, [selectedCommunity, groups]);

  // Audio mute state
  useEffect(() => {
    soundEngine.setMuted(!isSoundEnabled);
  }, [isSoundEnabled]);

  // Timer Tick Engine
  useEffect(() => {
    let interval: any = null;
    if (timerStatus === 'running') {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (timerMode === 'pomodoro') {
            const next = prev + 1;
            if (next >= timerTargetSeconds) {
              completeTimerSession();
              return timerTargetSeconds;
            }
            return next;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerStatus, timerMode, timerTargetSeconds]);

  // Simulated peer typing & activity
  useEffect(() => {
    const timeout = setTimeout(() => {
      setTypingUsers(['Elena Rostova']);
      setTimeout(() => {
        setTypingUsers([]);
      }, 4000);
    }, 15000);
    return () => clearTimeout(timeout);
  }, [selectedGroup.id]);

  // Timer actions
  const startTimer = () => {
    setTimerStatus('running');
    setCurrentUser((prev) => ({
      ...prev,
      isStudying: true,
      currentTask: timerTaskTitle,
      currentCategory: timerCategory,
    }));
    soundEngine.playFocusStart();
  };

  const pauseTimer = () => {
    setTimerStatus('paused');
  };

  const resumeTimer = () => {
    setTimerStatus('running');
  };

  const resetTimer = () => {
    setTimerStatus('idle');
    setTimerSeconds(0);
    setCurrentUser((prev) => ({
      ...prev,
      isStudying: false,
    }));
  };

  const completeTimerSession = () => {
    const duration = timerSeconds > 0 ? timerSeconds : (timerMode === 'pomodoro' ? timerTargetSeconds : 1500);
    soundEngine.playSessionComplete();

    const newSession: StudySession = {
      id: `sess_${Date.now()}`,
      userId: currentUser.id,
      groupId: selectedGroup.id,
      title: timerTaskTitle || 'Focused Study Session',
      category: timerCategory,
      durationSec: duration,
      startedAt: new Date(Date.now() - duration * 1000).toISOString(),
      endedAt: new Date().toISOString(),
      user: currentUser,
    };

    setSessions((prev) => [newSession, ...prev]);
    pushRealtimeSession(selectedGroup.id, newSession);

    // Auto broadcast session card into group discussions
    const broadcastMsg: Message = {
      id: `msg_${Date.now()}`,
      groupId: selectedGroup.id,
      userId: currentUser.id,
      user: currentUser,
      content: null,
      sessionBroadcast: {
        sessionId: newSession.id,
        durationSec: duration,
        title: newSession.title,
        category: newSession.category,
        startedAt: newSession.startedAt,
        endedAt: newSession.endedAt,
      },
      createdAt: new Date().toISOString(),
      reactions: [
        { id: `r_${Date.now()}`, messageId: `msg_${Date.now()}`, userId: 'user_1', userName: 'Elena Rostova', emoji: '🔥' },
      ],
    };

    setMessages((prev) => [...prev, broadcastMsg]);
    pushRealtimeMessage(selectedGroup.id, broadcastMsg);

    // Reset timer
    setTimerStatus('idle');
    setTimerSeconds(0);
    setCurrentUser((prev) => ({
      ...prev,
      isStudying: false,
      streakDays: prev.streakDays + 1,
    }));
  };

  // Discussion Actions
  const parseLinkPreview = (text: string) => {
    const urlMatch = text.match(/(https?:\/\/[^\s]+)/g);
    if (!urlMatch) return null;
    const url = urlMatch[0];
    try {
      const parsed = new URL(url);
      return {
        url,
        title: parsed.hostname.includes('mit.edu') 
          ? 'MIT OpenCourseWare Academic Repository' 
          : parsed.hostname.includes('github') 
            ? 'GitHub Repository' 
            : `Resource at ${parsed.hostname}`,
        description: 'Reference link shared by study squad member.',
        siteName: parsed.hostname,
        imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
      };
    } catch {
      return null;
    }
  };

  const sendMessage = (content: string, attachments?: Attachment[]) => {
    if (!content.trim() && (!attachments || attachments.length === 0)) return;

    soundEngine.playMessageSent();

    const linkPreview = parseLinkPreview(content);

    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      groupId: selectedGroup.id,
      userId: currentUser.id,
      user: currentUser,
      content: content.trim() || null,
      replyToId: replyingToMessage ? replyingToMessage.id : null,
      replyTo: replyingToMessage
        ? {
            id: replyingToMessage.id,
            userName: replyingToMessage.user.fullName,
            content: replyingToMessage.content || (replyingToMessage.sessionBroadcast ? `Logged ${Math.round(replyingToMessage.sessionBroadcast.durationSec / 60)}m on ${replyingToMessage.sessionBroadcast.title}` : 'Media Attachment'),
          }
        : null,
      attachments: attachments || [],
      reactions: [],
      linkPreview,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setReplyingToMessage(null);
    pushRealtimeMessage(selectedGroup.id, newMsg);
  };

  const editMessage = (messageId: string, newContent: string) => {
    const linkPreview = parseLinkPreview(newContent);
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId
          ? {
              ...m,
              content: newContent,
              isEdited: true,
              linkPreview,
              updatedAt: new Date().toISOString(),
            }
          : m
      )
    );
  };

  const deleteMessage = (messageId: string) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === messageId) {
          return {
            ...m,
            isDeleted: true,
            content: null,
            attachments: [],
            linkPreview: null,
          };
        }
        return m;
      })
    );
  };

  const togglePinMessage = (messageId: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, isPinned: !m.isPinned } : m))
    );
  };

  const toggleReaction = (messageId: string, emoji: string) => {
    soundEngine.playMessageReceived();
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== messageId) return m;
        const exists = m.reactions.find((r) => r.userId === currentUser.id && r.emoji === emoji);
        let newReactions;
        if (exists) {
          newReactions = m.reactions.filter((r) => !(r.userId === currentUser.id && r.emoji === emoji));
        } else {
          newReactions = [
            ...m.reactions,
            {
              id: `r_${Date.now()}`,
              messageId,
              userId: currentUser.id,
              userName: currentUser.fullName,
              emoji,
            },
          ];
        }
        return { ...m, reactions: newReactions };
      })
    );
  };

  // Vault Actions
  const addResource = (resData: Omit<Resource, 'id' | 'createdAt' | 'userId' | 'user' | 'downloadsCount' | 'groupId'>) => {
    const newRes: Resource = {
      ...resData,
      id: `res_${Date.now()}`,
      groupId: selectedGroup.id,
      userId: currentUser.id,
      user: currentUser,
      downloadsCount: 0,
      createdAt: new Date().toISOString(),
    };
    setResources((prev) => [newRes, ...prev]);
    setIsAddResourceOpen(false);
  };

  const deleteResource = (id: string) => {
    setResources((prev) => prev.filter((r) => r.id !== id));
  };

  // Computed Leaderboard Entries
  const computeLeaderboard = (): LeaderboardEntry[] => {
    const userTotals: { [userId: string]: { duration: number; count: number } } = {};

    // Group sessions for the selected group
    const relevantSessions = sessions.filter((s) => {
      if (s.groupId !== selectedGroup.id) return false;
      if (selectedCategoryFilter !== 'All' && s.category !== selectedCategoryFilter) return false;

      const sessionDate = new Date(s.endedAt || s.startedAt);
      const now = new Date();

      if (timeframe === 'today') {
        return sessionDate.toDateString() === now.toDateString();
      } else if (timeframe === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return sessionDate >= weekAgo;
      }
      return true; // all-time
    });

    relevantSessions.forEach((s) => {
      if (!userTotals[s.userId]) {
        userTotals[s.userId] = { duration: 0, count: 0 };
      }
      userTotals[s.userId].duration += s.durationSec;
      userTotals[s.userId].count += 1;
    });

    const entries: LeaderboardEntry[] = allUsers.map((u) => {
      const stats = userTotals[u.id] || { duration: 0, count: 0 };
      const isStudyingNow = u.id === currentUser.id ? currentUser.isStudying || false : (u.isStudying || false);
      return {
        rank: 0,
        user: u.id === currentUser.id ? currentUser : u,
        totalDurationSec: stats.duration,
        sessionsCount: stats.count,
        streakDays: u.streakDays,
        isStudying: isStudyingNow,
        currentTask: u.id === currentUser.id ? currentUser.currentTask : u.currentTask,
      };
    });

    // Sort by duration descending, then streak
    entries.sort((a, b) => {
      if (b.totalDurationSec !== a.totalDurationSec) {
        return b.totalDurationSec - a.totalDurationSec;
      }
      return b.streakDays - a.streakDays;
    });

    return entries.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
  };

  const leaderboardEntries = computeLeaderboard();

  return (
    <StoreContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        communities,
        selectedCommunity,
        setSelectedCommunity,
        groups: groups.filter((g) => g.communityId === selectedCommunity.id),
        selectedGroup,
        setSelectedGroup,
        activeTab,
        setActiveTab,
        allUsers,

        timerMode,
        setTimerMode,
        timerStatus,
        timerSeconds,
        timerTargetSeconds,
        setTimerTargetSeconds,
        timerTaskTitle,
        setTimerTaskTitle,
        timerCategory,
        setTimerCategory,
        isTimerModalOpen,
        setIsTimerModalOpen,
        isSoundEnabled,
        setIsSoundEnabled,
        startTimer,
        pauseTimer,
        resumeTimer,
        resetTimer,
        completeTimerSession,

        messages: messages.filter((m) => m.groupId === selectedGroup.id),
        typingUsers,
        replyingToMessage,
        setReplyingToMessage,
        sendMessage,
        editMessage,
        deleteMessage,
        togglePinMessage,
        toggleReaction,

        resources: resources.filter((r) => r.groupId === selectedGroup.id),
        addResource,
        deleteResource,

        timeframe,
        setTimeframe,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        leaderboardEntries,

        previewImage,
        setPreviewImage,
        previewVideo,
        setPreviewVideo,
        isAddResourceOpen,
        setIsAddResourceOpen,
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
