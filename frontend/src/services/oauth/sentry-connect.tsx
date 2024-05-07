/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { useMutation } from 'react-query';

import { ajaxPost } from 'common/lib/ajax';

export interface SentryConnectParams {
  installationId: string;
  workspaceId: string;
  code: string;
  orgSlug: string;
}

export interface SentryConnectResponse {
  status: boolean;
}

export function connectSentry(params: SentryConnectParams) {
  return ajaxPost({
    url: '/api/v1/sentry/callback',
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
    onSuccess && onSuccess(data);
  };

  return useMutation(connectSentry, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
