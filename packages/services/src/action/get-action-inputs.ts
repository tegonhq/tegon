import axios from 'axios';

export interface GetActionInputsProps {
  slug: string;
  workspaceId: string;
}

export async function getActionInputs({
  slug,
  workspaceId,
}: GetActionInputsProps) {
  const response = await axios.get(
    `/api/v1/action/${slug}/inputs?workspaceId=${workspaceId}`,
  );

  return response.data;
}
