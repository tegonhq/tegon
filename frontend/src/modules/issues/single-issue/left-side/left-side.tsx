/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Separator } from 'components/ui/separator';
import { useIssueData } from 'hooks/issues';

import { Header } from './header';
import { IssueDescription } from './issue-description';
import { IssueTitle } from './issue-title';

export function LeftSide() {
  const issue = useIssueData();

  return (
    <div className="col-span-2">
      <Header />
      <div className="grow pl-8 p-4">
        <IssueTitle defaultValue={issue.title} />
        <IssueDescription />

        <Separator className="my-4" />
      </div>
    </div>
  );
}
