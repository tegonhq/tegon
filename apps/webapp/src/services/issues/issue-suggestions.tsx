import type { LabelType, User } from 'common/types';

import { useMutation } from 'react-query';

import { ajaxPost } from 'services/utils';

export interface SuggestionIssueParams {
  teamId: string;
  description: string;
  workspaceId: string;
}

export interface SuggestionResponse {
  labels: LabelType[];
  assignees: User[];
}

export function suggestionIssue({
  teamId,
  workspaceId,
  description,
}: SuggestionIssueParams) {
  return ajaxPost({
    url: `/api/v1/issues/suggestions?teamId=${teamId}`,
    data: { workspaceId, description },
  });
}

interface MutationParams {
  onMutate?: () => void;
  onSuccess?: (data: SuggestionResponse) => void;
  onError?: (error: string) => void;
}

export function useSuggestionIssueMutation({
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

  const onMutationSuccess = (data: SuggestionResponse) => {
    onSuccess && onSuccess(data);
  };

  return useMutation(suggestionIssue, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
