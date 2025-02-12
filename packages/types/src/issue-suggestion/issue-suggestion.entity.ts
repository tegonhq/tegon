import { Issue } from '../issue';

export class IssueSuggestion {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: Date | null;
  issueId: string;
  suggestedLabelIds: string[];
  suggestedAssigneeId: string | null;
  metadata: any | null;
  issue?: Issue | null;
}
