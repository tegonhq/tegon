import axios from 'axios';

export interface RunAction {
  slug: string;
  workspaceId: string;
  payload: any;
}

export async function createRunAction({ slug, ...data }: RunAction) {
  const response = await axios.post(`/api/v1/action/${slug}/run`, data);

  return response.data;
}
