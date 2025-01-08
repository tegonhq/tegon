export interface TemplateType {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  category: string;
  workspaceId: string;
  teamId?: string;
  templateData: string;
}
