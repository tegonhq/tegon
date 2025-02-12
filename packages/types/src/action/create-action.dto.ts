import { ActionConfig } from './action.entity';

export interface CreateActionDto {
  config: ActionConfig;
  version: string;
  isPersonal?: boolean;
}
