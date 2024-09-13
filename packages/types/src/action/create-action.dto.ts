import { ActionConfig } from './action.entity';

export interface CreateActionDto {
  config: ActionConfig;
  workspaceId: string;
  version: string;
  isDev?: boolean;
  isPersonal?: boolean;
}
