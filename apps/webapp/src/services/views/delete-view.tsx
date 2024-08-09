import { useMutation } from 'react-query';

import { ajaxDelete } from 'services/utils';

export interface DeleteViewParams {
  viewId: string;
}

export function deleteView({ viewId }: DeleteViewParams) {
  return ajaxDelete({
    url: `/api/v1/views/${viewId}`,
  });
}

interface MutationParams {
  onMutate?: () => void;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useDeleteViewMutation({
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

  const onMutationSuccess = () => {
    onSuccess && onSuccess();
  };

  return useMutation(deleteView, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
