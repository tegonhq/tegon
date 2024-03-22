/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { useMutation } from 'react-query';

import { ajaxDelete } from 'common/lib/ajax';

export interface DeleteIssueHistoryParams {
  issueHistoryId: string;
}

export function deleteIssueHistory({
  issueHistoryId,
}: DeleteIssueHistoryParams) {
  return ajaxDelete({
    url: `/api/v1/issue_history/${issueHistoryId}`,
  });
}

interface MutationParams {
  onMutate?: () => void;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useDeleteIssueHistoryMutation({
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

  return useMutation(deleteIssueHistory, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
