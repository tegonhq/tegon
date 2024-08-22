import { useMutation } from 'react-query';

import type { IntegrationAccountType } from 'common/types';

import { ajaxPost } from 'services/utils';

export interface UpdateIntegrationAccountParams {
  integrationAccountId: string;
}

export function updateIntegrationAccount({
  integrationAccountId,
  ...params
}: UpdateIntegrationAccountParams) {
  return ajaxPost({
    url: `/api/v1/integration_account/${integrationAccountId}`,
    data: params,
  });
}

interface MutationParams {
  onMutate?: () => void;
  onSuccess?: (data: IntegrationAccountType) => void;
  onError?: (error: string) => void;
}

export function useUpdateIntegrationAccountMutation({
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

  const onMutationSuccess = (data: IntegrationAccountType) => {
    onSuccess && onSuccess(data);
  };

  return useMutation(updateIntegrationAccount, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
