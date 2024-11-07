import { removeTeamMember } from '@tegonhq/services';
import { useMutation } from 'react-query';

interface MutationParams {
  onMutate?: () => void;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getErrorMessage(errorResponse: any) {
  if (errorResponse.response?.data) {
    return errorResponse.response.data.message;
  }
  return errorResponse?.message || 'Error occured';
}

export function useRemoveTeamMemberMutation({
  onMutate,
  onSuccess,
  onError,
}: MutationParams) {
  const onMutationTriggered = () => {
    onMutate && onMutate();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onMutationError = (errorResponse: any) => {
    const errorText = getErrorMessage(errorResponse);

    onError && onError(errorText);
  };

  const onMutationSuccess = () => {
    onSuccess && onSuccess();
  };

  return useMutation(removeTeamMember, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
