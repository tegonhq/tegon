/** Copyright (c) 2024, Tegon, all rights reserved. **/

import 'styles/globals.css';
import type { NextComponentType } from 'next';

import { AppContext, AppInitialProps, AppLayoutProps } from 'next/app';
import { Inter } from 'next/font/google';
import * as React from 'react';
import { Hydrate, QueryClientProvider } from 'react-query';
import { SuperTokensWrapper } from 'supertokens-auth-react';

import { initSuperTokens } from 'common/init-config';
import { useGetQueryClient } from 'common/lib/react-query-client';
import { cn } from 'common/lib/utils';

import { ThemeProvider } from 'components/theme-provider';
import { TooltipProvider } from 'components/ui/tooltip';

// Inter as default font
export const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

initSuperTokens();

export const MyApp: NextComponentType<
  AppContext,
  AppInitialProps,
  AppLayoutProps
> = ({
  Component,
  pageProps: { dehydratedState, ...pageProps },
}: AppLayoutProps) => {
  const queryClientRef = useGetQueryClient();
  const getLayout = Component.getLayout || ((page: React.ReactNode) => page);

  return (
    <SuperTokensWrapper>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider delayDuration={0}>
          <QueryClientProvider client={queryClientRef.current}>
            <Hydrate state={dehydratedState}>
              <div
                className={cn(
                  'min-h-screen bg-background font-sans antialiased flex',
                  fontSans.variable,
                )}
              >
                {getLayout(<Component {...pageProps} />)}
              </div>
            </Hydrate>
          </QueryClientProvider>
        </TooltipProvider>
      </ThemeProvider>
    </SuperTokensWrapper>
  );
};

export default MyApp;
