/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import ReactTimeAgo from 'react-time-ago';

import type { IssueCommentType, IssueHistoryType } from 'common/types/issue';
import type { LinkedIssueType } from 'common/types/linked-issue';

import { Timeline, TimelineItem } from 'components/ui/timeline';
import { useIssueData } from 'hooks/issues';
import { useUsersData } from 'hooks/users';

import { useContextStore } from 'store/global-context-provider';
import type { User } from 'store/user-context';

import { ActivityItem } from './activity-item';
import { CommentActivity } from './comment-activity';
import { IssueComment } from './issue-comment';
import { LinkedIssueActivity } from './linked-issue-activity';
import { SubscribeView } from './subscribe-view';
import { getUserDetails, getUserIcon } from './user-activity-utils';

enum ActivityType {
  Comment = 'Comment',
  Default = 'Default',
  LinkedIssue = 'LinkedIssue',
}

export const IssueActivity = observer(() => {
  const issue = useIssueData();
  const issueSourceMetadata = JSON.parse(issue.sourceMetadata);
  const { usersData, isLoading } = useUsersData(issue.teamId);

  const {
    commentsStore,
    issuesHistoryStore,
    linkedIssuesStore: { linkedIssues },
  } = useContextStore();

  const activities = [
    ...commentsStore.getComments(issue.id).map((comment: IssueCommentType) => ({
      ...comment,
      type: ActivityType.Comment,
    })),
    ...issuesHistoryStore
      .getIssueHistories(issue.id)
      .map((issueHistory: IssueHistoryType) => ({
        ...issueHistory,
        type: ActivityType.Default,
      })),
    ...linkedIssues.map((linkedIssue: LinkedIssueType) => ({
      ...linkedIssue,
      type: ActivityType.LinkedIssue,
    })),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ].sort((a: any, b: any) => {
    if (new Date(a.updatedAt) > new Date(b.updatedAt)) {
      return 1;
    } else if (new Date(a.updatedAt) < new Date(b.updatedAt)) {
      return -1;
    }
    return 0;
  });

  function getUserData(userId: string) {
    return usersData.find((user: User) => user.id === userId);
  }

  if (isLoading) {
    return null;
  }

  const issueCreatedUser = getUserDetails(
    issueSourceMetadata,
    usersData && getUserData(issue.createdById),
  );

  function getChildComments(issueCommentId: string) {
    return activities.filter(
      (activity) =>
        activity.type === ActivityType.Comment &&
        activity.parentId === issueCommentId,
    );
  }

  return (
    <div className="px-4">
      <div className="my-4 flex justify-between">
        <div>Activity</div>
        <SubscribeView />
      </div>

      <div className="my-2">
        <Timeline>
          <TimelineItem hasMore={false}>
            <div className="flex items-center text-xs text-muted-foreground">
              {getUserIcon(issueCreatedUser, issueSourceMetadata?.type)}

              <div className="flex items-center">
                <span className="text-foreground mr-2 font-medium">
                  {issueCreatedUser.username}
                </span>
                created the issue
              </div>
              <div className="mx-1">-</div>

              <div>
                <ReactTimeAgo date={new Date(issue.createdAt)} />
              </div>
            </div>
          </TimelineItem>

          {activities.length > 0 &&
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            activities.map((activity: any) => {
              if (
                activity.type === ActivityType.Comment &&
                !activity.parentId
              ) {
                return (
                  <CommentActivity
                    comment={activity}
                    key={activity.id}
                    user={getUserData(activity.userId)}
                    childComments={getChildComments(activity.id)}
                    allowReply
                    getUserData={getUserData}
                  />
                );
              }

              if (activity.type === ActivityType.LinkedIssue) {
                return (
                  <TimelineItem
                    className="w-full"
                    key={`${activity.id}-comment`}
                    hasMore
                  >
                    <LinkedIssueActivity linkedIssue={activity} />
                  </TimelineItem>
                );
              }

              if (activity.type === ActivityType.Default) {
                const sourceMetadata = activity.userId
                  ? undefined
                  : JSON.parse(activity.sourceMetadata);

                return (
                  <ActivityItem
                    issueHistory={activity}
                    key={activity.id}
                    user={getUserDetails(
                      sourceMetadata,
                      getUserData(activity.userId),
                    )}
                  />
                );
              }

              return null;
            })}

          <IssueComment />
        </Timeline>
      </div>
    </div>
  );
});
