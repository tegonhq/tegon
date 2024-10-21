import { useMutation } from 'react-query';

import type { IssueType, IssueRelationEnum } from 'common/types';

import { ajaxPost } from 'services/utils';

import { useContextStore } from 'store/global-context-provider';

export interface UpdateIssueParams {
  id: string;
  title?: string;
  description?: string;
  priority?: number;

  labelIds?: string[];
  dueDate?: Date;
  stateId?: string;
  assigneeId?: string;
  teamId: string;

  parentId?: string;

  issueRelation?: {
    issueId: string;
    relatedIssueId: string;
    type: IssueRelationEnum;
  };
}

export function updateIssue({ id, teamId, ...otherParams }: UpdateIssueParams) {
  console.log('updateIssue API call with:', { id, teamId, ...otherParams });
  return ajaxPost({
    url: `/api/v1/issues/${id}?teamId=${teamId}`,
    data: otherParams,
  });
}

interface MutationParams {
  onMutate?: () => void;
  onSuccess?: (data: IssueType) => void;
  onError?: (error: string) => void;
}

export function useUpdateIssueMutation({
  onMutate,
  onSuccess,
  onError,
}: MutationParams) {
  const { issuesStore } = useContextStore();

  const update = ({ id, dueDate, labelIds, ...otherParams }: UpdateIssueParams) => {
    console.log('update function called with:', { id, dueDate, labelIds, ...otherParams });
    const issue = issuesStore.getIssueById(id);
    console.log('Current issue from store:', issue);

    try {
      const updateData = {
        ...otherParams,
        dueDate: dueDate || null,
        labelIds: labelIds ? [...labelIds] : issue.labelIds, // Create a new array
      };
      console.log('Updating issue in store with:', updateData);
      issuesStore.updateIssue(updateData, id);

      console.log('Calling updateIssue API with:', { ...updateData, id });
      return updateIssue({ ...updateData, id });
    } catch (e) {
      console.error('Error updating issue:', e);
      console.log('Reverting store update with:', issue);
      issuesStore.updateIssue(issue, id);
      return Promise.reject(e);
    }
  };

  const onMutationTriggered = () => {
    onMutate && onMutate();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onMutationError = (errorResponse: any) => {
    console.error('Mutation error:', errorResponse);
    const errorText = errorResponse?.errors?.message || 'Error occurred';
    onError && onError(errorText);
  };

  const onMutationSuccess = (data: IssueType) => {
    console.log('Mutation success. Updated issue:', data);
    onSuccess && onSuccess(data);
  };

  return useMutation(update, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
