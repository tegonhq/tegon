import { useMutation } from 'react-query';

import { ajaxDelete } from 'services/utils';

export interface DeleteLinkedIssueParams {
  linkedIssueId: string;
}

export function deleteLinkedIssue({ linkedIssueId }: DeleteLinkedIssueParams) {
  return ajaxDelete({
    url: `/api/v1/linked_issues/${linkedIssueId}`,
  });
}

interface MutationParams {
  onMutate?: () => void;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useDeleteLinkedIssueMutation({
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

  return useMutation(deleteLinkedIssue, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
