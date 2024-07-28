import { useState } from 'react';
import { useMutation } from 'react-query';

function useStreamResponse({
  url,
  streamCallback,
}: {
  url: string;
  streamCallback: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [responses, setResponses] = useState('');
  const [data, setData] = useState<any | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const { mutate: startStream } = useMutation({
    mutationFn: async (messageContent: string) => {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageContent }),
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
      const { done, value } = await reader.read();
      if (done) {
        setIsLoading(false);
        return;
      }

      const text = new TextDecoder().decode(value);
      if (text.includes('END STREAM')) {
        setData(JSON.parse(text.replace(/.*END STREAM/, '')));
      } else {
        setResponses((prev) => prev + text);
        streamCallback((prevValue) => prevValue + text);
      }
      read();
    }
    read();
  }

  return { responses, data, startStream, isLoading };
}

export default useStreamResponse;
