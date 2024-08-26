import { createRunAction } from '@tegonhq/services';
import { useMutation, useQueryClient } from 'react-query';

import type { ActionType } from 'common/types';

import { GetRunsForAction } from './get-runs-for-action';

interface MutationParams {
  onMutate?: () => void;
  onSuccess?: (data: ActionType) => void;
  onError?: (error: string) => void;
}

export function useRunActionMutation({
  onMutate,
  onSuccess,
  onError,
}: MutationParams) {
  const queryClient = useQueryClient();

  const onMutationTriggered = () => {
    onMutate && onMutate();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onMutationError = (errorResponse: any) => {
    const errorText = errorResponse?.errors?.message || 'Error occured';

    onError && onError(errorText);
  };

  const onMutationSuccess = (data: ActionType) => {
    queryClient.invalidateQueries({ queryKey: [GetRunsForAction] });
    onSuccess && onSuccess(data);
  };

  return useMutation(createRunAction, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
