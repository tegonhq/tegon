
import {Prisma} from '@prisma/client'
import {Issue} from '../../issue/entities/issue.entity'


export class LinkedIssues {
  id: string ;
createdAt: Date ;
updatedAt: Date ;
deleted: Date  | null;
title: string ;
url: string ;
sourceId: string ;
source: Prisma.JsonValue  | null;
sourceData: Prisma.JsonValue  | null;
issue?: Issue ;
issueId: string ;
}
