export type TeamTypeInterface = 'engineering' | 'support';

export interface TeamPreferences {
  cyclesEnabled?: boolean;
  teamType?: string;
}

export interface TeamType {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  identifier: string;
  workspaceId: string;
  currentCycle?: number;
  preferences: TeamPreferences;
}

export interface WorkflowType {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  position: number;
  description?: string;
  color: string;
  category: string;
  teamId: string;

  // For processed purpose
  ids?: string[];
}
