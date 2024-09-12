import { ActionConfig } from './action.entity';

export interface DeleteActionDto {
  config: ActionConfig;
  workspaceId: string;
}
