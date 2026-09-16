import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
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
import { INITIAL_COMMUNITIES, INITIAL_GROUPS } from './mockData';
import { soundEngine } from './audio';
import {
  auth,
  signUpUser,
  signInUser,
  logOutUser,
  saveUserProfile,
  fetchUserProfile,
  subscribeToAllUsers,
  subscribeToSquadMessages,
  subscribeToSquadSessions,
  subscribeToSquadResources,
  pushRealtimeMessage,
  updateRealtimeMessage,
  pushRealtimeSession,
  pushRealtimeResource,
} from './firebase';

interface StoreContextType {
  // Auth & Profile
  currentUser: User | null;
  authLoading: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;

  // Theme & Preferences
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;

  // Navigation & Communities
  communities: Community[];
  selectedCommunity: Community;
  setSelectedCommunity: (c: Community) => void;
  groups: Group[];
  selectedGroup: Group;
  setSelectedGroup: (g: Group) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  allUsers: User[];

  // Focus Timer
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

  // Discussions Chat
  messages: Message[];
  typingUsers: string[];
  replyingToMessage: Message | null;
  setReplyingToMessage: (msg: Message | null) => void;
  sendMessage: (content: string, attachments?: Attachment[]) => void;
  editMessage: (messageId: string, newContent: string) => void;
  deleteMessage: (messageId: string) => void;
  togglePinMessage: (messageId: string) => void;
  toggleReaction: (messageId: string, emoji: string) => void;

  // Resource Vault
  resources: Resource[];
  addResource: (resource: Omit<Resource, 'id' | 'createdAt' | 'userId' | 'user' | 'downloadsCount' | 'groupId'>) => void;
  deleteResource: (id: string) => void;

  // Leaderboard
  timeframe: TimeframeFilter;
  setTimeframe: (tf: TimeframeFilter) => void;
  selectedCategoryFilter: string;
  setSelectedCategoryFilter: (cat: string) => void;
  leaderboardEntries: LeaderboardEntry[];

