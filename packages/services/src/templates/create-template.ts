import type { CreateTemplateDto, Template } from '@tegonhq/types';

import axios from 'axios';

export async function createTemplate(
  data: CreateTemplateDto,
): Promise<Template> {
  const response = await axios.post(`/api/v1/templates`, data);

  return response.data;
}
