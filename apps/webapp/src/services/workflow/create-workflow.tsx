import type { Workflow } from '@tegonhq/types';

import { createWorkflow } from '@tegonhq/services';
import { useMutation } from 'react-query';

interface MutationParams {
  onMutate?: () => void;
  onSuccess?: (data: Workflow) => void;
  onError?: (error: string) => void;
}

export function useCreateWorkflowMutation({
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

  const onMutationSuccess = (data: Workflow) => {
    onSuccess && onSuccess(data);
  };

  return useMutation(createWorkflow, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
