import { Timeline } from '@tegonhq/ui/components/timeline';
// import { sort } from 'fast-sort';
import { sort } from 'fast-sort';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';

import type { User } from 'common/types';
import type { IssueCommentType } from 'common/types';

import { useIssueData } from 'hooks/issues';
import { useUsersData } from 'hooks/users';

import { useContextStore } from 'store/global-context-provider';

import { CommentActivity } from './comment-activity';
import { IssueComment } from './issue-comment';

interface CommentsActivityProps {
  commentOrder?: number;
}

export const CommentsActivity = observer(
  ({ commentOrder = -1 }: CommentsActivityProps) => {
    const issue = useIssueData();
    const { commentsStore } = useContextStore();

    // State to manage sorted comments
    const [sortedComments, setSortedComments] = useState<IssueCommentType[]>(
      [],
    );

    const { users, isLoading } = useUsersData(true);

    useEffect(() => {
      // Fetch and sort comments whenever the order or comments change
      const comments = commentsStore.getComments(issue.id);
      let sorted = [...comments];
      sorted = sort(sorted)[
        commentOrder > 0 ? 'desc' : commentOrder === 0 ? 'asc' : 'asc'
      ]((comment) =>
        commentOrder >= 0
          ? new Date(comment.updatedAt).getTime()
          : new Date(comment.createdAt).getTime(),
      );

      setSortedComments(sorted); // Update state with sorted comments
    }, [commentOrder, commentsStore, commentsStore.comments.length, issue.id]);

    function getUserData(userId: string) {
      return users.find((user: User) => user.id === userId);
    }

    function getChildComments(issueCommentId: string) {
      return sortedComments.filter(
        (comment: IssueCommentType) => comment.parentId === issueCommentId,
      );
    }

    if (isLoading) {
      return null;
    }

    return (
      <div className="my-2 w-full flex flex-col gap-4">
        {commentOrder == 1 && <IssueComment />}
        <Timeline>
          {sortedComments
            .filter((comment: IssueCommentType) => !comment.parentId)
            .map((comment: IssueCommentType, index: number) => (
              <CommentActivity
                issueId={issue.id}
                commentId={comment.id}
                hasMore={index > 0}
                key={comment.id}
                user={getUserData(comment.userId)}
                childComments={getChildComments(comment.id)}
                allowReply
                getUserData={getUserData}
              />
            ))}
        </Timeline>

        {commentOrder < 1 && <IssueComment />}
      </div>
    );
  },
);
