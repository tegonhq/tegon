/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { useMutation } from 'react-query';

import { ajaxPost } from 'common/lib/ajax';
import type { ViewType } from 'common/types/view';

import type { FiltersModelType } from 'store/application';

export interface CreateViewParams {
  name: string;
  description?: string;

  workspaceId: string;
  filters: FiltersModelType;
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

export interface MutationParams {
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
