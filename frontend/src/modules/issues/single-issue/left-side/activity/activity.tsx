/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Tabs, TabsContent, TabsList, TabsTrigger } from 'components/ui/tabs';

import { CommentsActivity } from './comments-activity';
import { IssueActivity } from './issue-activity';
import { SubscribeView } from './issue-activity/subscribe-view';

export function Activity() {
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
          <SubscribeView />
        </div>
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
