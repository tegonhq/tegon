import { Button } from '@tegonhq/ui/components/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@tegonhq/ui/components/tabs';
import { ActivityLine, AI, SendLine } from '@tegonhq/ui/icons';
import { ArrowDown, ArrowUp } from 'lucide-react';
import React from 'react';

import { useLocalCommonState } from 'hooks/use-local-state';

import { CommentsActivity } from './comments-activity';
import { IssueActivity } from './issue-activity';
import { SubscribeView } from './issue-activity/subscribe-view';
import { IssueSummary } from './summary';

export function Activity() {
  const [showSummary, setShowSummary] = React.useState(false);
  const [commentsOrder, setCommentsOrder] = useLocalCommonState(
    'issue_comments_order',
    -1,
  );
  const [activeTab, setActiveTab] = React.useState('comments'); // Track active tab

  return (
    <Tabs
      defaultValue="comments"
      onValueChange={(value) => setActiveTab(value)} // Update active tab
      className="mt-3 p-0 px-6"
    >
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
          <div className="flex items-end flex-col gap-1">
            <SubscribeView />
            <div className="flex flex-row gap-3">
              {activeTab === 'comments' && (
                <Button
                  variant="secondary"
                  className="flex gap-1"
                  onClick={() => {
                    setCommentsOrder((prev) => {
                      if (prev <= 0) {
                        return 1;
                      }
                      return 0;
                    });
                  }}
                >
                  {commentsOrder > 0 ? (
                    <ArrowDown size={16} />
                  ) : (
                    <ArrowUp size={16} />
                  )}
                  {commentsOrder > 0 ? 'Newest First' : 'Oldest First'}
                </Button>
              )}
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
        </div>

        {showSummary && <IssueSummary onClose={() => setShowSummary(false)} />}

        <TabsContent value="comments">
          <CommentsActivity commentOrder={commentsOrder} />
        </TabsContent>

        <TabsContent value="activity">
          <IssueActivity />
        </TabsContent>
      </div>
    </Tabs>
  );
}
