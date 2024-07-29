import type { IssueType } from '@tegonhq/types';

import { useMutation } from 'react-query';

import { ajaxPost } from '@tegonhq/services/utils';

export interface CreateIssueParams {
  title: string;
  description: string;
  // Used while creating new issue
  descriptionString?: string;
  priority?: number;

  labelIds?: string[];
  stateId: string;
  assigneeId?: string;
  teamId: string;
  parentId?: string;
}

export function createIssue({ teamId, ...otherParams }: CreateIssueParams) {
  return ajaxPost({
    url: `/api/v1/issues`,
    data: {
      ...otherParams,
      teamId,
      sortOrder: 0,
      estimate: 0,
      subscriberIds: [],
    },
  });
}

export interface MutationParams {
  onMutate?: () => void;
  onSuccess?: (data: IssueType) => void;
  onError?: (error: string) => void;
}

export function useCreateIssueMutation({
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

  const onMutationSuccess = (data: IssueType) => {
    onSuccess && onSuccess(data);
  };

  return useMutation(createIssue, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
