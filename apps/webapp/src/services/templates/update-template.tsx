import type { Template } from '@tegonhq/types';

import { updateTemplate } from '@tegonhq/services';
import { useMutation } from 'react-query';

interface MutationParams {
  onMutate?: () => void;
  onSuccess?: (data: Template) => void;
  onError?: (error: string) => void;
}

export function useUpdateTemplateMutation({
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

  const onMutationSuccess = (data: Template) => {
    onSuccess && onSuccess(data);
  };

  return useMutation(updateTemplate, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
