import axios from 'axios';
import { useMutation } from 'react-query';

interface MutationParams {
  onMutate?: () => void;
  onSuccess?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError?: (error: any) => void;
}
interface RunTasksProps {
  conversationId: string;
  conversationHistoryId: string;
  taskIds: string[];
  workspaceId: string;
}

const runTasks = async ({
  conversationId,
  conversationHistoryId,
  taskIds,
  workspaceId,
}: RunTasksProps) => {
  return axios({
    url: `http://localhost:2000/chat`,
    withCredentials: true,
    method: 'Post',
    data: {
      conversation_id: conversationId,
      conversation_history_id: conversationHistoryId,
      integration_names: ['tegon'],
      workspace_id: workspaceId,
      task_ids: taskIds,
    },
  });
};

export function useRunTasksMutation({
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

  const onMutationSuccess = () => {
    onSuccess && onSuccess();
  };

  return useMutation(runTasks, {
    onError: onMutationError,
    onMutate: onMutationTriggered,
    onSuccess: onMutationSuccess,
  });
}
