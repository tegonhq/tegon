import { useMutation } from 'react-query';

import { ajaxDelete } from '@tegonhq/services/utils';

export interface DeleteIssueRelationParams {
  issueRelationId: string;
}

export function deleteIssueRelation({
  issueRelationId,
}: DeleteIssueRelationParams) {
  return ajaxDelete({
    url: `/api/v1/issue_relation/${issueRelationId}`,
  });
}

interface MutationParams {
  onMutate?: () => void;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useDeleteIssueRelationMutation({
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

  return useMutation(deleteIssueRelation, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
