import type { LinkedIssueType } from '@tegonhq/types';

import { useMutation } from 'react-query';

import { ajaxPost } from 'services/utils';

export interface UpdateLinkedIssueParams {
  title?: string;
  url: string;
  linkedIssueId: string;
}

export function updateLinkedIssue({
  linkedIssueId,
  ...otherParams
}: UpdateLinkedIssueParams) {
  return ajaxPost({
    url: `/api/v1/linked_issues/${linkedIssueId}`,
    data: otherParams,
  });
}

interface MutationParams {
  onMutate?: () => void;
  onSuccess?: (data: LinkedIssueType) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError?: (error: any) => void;
}

export function useUpdateLinkedIssueMutation({
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

  const onMutationSuccess = (data: LinkedIssueType) => {
    onSuccess && onSuccess(data);
  };

  return useMutation(updateLinkedIssue, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
