/** Copyright (c) 2024, Tegon, all rights reserved. **/

import ReactTimeAgo from 'react-time-ago';

import { useGetLinkedIssueDetailsQuery } from 'services/linked-issues';

interface SentryItemProps {
  linkedIssueId: string;
  title: string;
}

export function SentryItem({ title, linkedIssueId }: SentryItemProps) {
  const { data: linkedIssueDetails } =
    useGetLinkedIssueDetailsQuery(linkedIssueId);

  if (linkedIssueDetails) {
    return (
      <div className="flex w-full gap-2 items-center">
        <div>{title}</div>
        <div className="text-muted-foreground text-xs">
          <ReactTimeAgo
            date={new Date(linkedIssueDetails.lastSeen)}
            className="text-muted-foreground"
          />
        </div>
      </div>
    );
  }

  return <div className="flex">{title}</div>;
}
