import { createConversationHistory } from '@tegonhq/services';
import { useMutation } from 'react-query';

import type { ConversationHistoryType } from 'common/types';

interface MutationParams {
  onMutate?: () => void;
  onSuccess?: (data: ConversationHistoryType) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError?: (error: any) => void;
}

export function useCreateConversationHistoryMutation({
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

  const onMutationSuccess = (data: ConversationHistoryType) => {
    onSuccess && onSuccess(data);
  };

  return useMutation(createConversationHistory, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
