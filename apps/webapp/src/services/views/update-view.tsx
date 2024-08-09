import type { ViewType, FiltersModelType } from '@tegonhq/types';

import { useMutation } from 'react-query';

import { ajaxPost } from 'services/utils';

export interface UpdateViewParams {
  name?: string;
  description?: string;
  filters: FiltersModelType;
  viewId: string;
  isBookmarked?: boolean;
}

export function updateView({ viewId, ...otherParams }: UpdateViewParams) {
  return ajaxPost({
    url: `/api/v1/views/${viewId}`,
    data: {
      ...otherParams,
    },
  });
}

interface MutationParams {
  onMutate?: () => void;
  onSuccess?: (data: ViewType) => void;
  onError?: (error: string) => void;
}

export function useUpdateViewMutation({
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

  const onMutationSuccess = (data: ViewType) => {
    onSuccess && onSuccess(data);
  };

  return useMutation(updateView, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
