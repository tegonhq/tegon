/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import ReactTimeAgo from 'react-time-ago';

import type { IssueCommentType, IssueHistoryType } from 'common/types/issue';
import type { LinkedIssueType } from 'common/types/linked-issue';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  getInitials,
} from 'components/ui/avatar';
import { Timeline, TimelineItem } from 'components/ui/timeline';
import { useIssueData } from 'hooks/issues';
import { useUsersData } from 'hooks/users';

import { useContextStore } from 'store/global-context-provider';
import type { User } from 'store/user-context';

import { ActivityItem } from './activity-item';
import { CommentActivity } from './comment-activity';
import { IssueComment } from './issue-comment';
import { LinkedIssueActivity } from './linked-issue-activity';

enum ActivityType {
  Comment = 'Comment',
  Default = 'Default',
  LinkedIssue = 'LinkedIssue',
}

export const IssueActivity = observer(() => {
  const issue = useIssueData();
  const { usersData, isLoading } = useUsersData(issue.teamId);

  const {
    commentsStore,
    issuesHistoryStore: { issueHistories },
    linkedIssuesStore: { linkedIssues },
  } = useContextStore();

  const activities = [
    ...commentsStore.getComments(issue.id).map((comment: IssueCommentType) => ({
      ...comment,
      type: ActivityType.Comment,
    })),
    ...issueHistories.map((issueHistory: IssueHistoryType) => ({
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

  const issueCreatedUser =
    usersData && usersData.find((user: User) => user.id === issue.createdById);

  function getChildComments(issueCommentId: string) {
    return activities.filter(
      (activity) =>
        activity.type === ActivityType.Comment &&
        activity.parentId === issueCommentId,
    );
  }

  return (
    <div className="px-4">
      <div className="my-4">
        <div>Activity</div>
      </div>

      <div className="my-2">
        <Timeline>
          <TimelineItem className="mb-2" hasMore={false}>
            <div className="flex items-center text-xs text-muted-foreground">
              <Avatar className="h-[20px] w-[25px] mr-4 text-foreground">
                <AvatarImage />
                <AvatarFallback className="bg-teal-500 dark:bg-teal-900 text-[0.6rem] rounded-sm">
                  {getInitials(issueCreatedUser.fullname)}
                </AvatarFallback>
              </Avatar>

              <div className="flex items-center">
                <span className="text-foreground mr-2 font-medium">
                  {issueCreatedUser.username}
                </span>
                created the issue
              </div>
              <div className="mx-1">-</div>

              <div>
                <ReactTimeAgo date={issue.createdAt} />
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
                  <TimelineItem
                    className="my-2 w-full"
                    key={`${activity.id}-comment`}
                    hasMore
                  >
                    <CommentActivity
                      comment={activity}
                      key={activity.id}
                      user={getUserData(activity.userId)}
                      childComments={getChildComments(activity.id)}
                      allowReply
                      getUserData={getUserData}
                    />
                  </TimelineItem>
                );
              }

              if (activity.type === ActivityType.LinkedIssue) {
                return (
                  <TimelineItem
                    className="my-2 w-full"
                    key={`${activity.id}-comment`}
                    hasMore
                  >
                    <LinkedIssueActivity linkedIssue={activity} />
                  </TimelineItem>
                );
              }

              if (activity.type === ActivityType.Default) {
                return (
                  <ActivityItem
                    issueHistory={activity}
                    key={activity.id}
                    user={getUserData(activity.userId)}
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
