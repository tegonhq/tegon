import type {
  GetTeamByNameDto,
  Team,
  TeamRequestParamsDto,
  WorkspaceRequestParamsDto,
} from '@tegonhq/types';

import axios from 'axios';

export async function getTeamById({
  teamId,
}: TeamRequestParamsDto): Promise<Team> {
  const response = await axios.get(`/api/v1/teams/${teamId}`);

  return response.data;
}

export async function getTeams({
  workspaceId,
}: WorkspaceRequestParamsDto): Promise<Team[]> {
  const response = await axios.get(`/api/v1/teams?workspaceId=${workspaceId}`);

  return response.data;
}

export async function getTeamByName({ slug, workspaceId }: GetTeamByNameDto) {
  const response = await axios.get(
    `/api/v1/teams/name/${slug}?workspaceId=${workspaceId}`,
  );

  return response.data;
}
