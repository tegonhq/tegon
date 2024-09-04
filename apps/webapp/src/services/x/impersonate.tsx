import { useMutation } from 'react-query';

import { ajaxPost } from 'services/utils';

export interface ImpersonateParams {
  userId: string;
  key: string;
}

export function impersonate(data: ImpersonateParams) {
  return ajaxPost({
    url: `/api/v1/users/impersonate`,
    data,
  });
}

interface MutationParams {
  onMutate?: () => void;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useImpersonateMutation({
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

  const onMutationSuccess = () => {
    onSuccess && onSuccess();
  };

  return useMutation(impersonate, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