  // Media Modals
  previewImage: string | null;
  setPreviewImage: (url: string | null) => void;
  previewVideo: string | null;
  setPreviewVideo: (url: string | null) => void;
  isAddResourceOpen: boolean;
  setIsAddResourceOpen: (open: boolean) => void;
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
  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('opencompete_theme');
    return (saved as 'dark' | 'light') || 'dark';
  });

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
    setTheme(theme);
  }, []);

  // Navigation
  const [communities] = useState<Community[]>(INITIAL_COMMUNITIES);
  const [selectedCommunity, setSelectedCommunity] = useState<Community>(INITIAL_COMMUNITIES[0]);
  const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS);
  const [selectedGroup, setSelectedGroup] = useState<Group>(() => {
    return INITIAL_GROUPS.find((g) => g.communityId === INITIAL_COMMUNITIES[0].id) || INITIAL_GROUPS[0];
  });
  const [activeTab, setActiveTab] = useState<ActiveTab>('discussions');
  const [allUsers, setAllUsers] = useState<User[]>([]);

  // Focus Timer
  const [timerMode, setTimerMode] = useState<TimerMode>('pomodoro');
  const [timerStatus, setTimerStatus] = useState<TimerStatus>('idle');
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [timerTargetSeconds, setTimerTargetSeconds] = useState<number>(25 * 60);
  const [timerTaskTitle, setTimerTaskTitle] = useState<string>('Focused Study Session');
  const [timerCategory, setTimerCategory] = useState<CategoryType>('Practice');
  const [isTimerModalOpen, setIsTimerModalOpen] = useState<boolean>(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);

  // Discussions, Sessions & Vault
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [replyingToMessage, setReplyingToMessage] = useState<Message | null>(null);

  // Leaderboard filters
  const [timeframe, setTimeframe] = useState<TimeframeFilter>('today');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  // Media Modals
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const [isAddResourceOpen, setIsAddResourceOpen] = useState<boolean>(false);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      setAuthLoading(true);
      if (fbUser) {
        // Fetch or create profile
        const profile = await fetchUserProfile(fbUser.uid);
        if (profile && profile.fullName && profile.username) {
          setCurrentUser(profile);
          setIsAuthModalOpen(false);
          setIsOnboardingOpen(false);
          localStorage.setItem('opencompete_user', JSON.stringify(profile));
        } else {
          // Incomplete profile -> trigger onboarding
          const initialUser: User = {
            id: fbUser.uid,
            email: fbUser.email || '',
            username: fbUser.email?.split('@')[0] || `student_${fbUser.uid.slice(0, 5)}`,
            fullName: fbUser.displayName || '',
            avatarUrl: fbUser.photoURL || '',
            streakDays: 0,
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

  // Listen to all users in Firebase
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

  // Listen to Realtime Messages in selected group
  useEffect(() => {
    const unsub = subscribeToSquadMessages(selectedGroup.id, (data) => {
      if (data && typeof data === 'object') {
        const msgList: Message[] = Object.values(data);
        msgList.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        setMessages(msgList);
      } else {
        setMessages([]);
      }
    });
    return () => unsub();
  }, [selectedGroup.id]);

  // Listen to Realtime Sessions in selected group
  useEffect(() => {
    const unsub = subscribeToSquadSessions(selectedGroup.id, (data) => {
      if (data && typeof data === 'object') {
        const sessList: StudySession[] = Object.values(data);
        setSessions(sessList);
      } else {
        setSessions([]);
      }
    });
    return () => unsub();
  }, [selectedGroup.id]);

  // Listen to Realtime Resources in selected group
  useEffect(() => {
    const unsub = subscribeToSquadResources(selectedGroup.id, (data) => {
      if (data && typeof data === 'object') {
        const resList: Resource[] = Object.values(data);
        setResources(resList);
      } else {
        setResources([]);
      }
    });
    return () => unsub();
  }, [selectedGroup.id]);

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

  // Auth Operations
  const loginWithEmail = async (email: string, pass: string) => {
    await signInUser(email, pass);
  };

  const registerWithEmail = async (email: string, pass: string) => {
    await signUpUser(email, pass);
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

  // Timer actions
  const startTimer = () => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setTimerStatus('running');
    const updatedUser = {
      ...currentUser,
      isStudying: true,
      currentTask: timerTaskTitle,
      currentCategory: timerCategory,
    };
    setCurrentUser(updatedUser);
    saveUserProfile(updatedUser);
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
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        isStudying: false,
      };
      setCurrentUser(updatedUser);
      saveUserProfile(updatedUser);
    }
  };

  const completeTimerSession = () => {
    if (!currentUser) return;
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
      reactions: [],
    };

    setMessages((prev) => [...prev, broadcastMsg]);
    pushRealtimeMessage(selectedGroup.id, broadcastMsg);

    // Reset timer & update user streak
    setTimerStatus('idle');
    setTimerSeconds(0);
    const updatedUser: User = {
      ...currentUser,
      isStudying: false,
      streakDays: (currentUser.streakDays || 0) + 1,
    };
    setCurrentUser(updatedUser);
    saveUserProfile(updatedUser);
  };

  // Discussions Chat Actions
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

  const sendMessage = async (content: string, attachments?: Attachment[]) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
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
    await pushRealtimeMessage(selectedGroup.id, newMsg);
  };

  const editMessage = async (messageId: string, newContent: string) => {
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
    await updateRealtimeMessage(selectedGroup.id, messageId, updates);
  };

  const deleteMessage = async (messageId: string) => {
    const updates = {
      isDeleted: true,
      content: null,
      attachments: [],
      linkPreview: null,
    };
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, ...updates } : m))
    );
    await updateRealtimeMessage(selectedGroup.id, messageId, updates);
  };

  const togglePinMessage = async (messageId: string) => {
    const target = messages.find((m) => m.id === messageId);
    if (!target) return;
    const newPinned = !target.isPinned;
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, isPinned: newPinned } : m))
    );
    await updateRealtimeMessage(selectedGroup.id, messageId, { isPinned: newPinned });
  };

  const toggleReaction = async (messageId: string, emoji: string) => {
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
        userName: currentUser.fullName,
        emoji,
      });
    }

    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, reactions: newReactions } : m))
    );
    await updateRealtimeMessage(selectedGroup.id, messageId, { reactions: newReactions });
  };

  // Vault Actions
  const addResource = async (resData: Omit<Resource, 'id' | 'createdAt' | 'userId' | 'user' | 'downloadsCount' | 'groupId'>) => {
    if (!currentUser) return;
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
    await pushRealtimeResource(selectedGroup.id, newRes);
  };

  const deleteResource = (id: string) => {
    setResources((prev) => prev.filter((r) => r.id !== id));
  };

  // Leaderboard Computations
  const computeLeaderboard = (): LeaderboardEntry[] => {
    const userTotals: { [userId: string]: { duration: number; count: number } } = {};

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
      return true;
    });

    relevantSessions.forEach((s) => {
      if (!userTotals[s.userId]) {
        userTotals[s.userId] = { duration: 0, count: 0 };
      }
      userTotals[s.userId].duration += s.durationSec;
      userTotals[s.userId].count += 1;
    });

    const userMap: { [id: string]: User } = {};
    if (currentUser) {
      userMap[currentUser.id] = currentUser;
    }
    allUsers.forEach((u) => {
      userMap[u.id] = u;
    });

    const entries: LeaderboardEntry[] = Object.values(userMap).map((u) => {
      const stats = userTotals[u.id] || { duration: 0, count: 0 };
      const isStudyingNow = u.id === currentUser?.id ? currentUser?.isStudying || false : (u.isStudying || false);
      return {
        rank: 0,
        user: u.id === currentUser?.id ? currentUser : u,
        totalDurationSec: stats.duration,
        sessionsCount: stats.count,
        streakDays: u.streakDays || 0,
        isStudying: isStudyingNow,
        currentTask: u.id === currentUser?.id ? currentUser?.currentTask : u.currentTask,
      };
    });

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
        authLoading,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isOnboardingOpen,
        setIsOnboardingOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        loginWithEmail,
        registerWithEmail,
        logout,
        updateUserProfile,

        theme,
        setTheme,

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

        messages,
        typingUsers,
        replyingToMessage,
        setReplyingToMessage,
        sendMessage,
        editMessage,
        deleteMessage,
        togglePinMessage,
        toggleReaction,

        resources,
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
