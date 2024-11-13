import { updateTeamPreferences } from '@tegonhq/services';
import { useMutation } from 'react-query';

import type { TeamType } from 'common/types';

interface MutationParams {
  onMutate?: () => void;
  onSuccess?: (team: TeamType) => void;
  onError?: (error: string) => void;
}

export function useUpdateTeamPreferencesMutation({
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

  const onMutationSuccess = (team: TeamType) => {
    onSuccess && onSuccess(team);
  };

  return useMutation(updateTeamPreferences, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
