import axios from 'axios';

export async function suspendUser(updateData: { userId: string }) {
  const response = await axios.post(`/api/v1/workspaces/suspend`, updateData);

  return response.data;
}
