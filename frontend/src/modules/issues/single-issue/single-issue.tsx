/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { useRouter } from 'next/router';
import { useHotkeys } from 'react-hotkeys-hook';
import { Key } from 'ts-key-enum';

import { AppLayout } from 'common/layouts/app-layout';

import { useScope } from 'hooks';

import { IssueStoreInit } from 'store/issue-store-provider';

import { IssueView } from './issue-view';
import { SCOPES } from 'common/scopes';

export function SingleIssue() {
  useScope('all-issues');

  const { back } = useRouter();

  useHotkeys(Key.Escape, () => back(), [SCOPES.Global]);

  return <IssueView />;
}

SingleIssue.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <AppLayout>
      <IssueStoreInit>{page}</IssueStoreInit>
    </AppLayout>
  );
};
