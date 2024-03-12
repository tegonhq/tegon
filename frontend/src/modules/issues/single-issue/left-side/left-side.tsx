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
      <div className="grow px-8 py-4 flex flex-col gap-4 overflow-y-auto h-[calc(100vh_-_52px)]">
        <IssueTitle defaultValue={issue.title} />
        <div className="mt-2">
          <IssueDescription
            value={issue.description}
            onChange={onDescriptionChange}
          />
        </div>

        <Separator className="my-3" />

        <IssueActivity />
      </div>
    </div>
  );
}
