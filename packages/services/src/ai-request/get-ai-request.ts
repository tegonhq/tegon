import type { GetAIRequestDTO } from '@tegonhq/types';

import axios from 'axios';

export async function getAIRequest(data: GetAIRequestDTO) {
  const response = await axios.post(`/api/v1/ai_requests`, data);

  return response.data;
}

export async function getAIRequestStream(data: GetAIRequestDTO) {
  const response = await axios.post(`/api/v1/ai_requests/stream`, data);

  return response.data;
}
