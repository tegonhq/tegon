/** Copyright (c) 2024, Tegon, all rights reserved. **/

import 'styles/globals.css';
import type { AppProps } from 'next/app';

import { cn } from 'lib/utils';
import { Inter } from 'next/font/google';

import { ThemeProvider } from 'components/theme-provider';

// import SuperTokensReact, { SuperTokensWrapper } from 'supertokens-auth-react';

// if (typeof window !== 'undefined') {
//   // we only want to call this init function on the frontend, so we check typeof window !== 'undefined'

//   SuperTokensReact.init(frontendConfig());
// }

export const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});
export default function App({ Component, pageProps }: AppProps) {
  return (
    // <SuperTokensWrapper>
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <div
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
        )}
      >
        <Component {...pageProps} />
      </div>
    </ThemeProvider>
    // </SuperTokensWrapper>
  );
}
