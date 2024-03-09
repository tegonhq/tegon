/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { useDebouncedCallback } from 'use-debounce';

import { Separator } from 'components/ui/separator';
import { useIssueData } from 'hooks/issues';

import { useUpdateIssueMutation } from 'services/issues/update-issue';

import { Header } from './header';
import { IssueActivity } from './issue-activity';
import { IssueDescription } from './issue-description';
import { IssueTitle } from './issue-title';

export function LeftSide() {
  const issue = useIssueData();

  const { mutate: updateIssue } = useUpdateIssueMutation({});

  const onDescriptionChange = useDebouncedCallback((content: string) => {
    updateIssue({
      description: content,
      teamId: issue.teamId,
      id: issue.id,
    });
  }, 1000);

  return (
    <div className="col-span-2">
      <Header />
      <div className="grow pl-8 p-4 flex flex-col gap-4">
        <IssueTitle defaultValue={issue.title} />
        <IssueDescription
          value={issue.description}
          onChange={onDescriptionChange}
        />

        <Separator className="my-3" />

        <IssueActivity />
      </div>
    </div>
  );
}
