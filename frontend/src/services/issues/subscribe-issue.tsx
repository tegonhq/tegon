/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { useMutation } from 'react-query';

import { ajaxPost } from 'common/lib/ajax';
import type { SubscribeType } from 'common/types/issue';

export interface UpdateIssueSubscribeParams {
  type: SubscribeType;
  issueId: string;
}

export function updateIssueSubscribe({
  issueId,
  type,
}: UpdateIssueSubscribeParams) {
  return ajaxPost({
    url: `/api/v1/issues/${issueId}/subscribe`,
    data: {
      type,
    },
  });
}

interface MutationParams {
  onMutate?: () => void;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useUpdateIssueSubscribeMutation({
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

  return useMutation(updateIssueSubscribe, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
