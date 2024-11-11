import { observer } from 'mobx-react-lite';
import * as React from 'react';

import type { IssueType, User } from 'common/types';
import type { IssueHistoryType } from 'common/types';

import { LabelActivity } from './label-activity';
import { PriorityActivity } from './priority-activity';
import { RelatedActivity } from './related-activity';
import { StatusActivity } from './status-activity';

interface ActivityItemProps {
  issueHistory: IssueHistoryType;
  user: User;
  issue: IssueType;
}

export const ActivityItem = observer(
  ({ issueHistory, user, issue }: ActivityItemProps) => {
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
            fullname={user.fullname}
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
            fullname={user.fullname}
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
            fullname={user.fullname}
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
            fullname={user.fullname}
            issueHistory={issueHistory}
            showTime={setShowTime}
            key={index}
            teamId={issue.teamId}
          />,
        );
        index = index + 1;

        setShowTime = false;
      }

      if (issueHistory.relationChanges) {
        localItems.push(
          <RelatedActivity
            fullname={user.fullname}
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
  },
);
