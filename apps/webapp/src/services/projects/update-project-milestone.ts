import type { ProjectMilestone } from '@tegonhq/types';

import { updateProjectMilestone } from '@tegonhq/services';
import { useMutation } from 'react-query';

interface MutationParams {
  onMutate?: () => void;
  onSuccess?: (data: ProjectMilestone) => void;
  onError?: (error: string) => void;
}

export function useUpdateProjectMilestoneMutation({
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

  const onMutationSuccess = (data: ProjectMilestone) => {
    onSuccess && onSuccess(data);
  };

  return useMutation(updateProjectMilestone, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
