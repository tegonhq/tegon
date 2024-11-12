import { IsString } from 'class-validator';

import { ConversationHistory } from './conversation-history.entity';
import { Issue } from '../issue';
import { Project } from '../project';

export class ConversationHistoryParamsDto {
  @IsString()
  conversationHistoryId: string;
}

export class pageContext {
  id: string;
  location?: string[];
}
export class ConversationContextIds {
  pages?: pageContext[];
  activityIds?: string[];
}

export class PreviousHistory {
  conversation: ConversationHistory;
}

export class ConversationContext {
  issues: Issue[];
  projects: Project[];
  previousHistory: PreviousHistory;
}
