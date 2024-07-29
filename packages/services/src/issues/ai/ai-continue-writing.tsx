import { useState } from 'react';
import { useMutation } from 'react-query';

export function useAIContinueWritingMutation({
  baseHost,
}: {
  baseHost: string;
}) {
  const [responses, setResponses] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { mutate, isLoading: apiloading } = useMutation({
    mutationFn: async ({
      description,
      workspaceId,
      userInput,
    }: {
      description: string;
      workspaceId: string;
      userInput: string;
    }) => {
      setResponses('');

      const response = await fetch(
        `${baseHost}/v1/issues/ai/stream/description`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ description, workspaceId, userInput }),
        },
      );

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
