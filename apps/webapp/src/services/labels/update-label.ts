import type { LabelType } from 'common/types';

import { useMutation } from 'react-query';

import { ajaxPost } from 'services/utils';

interface UpdateLabelParams {
  name: string;
  labelId: string;
}

export function updateLabel(params: UpdateLabelParams) {
  const { labelId, ...otherParams } = params;

  return ajaxPost({
    url: `/api/v1/labels/${labelId}`,
    data: otherParams,
  });
}

interface MutationParams {
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
