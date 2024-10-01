import { Button } from '@tegonhq/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@tegonhq/ui/components/dropdown-menu';
import {
  Editor,
  EditorExtensions,
  suggestionItems,
} from '@tegonhq/ui/components/editor/index';
import { EditLine, MoreLine, NewIssueLine, SubIssue } from '@tegonhq/ui/icons';
import { cn } from '@tegonhq/ui/lib/utils';
import * as React from 'react';
import ReactTimeAgo from 'react-time-ago';

import { type IssueCommentType, type User } from 'common/types';
import { getUserIcon } from 'common/user-util';

import { UserContext } from 'store/user-context';

import { EditComment } from './edit-comment';
import { ReplyComment } from './reply-comment';
import { getUserDetails } from '../issue-activity/user-activity-utils';
import { NewIssue } from 'modules/issues/new-issue';
import { useIssueData } from 'hooks/issues';

export interface GenericCommentActivityProps {
  comment: IssueCommentType;
  user: User;
  childComments: IssueCommentType[];
  allowReply?: boolean;
  html?: boolean;
  getUserData: (userId: string) => User;
  hasMore?: boolean;
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
  const issue = useIssueData();

  const sourceMetadata = comment.sourceMetadata
    ? JSON.parse(comment.sourceMetadata)
    : undefined;

  const [edit, setEdit] = React.useState(false);
  const [defaultIssueCreationValues, setDefaultIssueCreationValues] =
    React.useState(undefined);
  const [newIssueDialog, setNewIssueDialog] = React.useState(false);

  return (
    <div className="flex items-start">
      {getUserIcon(user)}
      <div
        className={cn(
          'group relative w-full flex flex-col text-foreground rounded-md',
          !comment.parentId && 'bg-grayAlpha-100',
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
              <span>{getUserDetails(sourceMetadata, user).fullname}</span>
            ) : (
              <span>
                {sourceMetadata.userDisplayName} via {sourceMetadata.type}
              </span>
            )}
          </div>

          <div className="flex gap-2 items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="px-2 py-0 h-5">
                  <MoreLine size={16} className="text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  {!sourceMetadata && user.id === currentUser.id && (
                    <DropdownMenuItem onClick={() => setEdit(true)}>
                      <div className="flex items-center gap-1">
                        <EditLine size={16} className="mr-1" /> Edit
                      </div>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    onClick={() => {
                      setDefaultIssueCreationValues({
                        description: comment.body,
                      });
                      setNewIssueDialog(true);
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <NewIssueLine size={16} className="mr-1" /> New issue from
                      comment
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setDefaultIssueCreationValues({
                        parentId: issue.id,
                        description: comment.body,
                      });
                      setNewIssueDialog(true);
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <SubIssue size={16} className="mr-1" /> Sub issue from
                      comment
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <div>
              <ReactTimeAgo
                date={new Date(comment.updatedAt)}
                timeStyle="twitter"
                className="text-muted-foreground font-mono text-xs"
              />
            </div>
          </div>
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
              'text-base pt-2',
              !comment.parentId && 'p-3 py-2',
              comment.parentId && 'pb-2',
            )}
          >
            <Editor value={comment.body} editable={false} className="mb-0">
              <EditorExtensions suggestionItems={suggestionItems} />
            </Editor>
          </div>
        )}

        {childComments.length > 0 && (
          <div className="w-full border-t border-border px-3 py-2 pb-0">
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

      {newIssueDialog && (
        <NewIssue
          open={newIssueDialog}
          setOpen={setNewIssueDialog}
          defaultValues={defaultIssueCreationValues}
        />
      )}
    </div>
  );
}
