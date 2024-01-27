/** Copyright (c) 2024, Tegon, all rights reserved. **/

import 'styles/globals.css';
import type { AppProps } from 'next/app';

import { frontendConfig } from 'lib/config';
import { cn } from 'lib/utils';
import { Inter } from 'next/font/google';
import { useRouter } from 'next/router';
import * as React from 'react';
import {
  Hydrate,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import SuperTokensReact, { SuperTokensWrapper } from 'supertokens-auth-react';

import { ThemeProvider } from 'components/theme-provider';

// Initialise Supertokens
if (typeof window !== 'undefined') {
  // we only want to call this init function on the frontend, so we check typeof window !== 'undefined'

  SuperTokensReact.init(frontendConfig());
}

// Inter as default font
export const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const useGetQueryClient = () => {
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

export default function App({
  Component,
  pageProps: { dehydratedState, ...pageProps },
}: AppProps) {
  const queryClientRef = useGetQueryClient();

  return (
    <SuperTokensWrapper>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <QueryClientProvider client={queryClientRef.current}>
          <Hydrate state={dehydratedState}>
            <div
              className={cn(
                'min-h-screen bg-background font-sans antialiased',
                fontSans.variable,
              )}
            >
              <Component {...pageProps} />
            </div>
          </Hydrate>
        </QueryClientProvider>
      </ThemeProvider>
    </SuperTokensWrapper>
  );
}
