import { createConversation } from '@tegonhq/services';
import { useMutation } from 'react-query';

import type { ConversationType } from 'common/types';

interface MutationParams {
  onMutate?: () => void;
  onSuccess?: (data: ConversationType) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError?: (error: any) => void;
}

export function useCreateConversationMutation({
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

  const onMutationSuccess = (data: ConversationType) => {
    onSuccess && onSuccess(data);
  };

  return useMutation(createConversation, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
