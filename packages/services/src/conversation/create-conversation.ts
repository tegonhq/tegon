import { CreateConversationDto } from '@tegonhq/types';
import axios from 'axios';

export async function createConversation(
  createComversationDto: CreateConversationDto,
) {
  const response = await axios.post(
    `/api/v1/conversations`,
    createComversationDto,
  );

  return response.data;
}
