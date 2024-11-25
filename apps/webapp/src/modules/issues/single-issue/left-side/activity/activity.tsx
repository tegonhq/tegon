import { Button } from '@tegonhq/ui/components/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@tegonhq/ui/components/tabs';
import { ActivityLine, AI, SendLine } from '@tegonhq/ui/icons';
import React from 'react';

import { CommentsActivity } from './comments-activity';
import { IssueActivity } from './issue-activity';
import { SubscribeView } from './issue-activity/subscribe-view';
import { IssueSummary } from './summary';

export function Activity() {
  const [showSummary, setShowSummary] = React.useState(false);

  return (
    <Tabs defaultValue="comments" className="mt-3 p-0 px-6">
      <div className="flex flex-col">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <h2 className="text-md">Activity</h2>
            <TabsList className="grid w-full grid-cols-2 bg-transparent gap-2 p-0">
              <TabsTrigger
                value="comments"
                className="bg-grayAlpha-100 px-2 flex gap-1"
              >
                <SendLine size={16} />
                Comments
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="bg-grayAlpha-100 flex gap-1"
              >
                <ActivityLine size={16} />
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
                setShowSummary(true);
              }}
            >
              <AI /> Summarise
            </Button>
          </div>
        </div>

        {showSummary && <IssueSummary onClose={() => setShowSummary(false)} />}

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
