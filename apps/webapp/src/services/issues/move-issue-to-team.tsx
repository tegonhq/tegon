import type { IssueType } from '@tegonhq/types';

import { useMutation } from 'react-query';

import { ajaxPost } from 'services/utils';

export interface MoveIssueToTeamParams {
  teamId: string;
  issueId: string;
}

export function moveIssueToTeam({ issueId, teamId }: MoveIssueToTeamParams) {
  return ajaxPost({
    url: `/api/v1/issues/${issueId}/move`,
    data: {
      teamId,
    },
  });
}

interface MutationParams {
  onMutate?: () => void;
  onSuccess?: (data: IssueType) => void;
  onError?: (error: string) => void;
}

export function useMoveIssueToTeamMutation({
  onMutate,
  onSuccess,
  onError,
}: MutationParams) {
  const onMutationTriggered = () => {
    onMutate && onMutate();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onMutationError = (errorResponse: any) => {
    const errorText = errorResponse?.errors?.message || 'Error occured';

    onError && onError(errorText);
  };

  const onMutationSuccess = (data: IssueType) => {
    onSuccess && onSuccess(data);
  };

  return useMutation(moveIssueToTeam, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
