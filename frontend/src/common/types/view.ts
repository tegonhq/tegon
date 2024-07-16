import type { FiltersModelType } from 'store/application';

export interface ViewType {
  id: string;
  createdAt: string;
  updatedAt: string;
  filters: FiltersModelType;
  workspaceId: string;
  name: string;
  description: string;
  isBookmarked: boolean;
  createdById: string;
  teamId?: string;
}
