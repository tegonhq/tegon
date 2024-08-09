import type {
  IssueRequestParamsDto,
  TeamRequestParamsDto,
} from '@tegonhq/types';

import axios from 'axios';

export type MoveIssueToTeamParams = IssueRequestParamsDto &
  TeamRequestParamsDto;

export async function moveIssueToTeam({
  issueId,
  teamId,
}: MoveIssueToTeamParams) {
  const response = await axios.post(`/api/v1/issues/${issueId}/move`, {
    teamId,
  });

  return response.data;
}
