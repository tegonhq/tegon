/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Tabs, TabsContent, TabsList, TabsTrigger } from 'components/ui/tabs';

import { CommentsActivity } from './comments-activity';
import { IssueActivity } from './issue-activity';
import { SubscribeView } from './issue-activity/subscribe-view';

export function Activity() {
  return (
    <Tabs defaultValue="comments" className="mt-2">
      <div className="flex flex-col">
        <div className="flex justify-between">
          <div>
            <h3 className="text-md mb-2"> Activity</h3>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
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
