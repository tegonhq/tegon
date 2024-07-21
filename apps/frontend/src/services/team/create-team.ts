import { useMutation } from 'react-query';

import { ajaxPost } from 'common/lib/ajax';
import type { TeamType } from 'common/types/team';

export interface CreateTeamParams {
  name: string;
  identifier: string;
  workspaceId: string;
}

export function createTeam({ workspaceId, ...data }: CreateTeamParams) {
  return ajaxPost({
    url: `/api/v1/teams?workspaceId=${workspaceId}`,
    data,
  });
}

export interface MutationParams {
  onMutate?: () => void;
  onSuccess?: (data: TeamType) => void;
  onError?: (error: string) => void;
}

export function useCreateTeamMutation({
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

  const onMutationSuccess = (data: TeamType) => {
    onSuccess && onSuccess(data);
  };

  return useMutation(createTeam, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
