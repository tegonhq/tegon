
import {Team} from '../../team/entities/team.entity'
import {User} from '../../user/entities/user.entity'


export class Issue {
  id: string ;
createdAt: Date ;
updatedAt: Date ;
deleted: Date  | null;
title: string ;
number: number ;
description: string ;
priority: number  | null;
dueDate: Date  | null;
sortOrder: number ;
subIssueSortOrder: number  | null;
team?: Team ;
teamId: string ;
createdBy?: User ;
createdById: string ;
subscriberIds: string[] ;
assigneeIds: string[] ;
labelIds: string[] ;
stateId: string ;
parent?: Issue  | null;
parentId: string  | null;
subIssue?: Issue[] ;
}
