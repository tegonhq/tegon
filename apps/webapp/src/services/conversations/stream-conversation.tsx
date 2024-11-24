import { useState } from 'react';
import { useMutation } from 'react-query';

export function useStreamConversationMutation() {
  const [responses, setResponses] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { mutate, isLoading: apiloading } = useMutation({
    mutationFn: async ({
      conversationId,
      conversationHistoryId,
      workspaceId,
    }: {
      conversationId: string;
      conversationHistoryId: string;
      workspaceId: string;
    }) => {
      setResponses('');

      const response = await fetch(`http://localhost:2000/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          conversation_id: conversationId,
          conversation_history_id: conversationHistoryId,
          integration_names: ['tegon'],
          workspace_id: workspaceId,
          stream: true,
        }),
      });

      if (!response.body) {
        throw new Error('ReadableStream not supported in this browser.');
      }

      const reader = response.body.getReader();
      return reader;
    },
    onSuccess: (reader) => {
      setIsLoading(true);
      readStream(reader);
    },
  });

  async function readStream(reader: ReadableStreamDefaultReader) {
    async function read() {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          setIsLoading(false);
          return;
        }

        const chunk = new TextDecoder('utf-8').decode(value, { stream: true });

        setResponses((prevDescription) => prevDescription + chunk);
      }
    }
    read();
  }

  return { responses, mutate, isLoading: isLoading || apiloading };
}
