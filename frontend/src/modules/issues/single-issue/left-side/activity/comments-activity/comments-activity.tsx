/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';

import type { IssueCommentType } from 'common/types/issue';

import { Timeline } from 'components/ui/timeline';
import { useIssueData } from 'hooks/issues';
import { useUsersData } from 'hooks/users';

import { useContextStore } from 'store/global-context-provider';
import type { User } from 'store/user-context';

import { CommentActivity } from './comment-activity';
import { IssueComment } from './issue-comment';

export const CommentsActivity = observer(() => {
  const issue = useIssueData();
  const { commentsStore } = useContextStore();

  const comments = commentsStore.getComments(issue.id);
  const { usersData, isLoading } = useUsersData(issue.teamId);

  function getUserData(userId: string) {
    return usersData.find((user: User) => user.id === userId);
  }

  if (isLoading) {
    return null;
  }

  function getChildComments(issueCommentId: string) {
    return comments.filter(
      (comment: IssueCommentType) => comment.parentId === issueCommentId,
    );
  }

  return (
    <div className="my-2 w-full flex flex-col gap-4">
      <Timeline>
        {comments
          .filter((comment: IssueCommentType) => !comment.parentId)
          .map((comment: IssueCommentType, index: number) => (
            <CommentActivity
              comment={comment}
              hasMore={index > 0}
              key={comment.id}
              user={getUserData(comment.userId)}
              childComments={getChildComments(comment.id)}
              allowReply
              getUserData={getUserData}
            />
          ))}
      </Timeline>

      <IssueComment />
    </div>
  );
});
