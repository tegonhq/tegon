import type { RoleEnum } from '@tegonhq/types';

import { useMutation } from 'react-query';

import { ajaxPost } from 'services/utils';

export type InviteResponse = Record<string, string>;

export interface InviteUsersParams {
  emailIds: string;
  workspaceId: string;
  teamIds: string[];
  role: RoleEnum;
}

export function inviteUsers({
  emailIds,
  workspaceId,
  teamIds,
  role,
}: InviteUsersParams) {
  return ajaxPost({
    url: `/api/v1/workspaces/${workspaceId}/invite_users`,
    data: {
      emailIds,
      teamIds,
      role,
    },
  });
}

interface MutationParams {
  onMutate?: () => void;
  onSuccess?: (data: InviteResponse) => void;
  onError?: (error: string) => void;
}

export function useInviteUsersMutation({
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

  const onMutationSuccess = (data: InviteResponse) => {
    onSuccess && onSuccess(data);
  };

  return useMutation(inviteUsers, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
