





export class UpdateIssueDto {
  deleted?: Date;
title?: string;
number?: number;
description?: string;
priority?: number;
dueDate?: Date;
sortOrder?: number;
subIssueSortOrder?: number;
estimate?: number;
subscriberIds?: string[];
assigneeId?: string;
labelIds?: string[];
stateId?: string;
}
