/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { useMutation } from 'react-query';

import { ajaxPost } from 'common/lib/ajax';
import { LabelType } from 'common/types/label';

export interface CreateLabelParams {
  name: string;
  labelId: string;
}

export function updateLabel(params: CreateLabelParams) {
  const { labelId, ...otherParams } = params;

  return ajaxPost({
    url: `/api/v1/labels/${labelId}`,
    data: otherParams,
  });
}

export interface MutationParams {
  onMutate?: () => void;
  onSuccess?: (data: LabelType) => void;
  onError?: (error: string) => void;
}

export function useUpdateLabelMutation({
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

  return useMutation(updateLabel, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
