/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
  RiAccountBoxFill,
  RiGithubFill,
  RiMoreFill,
  RiPencilFill,
  RiSlackFill,
} from '@remixicon/react';
import * as React from 'react';
import ReactTimeAgo from 'react-time-ago';

import { getTailwindColor } from 'common/color-utils';
import { cn } from 'common/lib/utils';
import { type IssueCommentType } from 'common/types/issue';
import { Integration } from 'common/types/linked-issue';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  getInitials,
} from 'components/ui/avatar';
import { Button } from 'components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';
import { Editor } from 'components/ui/editor';

import { UserContext, type User } from 'store/user-context';

import { EditComment } from './edit-comment';
import { ReplyComment } from './reply-comment';

export interface GenericCommentActivityProps {
  comment: IssueCommentType;
  user: User;
  childComments: IssueCommentType[];
  allowReply?: boolean;
  html?: boolean;
  getUserData: (userId: string) => User;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getIcon(sourceMetadata: any) {
  if (sourceMetadata) {
    if (sourceMetadata.type === Integration.Github) {
      return <RiGithubFill size={18} className="text-foreground" />;
    }

    if (sourceMetadata.type === Integration.Slack) {
      return <RiSlackFill size={18} className="text-foreground" />;
    }
  }

  return <RiAccountBoxFill size={18} className="text-foreground" />;
}

export function GenericCommentActivity(props: GenericCommentActivityProps) {
  const {
    user,
    comment,
    childComments,
    allowReply = false,
    getUserData,
  } = props;
  const currentUser = React.useContext(UserContext);
  const sourceMetadata = comment.sourceMetadata
    ? JSON.parse(comment.sourceMetadata)
    : undefined;

  const [edit, setEdit] = React.useState(false);

  return (
    <div className="flex items-start text-sm text-muted-foreground ">
      {user ? (
        <Avatar className="h-[15px] w-[20px] mr-3 mt-[2px] text-foreground">
          <AvatarImage />
          <AvatarFallback
            className={cn(
              'text-[0.55rem] rounded-sm',
              getTailwindColor(user?.username),
            )}
          >
            {getInitials(user?.fullname)}
          </AvatarFallback>
        </Avatar>
      ) : (
        <div className="h-[15px] w-[20px] flex items-center justify-center mr-4 rounded-sm">
          {getIcon(sourceMetadata)}
        </div>
      )}
      <div
        className={cn(
          'group relative w-full flex flex-col text-foreground rounded-md',
          comment.parentId && 'border-0',
          !comment.parentId && 'border bg-white dark:bg-slate-700/20 shadow-sm',
        )}
      >
        <div
          className={cn(
            'flex justify-between items-center',
            !comment.parentId && 'px-3 py-2 pb-0',
          )}
        >
          <div className="flex gap-2">
            {user ? (
              <span className="text-foreground font-medium">
                {user?.username}
              </span>
            ) : (
              <span className="text-foreground font-medium">
                {sourceMetadata.userDisplayName} via {sourceMetadata.type}
              </span>
            )}

            <span>
              <ReactTimeAgo
                date={new Date(comment.updatedAt)}
                className="text-muted-foreground"
              />
            </span>
          </div>

          {!sourceMetadata && user.id === currentUser.id && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="xs" className="px-2 -mt-1">
                  <RiMoreFill size={16} className="text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setEdit(true)}>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <RiPencilFill size={16} /> Edit
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {edit ? (
          <div className={cn('text-base', !comment.parentId && 'px-3')}>
            <EditComment
              value={comment.body}
              comment={comment}
              onCancel={() => setEdit(false)}
            />
          </div>
        ) : (
          <div
            className={cn(
              'text-base mt-2',
              !comment.parentId && 'p-3 pt-0',
              comment.parentId && 'pb-3',
            )}
          >
            <Editor value={comment.body} editable={false} className="mb-0" />
          </div>
        )}

        {childComments.length > 0 && (
          <div className="text-sm text-muted-foreground w-full border-t p-3 pb-0">
            {childComments.map(
              (subComment: IssueCommentType, index: number) => (
                <div
                  key={subComment.id}
                  className={cn(
                    index < childComments.length - 1 && 'border-b mb-4',
                  )}
                >
                  <GenericCommentActivity
                    comment={subComment}
                    user={getUserData(subComment.userId)}
                    childComments={[]}
                    allowReply={false}
                    getUserData={getUserData}
                  />
                </div>
              ),
            )}
          </div>
        )}

        {allowReply && <ReplyComment issueCommentId={comment.id} />}
      </div>
    </div>
  );
}
