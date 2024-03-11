/** Copyright (c) 2024, Tegon, all rights reserved. **/

export function IssueComment() {
  return (
    <TimelineItem className="mb-2" hasMore={false}>
      <div className="flex items-center text-xs text-muted-foreground">
        <Avatar className="h-[20px] w-[25px] mr-4 text-foreground">
          <AvatarImage />
          <AvatarFallback className="bg-teal-500 dark:bg-teal-900 text-xs rounded-sm">
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
  );
}
