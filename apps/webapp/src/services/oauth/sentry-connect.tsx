import { useMutation } from 'react-query';

import { ajaxPost } from 'services/utils';

export interface SentryConnectParams {
  installationId: string;
  workspaceId: string;
  code: string;
  orgSlug: string;
}

export interface SentryConnectResponse {
  status: boolean;
  orgSlug: string;
  appSlug: string;
}

export function connectSentry(params: SentryConnectParams) {
  return ajaxPost({
    url: '/api/v1/oauth/callback/sentry',
    data: params,
  });
}

interface MutationParams {
  onMutate?: () => void;
  onSuccess?: (data: SentryConnectResponse) => void;
  onError?: (error: string) => void;
}

export function useSentryConnectMutation({
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

  const onMutationSuccess = (data: SentryConnectResponse) => {
    console.log(data);
    onSuccess && onSuccess(data);
  };

  return useMutation(connectSentry, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
