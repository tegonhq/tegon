import { CreateConversationHistoryDto } from '@tegonhq/types';
import axios from 'axios';

export async function createConversationHistory(
  createComversationHistoryDto: CreateConversationHistoryDto,
) {
  const response = await axios.post(
    `/api/v1/conversation_history`,
    createComversationHistoryDto,
  );

  return response.data;
}
