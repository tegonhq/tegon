/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';

import { TriageIssues } from 'modules/issues/triage/left-side/triage-issues';

import { Header } from '../../triage/left-side/header';
import { LeftSide } from '../left-side/left-side';
import { RightSide } from '../right-side/right-side';

export function TriageView() {
  return (
    <main className="grid grid-cols-4 h-full">
      <div className="border-l flex flex-col col-span-1">
        <Header title="Triage" />
        <TriageIssues />
      </div>
      <div className="border-l flex col-span-3">
        <div className="flex flex-col h-full w-full">
          <main className="grid grid-cols-4 h-full">
            <div className="col-span-4 xl:col-span-3 flex flex-col h-[calc(100vh)]">
              <LeftSide isTriageView />
            </div>
            <div className="bg-background border-l dark:bg-slate-800/50 hidden flex-col xl:col-span-1 xl:flex">
              <RightSide />
            </div>
          </main>
        </div>
      </div>
    </main>
  );
}
