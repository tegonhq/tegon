import type { ViewType, FiltersModelType } from '@tegonhq/types';

import { useMutation } from 'react-query';

import { ajaxPost } from 'services/utils';

export interface CreateViewParams {
  workspaceId: string;
  filters: FiltersModelType;
  teamId?: string;
  name: string;
  description?: string;
}

export function createView({ workspaceId, ...otherParams }: CreateViewParams) {
  return ajaxPost({
    url: `/api/v1/views`,
    data: {
      workspaceId,
      ...otherParams,
    },
  });
}

interface MutationParams {
  onMutate?: () => void;
  onSuccess?: (data: ViewType) => void;
  onError?: (error: string) => void;
}

export function useCreateViewMutation({
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

  return useMutation(createView, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
