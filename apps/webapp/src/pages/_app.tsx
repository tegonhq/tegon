import './global.css';
import '@tegonhq/ui/index.css';
import '@tegonhq/ui/global.css';
import type { NextComponentType } from 'next';
import type { AppContext, AppInitialProps, AppLayoutProps } from 'next/app';

import { ThemeProvider } from '@tegonhq/ui/components/theme-provider';
import { Toaster } from '@tegonhq/ui/components/toaster';
import { TooltipProvider } from '@tegonhq/ui/components/tooltip';
import { cn } from '@tegonhq/ui/lib/utils';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import React from 'react';
import { HotkeysProvider } from 'react-hotkeys-hook';
import { Hydrate, QueryClientProvider } from 'react-query';
import { SuperTokensWrapper } from 'supertokens-auth-react';

import { initPosthog, initSuperTokens } from 'common/init-config';
import { useGetQueryClient } from 'common/lib/react-query-client';
import { SCOPES } from 'common/scopes';

import { StoreContext, storeContextStore } from 'store/global-context-provider';

initSuperTokens();
initPosthog();

TimeAgo.addDefaultLocale(en);

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
      <PostHogProvider client={posthog}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <HotkeysProvider initiallyActiveScopes={[SCOPES.Global]}>
            <TooltipProvider delayDuration={1000}>
              <StoreContext.Provider value={storeContextStore}>
                <QueryClientProvider client={queryClientRef.current}>
                  <Hydrate state={dehydratedState}>
                    <div
                      className={cn(
                        'min-h-screen font-sans antialiased flex',
                        GeistSans.variable,
                        GeistMono.variable,
                      )}
                    >
                      {getLayout(<Component {...pageProps} />)}
                    </div>

                    <Toaster />
                  </Hydrate>
                </QueryClientProvider>
              </StoreContext.Provider>
            </TooltipProvider>
          </HotkeysProvider>
        </ThemeProvider>
      </PostHogProvider>
    </SuperTokensWrapper>
  );
};

export default MyApp;
