import { useMutation } from 'react-query';

import { ajaxPost } from 'common/lib/ajax';
import type { NotificationType } from 'common/types/notification';

export interface UpdateNotificationParams {
  notificationId: string;
  readAt: string;
}

export function updateNotification({
  notificationId,
  readAt,
}: UpdateNotificationParams) {
  return ajaxPost({
    url: `/api/v1/notifications/${notificationId}`,
    data: { readAt },
  });
}

interface MutationParams {
  onMutate?: () => void;
  onSuccess?: (data: NotificationType) => void;
  onError?: (error: string) => void;
}

export function useUpdateNotificationMutation({
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

  const onMutationSuccess = (data: NotificationType) => {
    onSuccess && onSuccess(data);
  };

  return useMutation(updateNotification, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
