// import { sort } from 'fast-sort';
import { Timeline } from '@tegonhq/ui/components/timeline';
import { sort } from 'fast-sort';
import { observer } from 'mobx-react-lite';
import React from 'react';

import type { User } from 'common/types';
import type { IssueCommentType } from 'common/types';

import { useIssueData } from 'hooks/issues';
import { useUsersData } from 'hooks/users';

import { useContextStore } from 'store/global-context-provider';

import { CommentActivity } from './comment-activity';
import { IssueComment } from './issue-comment';

export const CommentsActivity = observer(() => {
  const issue = useIssueData();
  const { commentsStore } = useContextStore();

  const { users, isLoading } = useUsersData(true);

  function getUserData(userId: string) {
    return users.find((user: User) => user.id === userId);
  }

  function getChildComments(issueCommentId: string) {
    return sortedComments.filter(
      (comment: IssueCommentType) => comment.parentId === issueCommentId,
    );
  }

  const sortedComments = React.useMemo(() => {
    const comments = commentsStore.getComments(issue.id) as IssueCommentType[];

    return sort(comments).desc((comment) =>
      new Date(comment.updatedAt).getTime(),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commentsStore.comments.length, issue]);

  if (isLoading) {
    return null;
  }

  return (
    <div className="my-2 w-full flex flex-col gap-4">
      <IssueComment />

      <Timeline>
        {sortedComments
          .filter((comment: IssueCommentType) => !comment.parentId)
          .map((comment: IssueCommentType, index: number) => (
            <CommentActivity
              issueId={issue.id}
              commentId={comment.id}
              key={comment.id}
              hasMore={index > 0}
              user={getUserData(comment.userId)}
              childComments={getChildComments(comment.id)}
              allowReply
              getUserData={getUserData}
            />
          ))}
      </Timeline>
    </div>
  );
});
