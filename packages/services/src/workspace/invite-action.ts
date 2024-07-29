import type { Invite } from '@tegonhq/types';

import { useMutation } from 'react-query';

import { ajaxPost } from '@tegonhq/services/utils';

export interface InviteActionParams {
  inviteId: string;
  accept: boolean;
}

export function inviteAction({ inviteId, accept }: InviteActionParams) {
  return ajaxPost({
    url: `/api/v1/workspaces/invite_action`,
    data: {
      inviteId,
      accept,
    },
  });
}

interface MutationParams {
  onMutate?: () => void;
  onSuccess?: (data: Invite) => void;
  onError?: (error: string) => void;
}

export function useInviteActionMutation({
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

  const onMutationSuccess = (data: Invite) => {
    onSuccess && onSuccess(data);
  };

  return useMutation(inviteAction, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
