/** Copyright (c) 2024, Tegon, all rights reserved. **/

import React from 'react';

import { Button } from 'components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'components/ui/tabs';
import { useIssueData } from 'hooks/issues';
import { AI, CrossLine } from 'icons';

import { useSummarizeIssue } from 'services/issues';

import { CommentsActivity } from './comments-activity';
import { IssueActivity } from './issue-activity';
import { SubscribeView } from './issue-activity/subscribe-view';

export function Activity() {
  const issueData = useIssueData();
  const [showSummary, setShowSummary] = React.useState(false);
  const { data, refetch } = useSummarizeIssue(issueData.id);

  return (
    <Tabs defaultValue="comments" className="mt-3 p-0 px-6">
      <div className="flex flex-col">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <h2 className="text-md">Activity</h2>
            <TabsList className="grid w-full grid-cols-2 bg-transparent gap-2 p-0">
              <TabsTrigger value="comments" className="bg-grayAlpha-100 px-2">
                Comments
              </TabsTrigger>
              <TabsTrigger value="activity" className="bg-grayAlpha-100">
                Activity
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="flex flex-col gap-1">
            <SubscribeView />
            <Button
              variant="secondary"
              className="flex gap-1"
              onClick={() => {
                refetch();
                setShowSummary(true);
              }}
            >
              <AI /> Summarise
            </Button>
          </div>
        </div>

        {showSummary && (
          <div className="bg-grayAlpha-100 p-3 pt-1 mt-2 rounded relative">
            <ul className="ml-6 list-disc [&>li]:mt-2">
              {data.map((text: string, index: number) => (
                <li key={index}>{text}</li>
              ))}
            </ul>

            <Button
              variant="ghost"
              className="absolute right-1 top-1"
              onClick={() => setShowSummary(false)}
            >
              <CrossLine size={16} />
            </Button>
          </div>
        )}

        <TabsContent value="comments">
          <CommentsActivity />
        </TabsContent>

        <TabsContent value="activity">
          <IssueActivity />
        </TabsContent>
      </div>
    </Tabs>
  );
}
