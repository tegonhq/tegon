import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@tegonhq/ui/components/collapsible';
import {
  Editor,
  EditorExtensions,
  suggestionItems,
} from '@tegonhq/ui/components/editor/index';
import { TimelineItem } from '@tegonhq/ui/components/timeline';
import { cn } from '@tegonhq/ui/lib/utils';
import * as React from 'react';
import ReactTimeAgo from 'react-time-ago';

import { type IssueCommentType } from 'common/types';
import type { User } from 'common/types';
import { getUserIcon } from 'common/user-util';

import { GenericCommentActivity } from './generic-comment-activity';
import { ReplyComment } from './reply-comment';

interface CommentActivityProps {
  comment: IssueCommentType;
  user: User;
  childComments: IssueCommentType[];
  allowReply?: boolean;
  html?: boolean;
  getUserData: (userId: string) => User;
  hasMore?: boolean;
}

export function SyncCommentActivity({
  comment,
  childComments,
  allowReply = false,
  hasMore,
  getUserData,
  user,
}: CommentActivityProps) {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <TimelineItem
      className="w-full"
      key={`${comment.id}-comment`}
      hasMore={hasMore}
    >
      <div className="flex items-start">
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className={cn(
            'group relative w-full flex flex-col rounded-md',
            !comment.parentId && 'bg-grayAlpha-100',
          )}
        >
          <CollapsibleTrigger asChild className="cursor-pointer">
            <div
              className={cn(
                'flex gap-2 justify-between group/collapse',
                !comment.parentId && 'p-2',
              )}
            >
              <div className="flex gap-1">
                {getUserIcon(user)}

                <Editor value={comment.body} editable={false} className="mb-0">
                  <EditorExtensions suggestionItems={suggestionItems} />
                </Editor>
              </div>
              <span className="inline-flex gap-2 text-muted-foreground text-xs">
                <span className="hidden group-hover/collapse:inline">
                  {isOpen ? 'Collapse' : 'Expand'}
                </span>
                <ReactTimeAgo date={new Date(comment.updatedAt)} />
              </span>
            </div>
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-2">
            {childComments.length > 0 && (
              <div className="w-full border-t border-border p-2 pb-0">
                {childComments.map(
                  (subComment: IssueCommentType, index: number) => (
                    <div
                      key={subComment.id}
                      className={cn(
                        index < childComments.length - 1 &&
                          'border-b border-border mb-4',
                      )}
                    >
                      <GenericCommentActivity
                        comment={subComment}
                        user={getUserData(subComment.userId)}
                        childComments={[]}
                        html
                        allowReply={false}
                        getUserData={getUserData}
                      />
                    </div>
                  ),
                )}
              </div>
            )}

            {allowReply && <ReplyComment issueCommentId={comment.id} />}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </TimelineItem>
  );
}
