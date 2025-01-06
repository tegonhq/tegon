import type { UserType } from '@tegonhq/types';

export interface ConversationType {
  id: string;
  createdAt: string;
  updatedAt: string;

  title: string;
  userId: string;
  workspaceId: string;
}

export interface ConversationHistoryType {
  id: string;
  createdAt: string;
  updatedAt: string;

  message: string;
  userType: UserType;
  context: string;
  thoughts: string;
  userId?: string;
  conversationId: string;
}
