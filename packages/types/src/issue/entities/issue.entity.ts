
import {Prisma} from '@prisma/client'
import {Team} from '../../team/entities/team.entity'
import {User} from '../../user/entities/user.entity'
import {IssueComment} from '../../issueComment/entities/issueComment.entity'
import {IssueHistory} from '../../issueHistory/entities/issueHistory.entity'
import {LinkedIssue} from '../../linkedIssue/entities/linkedIssue.entity'
import {IssueRelation} from '../../issueRelation/entities/issueRelation.entity'
import {IssueSuggestion} from '../../issueSuggestion/entities/issueSuggestion.entity'


export class Issue {
  id: string ;
createdAt: Date ;
updatedAt: Date ;
deleted: Date  | null;
title: string ;
number: number ;
description: string  | null;
priority: number  | null;
dueDate: Date  | null;
sortOrder: number  | null;
subIssueSortOrder: number  | null;
estimate: number  | null;
sourceMetadata: Prisma.JsonValue  | null;
isBidirectional: boolean  | null;
team?: Team ;
teamId: string ;
createdBy?: User  | null;
createdById: string  | null;
subscriberIds: string[] ;
assigneeId: string  | null;
labelIds: string[] ;
stateId: string ;
parent?: Issue  | null;
parentId: string  | null;
subIssue?: Issue[] ;
attachments: string[] ;
comments?: IssueComment[] ;
history?: IssueHistory[] ;
linkedIssue?: LinkedIssue[] ;
issueRelations?: IssueRelation[] ;
IssueSuggestion?: IssueSuggestion  | null;
issueSuggestionId: string  | null;
}
