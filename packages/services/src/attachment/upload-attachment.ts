import { AttachmentResponse } from '@tegonhq/types';
import axios from 'axios';

export async function uploadAttachment(
  workspaceId: string,
  formData: any,
): Promise<AttachmentResponse[]> {
  const response = await axios.post(
    `/api/v1/attachment/upload?workspaceId=${workspaceId}`,
    formData,
    {
      headers: { ...formData.getHeaders() },
    },
  );

  return response.data;
}
