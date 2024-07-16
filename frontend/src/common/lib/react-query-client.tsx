import { useRouter } from 'next/router';
import * as React from 'react';
import { QueryCache, QueryClient } from 'react-query';

export const useGetQueryClient = () => {
  const router = useRouter();

  return React.useRef(
    new QueryClient({
      queryCache: new QueryCache({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
          if (error?.resStatus === 403) {
            // global intercept 403 and redirect to home page
            router.push('/');
          }
        },
      }),
    }),
  );
};
