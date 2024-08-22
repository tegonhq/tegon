import { useMutation } from 'react-query';

import type { IssueCommentType } from 'common/types';

import { ajaxPost } from 'services/utils';

export interface UpdateIssueCommentParams {
  body: string;
  parentId?: string;
  issueCommentId: string;
}

export function updateIssueComment({
  issueCommentId,
  body,
  parentId,
}: UpdateIssueCommentParams) {
  return ajaxPost({
    url: `/api/v1/issue_comments/${issueCommentId}`,
    data: { body, parentId },
  });
}

interface MutationParams {
  onMutate?: () => void;
  onSuccess?: (data: IssueCommentType) => void;
  onError?: (error: string) => void;
}

export function useUpdateIssueCommentMutation({
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

  const onMutationSuccess = (data: IssueCommentType) => {
    onSuccess && onSuccess(data);
  };

  return useMutation(updateIssueComment, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
