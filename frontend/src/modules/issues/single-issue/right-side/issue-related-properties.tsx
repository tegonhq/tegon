/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import React from 'react';

import { RelatedIssueItem } from 'modules/issues/components/related-issue-item';

import { type IssueType } from 'common/types/issue';
import {
  IssueRelationEnum,
  type IssueRelationType,
} from 'common/types/issue-relation';

import { useIssueData } from 'hooks/issues';

import { useContextStore } from 'store/global-context-provider';

const TITLE_MAP = {
  [IssueRelationEnum.BLOCKS]: 'Blocking',
  [IssueRelationEnum.BLOCKED]: 'Blocked by',
  [IssueRelationEnum.DUPLICATE_OF]: 'Duplicate of',
  [IssueRelationEnum.RELATED]: 'Related',
};

interface RelatedIssue {
  relation: IssueRelationType;
  issue: IssueType;
}

export const IssueRelatedProperties = observer(() => {
  const { issueRelationsStore, issuesStore } = useContextStore();
  const issue = useIssueData();

  const getRelatedIssues = React.useCallback(
    (relationType: IssueRelationEnum) => {
      const relatedIssues = issueRelationsStore
        .getIssueRelationForType(issue.id, relationType)

        .map((relationAct: IssueRelationType) => {
          return {
            issue: issuesStore.getIssueById(relationAct.relatedIssueId),
            relation: relationAct,
          };
        });

      return relatedIssues;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [issueRelationsStore, issuesStore],
  );

  const getComponent = (
    issueRelationType: IssueRelationEnum,
    index: number,
  ) => {
    if (issueRelationType === IssueRelationEnum.BLOCKS) {
      const relatedIssues = getRelatedIssues(IssueRelationEnum.BLOCKS);

      if (relatedIssues.length === 0) {
        return null;
      }

      return (
        <div
          className="flex flex-col justify-start text-sm items-start gap-2 mb-6"
          key={index}
        >
          <div className="text-muted-foreground text-left">
            {TITLE_MAP[issueRelationType as keyof typeof TITLE_MAP]}
          </div>

          <div className="flex flex-col items-center gap-2 flex-wrap -ml-2">
            {relatedIssues.map((relatedIssue: RelatedIssue, index: number) => (
              <RelatedIssueItem
                key={index}
                issue={relatedIssue.issue}
                relation={relatedIssue.relation}
              />
            ))}
          </div>
        </div>
      );
    }

    if (issueRelationType === IssueRelationEnum.BLOCKED) {
      const relatedIssues = getRelatedIssues(IssueRelationEnum.BLOCKED);

      if (relatedIssues.length === 0) {
        return null;
      }

      return (
        <div
          className="flex flex-col justify-start text-sm items-start gap-2 mb-6"
          key={index}
        >
          <div className="text-muted-foreground text-left">
            {TITLE_MAP[issueRelationType as keyof typeof TITLE_MAP]}
          </div>

          <div className="flex flex-col items-start gap-2 flex-wrap -ml-2">
            {relatedIssues.map((relatedIssue: RelatedIssue, index: number) => (
              <RelatedIssueItem
                key={index}
                issue={relatedIssue.issue}
                relation={relatedIssue.relation}
              />
            ))}
          </div>
        </div>
      );
    }

    if (issueRelationType === IssueRelationEnum.RELATED) {
      const relatedIssues = getRelatedIssues(IssueRelationEnum.RELATED);

      if (relatedIssues.length === 0) {
        return null;
      }

      return (
        <div
          className="flex flex-col justify-start text-sm items-start gap-2 mb-6"
          key={index}
        >
          <div className="text-muted-foreground text-left">
            {TITLE_MAP[issueRelationType as keyof typeof TITLE_MAP]}
          </div>

          <div className="flex flex-col items-start gap-2 flex-wrap -ml-2">
            {relatedIssues.map((relatedIssue: RelatedIssue, index: number) => (
              <RelatedIssueItem
                key={index}
                issue={relatedIssue.issue}
                relation={relatedIssue.relation}
              />
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return Object.values(IssueRelationEnum).map(
    (issueRelationType: IssueRelationEnum, index: number) => {
      return getComponent(issueRelationType, index);
    },
  );
});
