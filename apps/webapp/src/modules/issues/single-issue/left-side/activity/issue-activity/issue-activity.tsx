import { AvatarText } from '@tegonhq/ui/components/avatar';
import { Timeline, TimelineItem } from '@tegonhq/ui/components/timeline';
import { observer } from 'mobx-react-lite';

import type { User } from 'common/types';
import type { IssueHistoryType } from 'common/types';
import type { LinkedIssueType } from 'common/types';

import { useIssueData } from 'hooks/issues';
import { useUsersData } from 'hooks/users';

import { useContextStore } from 'store/global-context-provider';

import { ActivityItem } from './activity-item';
import { LinkedIssueActivity } from './linked-issue-activity';
import { getUserDetails } from './user-activity-utils';

enum ActivityType {
  Comment = 'Comment',
  Default = 'Default',
  LinkedIssue = 'LinkedIssue',
}

export const IssueActivity = observer(() => {
  const issue = useIssueData();

  // Clear this out later
  const issueSourceMetadata = issue.sourceMetadata
    ? JSON.parse(issue.sourceMetadata)
    : undefined;

  const { usersData, isLoading } = useUsersData(issue.teamId);

  const {
    issuesHistoryStore,
    linkedIssuesStore: { linkedIssues },
  } = useContextStore();

  const activities = [
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

  return (
    <div className="my-2">
      <Timeline>
        <TimelineItem hasMore={false} date={issue.createdAt}>
          <div className="flex items-center text-muted-foreground">
            <AvatarText
              text={issueCreatedUser.fullname}
              className="mr-4 text-[9px]"
            />

            <div className="flex items-center">
              <span className="text-foreground mr-2 font-medium">
                {issueCreatedUser.username}
              </span>
              created the issue
            </div>
          </div>
        </TimelineItem>

        {activities.length > 0 &&
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          activities.map((activity: any) => {
            if (activity.type === ActivityType.LinkedIssue) {
              return (
                <TimelineItem
                  className="w-full"
                  key={`${activity.id}-comment`}
                  hasMore
                  date={activity.updatedAt}
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
      </Timeline>
    </div>
  );
});
