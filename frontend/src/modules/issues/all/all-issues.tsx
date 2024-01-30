/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Separator } from '@radix-ui/react-separator';

import { AppLayout } from 'layouts/app-layout';

import { Header } from './header';

export function AllIssues() {
  return (
    <main>
      <Header />
    </main>
  );
}

AllIssues.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
