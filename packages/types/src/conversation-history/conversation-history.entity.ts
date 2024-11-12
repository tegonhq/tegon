import { JsonValue } from '../common';
import { Conversation } from '../conversation';

export enum UserTypeEnum {
  Agent = 'Agent',
  User = 'User',
  System = 'System',
}

export const UserType = {
  Agent: 'Agent',
  User: 'User',
  System: 'System',
};

export type UserType = (typeof UserType)[keyof typeof UserType];

export class ConversationHistory {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: Date | null;

  message: string;
  userType: UserType;

  context?: JsonValue | null;
  thoughts: JsonValue;
  userId?: string | null;

  conversation?: Conversation | null;
  conversationId: string;
}
