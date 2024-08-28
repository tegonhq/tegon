import axios from 'axios';

export async function uploadAttachment(
  workspaceId: string,
  formData: any,
): Promise<string[]> {
  const response = await axios.post(
    `/api/v1/attachment/upload?workspaceId=${workspaceId}`,
    formData,
    {
      headers: { ...formData.getHeaders() },
    },
  );

  return response.data;
}
