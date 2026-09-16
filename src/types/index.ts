export type CategoryType = 'Theory' | 'Practice' | 'Revision' | 'Deep Work' | 'Lecture' | 'Problem Solving';

export interface User {
  id: string;
  username: string;
  fullName: string;
  avatarUrl?: string;
  isOnline?: boolean;
  isStudying?: boolean;
  currentTask?: string;
  currentCategory?: CategoryType;
  streakDays: number;
  createdAt: string;
}

export interface Community {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  bannerColor?: string;
  createdAt: string;
  groupCount?: number;
}

export interface GroupMember {
  id: string;
  userId: string;
  groupId: string;
  role: 'admin' | 'moderator' | 'member';
  user: User;
}

export interface Group {
  id: string;
  communityId: string;
  name: string;
  description: string;
  iconName?: string;
  createdAt: string;
  membersCount: number;
  activeStudyingCount: number;
}

export interface Attachment {
  id: string;
  messageId: string;
  fileUrl: string;
  fileType: 'image' | 'video' | 'document';
  fileName: string;
  fileSize: number;
  thumbnailUrl?: string;
}

export interface MessageReaction {
  id: string;
  messageId: string;
  userId: string;
  userName: string;
  emoji: string;
}

export interface LinkPreview {
  url: string;
  title: string;
  description?: string;
  siteName?: string;
  imageUrl?: string;
}

export interface StudySessionBroadcast {
  sessionId: string;
  durationSec: number;
  title: string;
  category: CategoryType;
  startedAt: string;
  endedAt: string;
}

export interface Message {
  id: string;
  groupId: string;
  userId: string;
  user: User;
  content: string | null;
  replyToId?: string | null;
  replyTo?: {
    id: string;
    userName: string;
    content: string;
  } | null;
  isEdited?: boolean;
  isPinned?: boolean;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt?: string;
  attachments?: Attachment[];
  reactions: MessageReaction[];
  linkPreview?: LinkPreview | null;
  sessionBroadcast?: StudySessionBroadcast | null;
}

export interface StudySession {
  id: string;
  userId: string;
  groupId: string;
  title: string;
  category: CategoryType;
  durationSec: number;
  startedAt: string;
  endedAt: string;
  user?: User;
}

export type ResourceType = 'pdf' | 'link' | 'cheatsheet' | 'notes';

export interface Resource {
  id: string;
  groupId: string;
  userId: string;
  user?: User;
  title: string;
  description?: string;
  url: string;
  type: ResourceType;
  tags: string[];
  fileSize?: string;
  downloadsCount?: number;
  createdAt: string;
}

export type ActiveTab = 'leaderboard' | 'discussions' | 'vault';
export type TimeframeFilter = 'today' | 'week' | 'all-time';
export type TimerMode = 'pomodoro' | 'stopwatch';
export type TimerStatus = 'idle' | 'running' | 'paused' | 'break';

export interface LeaderboardEntry {
  rank: number;
  user: User;
  totalDurationSec: number;
  sessionsCount: number;
  streakDays: number;
  isStudying: boolean;
  currentTask?: string;
}
