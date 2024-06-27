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
    <main className="flex flex-col h-[100vh]">
      <Header title="Triage" />
      <div className="bg-background-2 rounded-tl-3xl flex h-[calc(100vh_-_53px)]">
        <div className="flex flex-col flex-[24_1_0px]">
          <h2 className="text-lg pl-6 pt-6 font-medium"> Triage </h2>
          <TriageIssues />
        </div>
        <div className="border-l flex items-center justify-center flex-[76_1_0px]">
          <RightSide />
        </div>
      </div>
    </main>
  );
}

Triage.getLayout = function getLayout(page: React.ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
