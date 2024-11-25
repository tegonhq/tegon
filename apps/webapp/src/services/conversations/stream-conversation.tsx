import { useState } from 'react';
import { useMutation } from 'react-query';

import { useContextStore } from 'store/global-context-provider';

export function useStreamConversationMutation() {
  const [responses, setResponses] = useState([]);
  const [thoughts, setThoughts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { commonStore } = useContextStore();

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
      setResponses([]);

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
      commonStore.update({ conversationStreaming: true });
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
          commonStore.update({ conversationStreaming: false });

          return;
        }

        const chunk = new TextDecoder('utf-8').decode(value, { stream: true });
        const thoughts: Array<{ type: string }> = [];
        const responses: Array<{ type: string }> = [];
        chunk.split('\n\n').forEach((ch) => {
          if (ch) {
            const message = JSON.parse(ch.replace('data: ', ''));
            if (message.status === 'summary') {
              responses.push(message);
            }

            thoughts.push(message);
          }

          return undefined;
        });

        setResponses((prevChunk) => [...prevChunk, ...responses]);
        setThoughts((prevChunk) => [...prevChunk, ...thoughts]);
      }
    }
    read();
  }

  return { responses, thoughts, mutate, isLoading: isLoading || apiloading };
}
