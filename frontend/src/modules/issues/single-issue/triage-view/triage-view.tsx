/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';

import { TriageIssues } from 'modules/issues/triage/left-side/triage-issues';

import { IssueStoreInit } from 'store/issue-store-provider';

import { Header } from '../../triage/left-side/header';
import { LeftSide } from '../left-side/left-side';

export function TriageView() {
  return (
    <main className="flex flex-col h-[100vh]">
      <Header title="Triage" />
      <div className="bg-gray-200 rounded-tl-2xl flex h-[calc(100vh_-_53px)]">
        <div className="border-l flex flex-col">
          <TriageIssues />
        </div>
        <IssueStoreInit>
          <div className="border-l flex grow">
            <LeftSide />
          </div>
        </IssueStoreInit>
      </div>
    </main>
  );
}
