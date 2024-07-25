import { useMutation } from 'react-query';

import { ajaxDelete } from 'common/lib/ajax';

export interface DeleteIssueParams {
  issueId: string;
  teamId: string;
}

export function deleteIssue({ issueId, teamId }: DeleteIssueParams) {
  return ajaxDelete({
    url: `/api/v1/issues/${issueId}?teamId=${teamId}`,
  });
}

interface MutationParams {
  onMutate?: () => void;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useDeleteIssueMutation({
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

  return useMutation(deleteIssue, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
