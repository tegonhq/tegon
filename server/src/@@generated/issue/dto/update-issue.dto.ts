





export class UpdateIssueDto {
  deleted?: Date;
title?: string;
number?: number;
description?: string;
priority?: number;
dueDate?: Date;
sortOrder?: number;
subIssueSortOrder?: number;
subscriberIds?: string[];
assigneeIds?: string[];
labelIds?: string[];
stateId?: string;
}
