export type UserRole = 'owner' | 'community_admin' | 'group_admin' | 'member';

export interface User {
  id: string;
  email?: string;
  username: string;
  fullName: string;
  avatarUrl?: string;
  bio?: string;
  themePreference?: 'dark' | 'light';
  isOnline?: boolean;
  isStudying?: boolean;
  currentTask?: string;
  streakDays: number;
  createdAt: string;
}

export interface Community {
  id: string;
  name: string;
  slug: string;
  description: string;
  avatarUrl?: string;
  coverUrl?: string;
  iconName?: string;
  ownerId: string;
  adminIds: string[];
  createdAt: string;
  groupsCount?: number;
}

export interface GroupPermissions {
  sendMessages: 'all' | 'admins_only';
  editGroupInfo: 'all' | 'admins_only';
  addMembers: 'all' | 'admins_only';
}

export interface GroupNotificationSettings {
  muted: boolean;
  muteUntil?: string; // '8h' | '1w' | 'always' | ISO date
  customAlertSound?: string;
}

export interface Group {
  id: string;
  communityId: string;
  name: string;
  description: string;
  avatarUrl?: string;
  isAnnouncementGroup?: boolean;
  ownerId: string;
  memberIds: string[];
  adminIds: string[];
  permissions: GroupPermissions;
  notificationSettings?: { [userId: string]: GroupNotificationSettings };
  createdAt: string;
  lastMessage?: Message;
  unreadCount?: number;
}

export interface Attachment {
  id: string;
  messageId: string;
  fileUrl: string;
  fileType: 'image' | 'video' | 'document' | 'audio';
  fileName: string;
  fileSize: number;
  thumbnailUrl?: string;
  tags?: string[]; // Tagging for documents and media
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
  deletedBy?: {
    userId: string;
    userName: string;
    role: string;
  };
  createdAt: string;
  updatedAt?: string;
  attachments?: Attachment[];
  reactions: MessageReaction[];
  linkPreview?: LinkPreview | null;
}

export type MediaTabType = 'media' | 'docs' | 'links';
