import { ConversationHistory } from '../conversation-history';
import { User } from '../user';
import { Workspace } from '../workspace';

export class Conversation {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: Date | null;

  user?: User | null;
  userId: string;

  title: string;

  workspace?: Workspace | null;
  workspaceId: string;

  conversationHistory?: ConversationHistory[];
}
