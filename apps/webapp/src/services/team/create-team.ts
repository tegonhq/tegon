import type { Team } from '@tegonhq/types';

import { createTeam } from '@tegonhq/services';
import { useMutation } from 'react-query';

export interface MutationParams {
  onMutate?: () => void;
  onSuccess?: (data: Team) => void;
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

  const onMutationSuccess = (data: Team) => {
    onSuccess && onSuccess(data);
  };

  return useMutation(createTeam, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
