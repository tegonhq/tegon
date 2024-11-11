import { Timeline } from '@tegonhq/ui/components/timeline';
import { sort } from 'fast-sort';
import { observer } from 'mobx-react-lite';

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

  const comments = sort(commentsStore.getComments(issue.id)).asc(
    (comment: IssueCommentType) => new Date(comment.createdAt),
  ) as IssueCommentType[];

  const { users, isLoading } = useUsersData(true);

  function getUserData(userId: string) {
    return users.find((user: User) => user.id === userId);
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
