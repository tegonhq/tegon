import type { Pat } from '@tegonhq/types';

import { deletePat } from '@tegonhq/services';
import { useMutation, useQueryClient } from 'react-query';

import { GetPats } from './get-pats';

interface MutationParams {
  onMutate?: () => void;
  onSuccess?: (data: Pat) => void;
  onError?: (error: string) => void;
}

export function useDeletePatMutation({
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

  const onMutationSuccess = (data: Pat) => {
    queryClient.invalidateQueries({ queryKey: [GetPats] });
    onSuccess && onSuccess(data);
  };

  return useMutation(deletePat, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
