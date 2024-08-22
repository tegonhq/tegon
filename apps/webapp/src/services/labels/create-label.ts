import type { LabelType } from 'common/types';

import { useMutation } from 'react-query';

import { ajaxPost } from 'services/utils';

export interface CreateLabelParams {
  name: string;
  color: string;
  workspaceId: string;

  groupId?: string;
  teamId?: string;
}

export function createLabel(params: CreateLabelParams) {
  return ajaxPost({
    url: '/api/v1/labels',
    data: params,
  });
}

export interface MutationParams {
  onMutate?: () => void;
  onSuccess?: (data: LabelType) => void;
  onError?: (error: string) => void;
}

export function useCreateLabelMutation({
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

  const onMutationSuccess = (data: LabelType) => {
    onSuccess && onSuccess(data);
  };

  return useMutation(createLabel, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
