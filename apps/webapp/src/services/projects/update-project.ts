import type { Project } from '@tegonhq/types';

import { updateProject } from '@tegonhq/services';
import { useMutation } from 'react-query';

export interface MutationParams {
  onMutate?: () => void;
  onSuccess?: (data: Project) => void;
  onError?: (error: string) => void;
}

export function useUpdateProjectMutation({
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

  const onMutationSuccess = (data: Project) => {
    onSuccess && onSuccess(data);
  };

  return useMutation(updateProject, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
