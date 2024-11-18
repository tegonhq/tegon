/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from 'react-query';

import type { IssueType } from 'common/types';

import { ajaxPost } from 'services/utils';

export interface CreateIssueParams {
  title?: string;
  description: string;
  // Used while creating new issue
  descriptionString?: string;
  priority?: number;

  labelIds?: string[];
  stateId: string;
  assigneeId?: string;
  teamId: string;
  parentId?: string;
  projectId?: string;
  projectMilestoneId?: string;

  // Need when creating from the description
  start?: number;
  end?: number;
}

export function createIssue({
  teamId,
  start,
  end,
  ...otherParams
}: CreateIssueParams) {
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
  onSuccess?: (data: IssueType, variables: any, context: any) => void;
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

  const onMutationSuccess = (data: IssueType, variables: any, context: any) => {
    onSuccess && onSuccess(data, variables, context);
  };

  return useMutation(createIssue, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
