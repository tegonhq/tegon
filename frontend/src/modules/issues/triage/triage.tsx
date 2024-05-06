/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { AppLayout } from 'common/layouts/app-layout';
import { SCOPES } from 'common/scopes';

import { useScope } from 'hooks';

import { Header } from './left-side/header';
import { TriageIssues } from './left-side/triage-issues';
import { RightSide } from './right-side';

export function Triage() {
  useScope(SCOPES.AllIssues);

  return (
    <main className="grid grid-cols-4 h-full">
      <div className="flex flex-col col-span-1">
        <Header title="Triage" />
        <TriageIssues />
      </div>
      <div className="border-l flex col-span-3 items-center justify-center">
        <RightSide />
      </div>
    </main>
  );
}

Triage.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
