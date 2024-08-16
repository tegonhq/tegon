import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IssueRelation, IssueRelationIdRequestDto } from '@tegonhq/types';
import { SessionContainer } from 'supertokens-node/recipe/session';

import { AuthGuard } from 'modules/auth/auth.guard';
import { Session as SessionDecorator } from 'modules/auth/session.decorator';

import IssuesRelationService from './issue-relation.service';

@Controller({
  version: '1',
  path: 'issue_relation',
})
@ApiTags('Issue Relation')
export class IssueRelationController {
  constructor(private issueRelation: IssuesRelationService) {}

  @Delete(':issueRelationId')
  @UseGuards(AuthGuard)
  async deleteLabel(
    @SessionDecorator() session: SessionContainer,
    @Param()
    issueRelationId: IssueRelationIdRequestDto,
  ): Promise<IssueRelation> {
    const userId = session.getUserId();
    return await this.issueRelation.deleteIssueRelation(
      userId,
      issueRelationId,
    );
  }
}
