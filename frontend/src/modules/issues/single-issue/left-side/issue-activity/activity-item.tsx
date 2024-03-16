/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';

import type { IssueHistoryType } from 'common/types/issue';

import type { User } from 'store/user-context';

import { LabelActivity } from './label-activity';
import { PriorityActivity } from './priority-activity';
import { StatusActivity } from './status-activity';

interface ActivityItemProps {
  issueHistory: IssueHistoryType;
  user: User;
}

export function ActivityItem({ issueHistory, user }: ActivityItemProps) {
  const [items, setItems] = React.useState([]);

  React.useEffect(() => {
    getItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [issueHistory]);

  const getItems = () => {
    const localItems = [];
    let setShowTime = true;
    let index = 0;

    if (issueHistory.removedLabelIds.length > 0) {
      localItems.push(
        <LabelActivity
          username={user.username}
          issueHistory={issueHistory}
          added={false}
          showTime={setShowTime}
          key={index}
        />,
      );
      index = index + 1;
      setShowTime = false;
    }

    if (issueHistory.addedLabelIds.length > 0) {
      localItems.push(
        <LabelActivity
          username={user.username}
          issueHistory={issueHistory}
          added
          showTime={setShowTime}
          key={index}
        />,
      );
      index = index + 1;

      setShowTime = false;
    }

    if (issueHistory.toPriority) {
      localItems.push(
        <PriorityActivity
          username={user.username}
          issueHistory={issueHistory}
          showTime={setShowTime}
          key={index}
        />,
      );
      index = index + 1;

      setShowTime = false;
    }

    if (issueHistory.toStateId) {
      localItems.push(
        <StatusActivity
          username={user.username}
          issueHistory={issueHistory}
          showTime={setShowTime}
          key={index}
        />,
      );
      index = index + 1;

      setShowTime = false;
    }

    setItems(localItems);
  };

  return <>{items}</>;
}
