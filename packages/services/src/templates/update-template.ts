import type { Template, UpdateTemplateDto } from '@tegonhq/types';

import axios from 'axios';

interface UpdateTemplateDtoWithId extends UpdateTemplateDto {
  templateId: string;
}

export async function updateTemplate({
  templateId,
  ...data
}: UpdateTemplateDtoWithId): Promise<Template> {
  const response = await axios.post(`/api/v1/templates/${templateId}`, data);

  return response.data;
}
