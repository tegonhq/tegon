/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { useMutation } from 'react-query';

import { ajaxPost } from 'common/lib/ajax';
import type {
  LinkedIssueSubType,
  LinkedIssueType,
} from 'common/types/linked-issue';

export interface CreateLinkedIssueParams {
  title?: string;
  url: string;
  type: LinkedIssueSubType;
  issueId: string;
  teamId: string;
}

export function createLinkedIssue({
  issueId,
  teamId,
  ...otherParams
}: CreateLinkedIssueParams) {
  return ajaxPost({
    url: `/api/v1/issues/${issueId}/link?teamId=${teamId}`,
    data: otherParams,
  });
}

interface MutationParams {
  onMutate?: () => void;
  onSuccess?: (data: LinkedIssueType) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError?: (error: any) => void;
}

export function useCreateLinkedIssueMutation({
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

  return useMutation(createLinkedIssue, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
