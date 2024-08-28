import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en" className={`${GeistMono.variable} ${GeistSans.variable}`}>
      <Head />
      <body className="min-h-screen font-sans antialiased flex flex-col">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
