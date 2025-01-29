import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Key } from 'ts-key-enum';

import { IssueView } from 'modules/issues/single-issue/issue-view';

import { SCOPES } from 'common/scopes';

import { useScope } from 'hooks';

import { IssueViewContext } from './side-issue-view-context';

export const SideIssueView = () => {
  useScope(SCOPES.SideViewSingleIssue);
  const { closeIssueView } = React.useContext(IssueViewContext);

  useHotkeys(
    Key.Escape,
    (e) => {
      closeIssueView();

      e.preventDefault();
    },
    { scopes: [SCOPES.SideViewSingleIssue] },
  );

  return (
    <div className="fixed inset-y-0 z-20 right-0 bottom-0 max-w-[70vw] w-[50vw] side-issue-view">
      <IssueView sideView />
    </div>
  );
};
