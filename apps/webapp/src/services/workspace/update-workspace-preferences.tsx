import { updateWorkspacePreferences } from '@tegonhq/services';
import { useMutation } from 'react-query';

import type { WorkspaceType } from 'common/types';

interface MutationParams {
  onMutate?: () => void;
  onSuccess?: (team: WorkspaceType) => void;
  onError?: (error: string) => void;
}

export function useUpdateWorkspacePreferencesMutation({
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

  const onMutationSuccess = (team: WorkspaceType) => {
    onSuccess && onSuccess(team);
  };

  return useMutation(updateWorkspacePreferences, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
