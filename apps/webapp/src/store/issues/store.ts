import {
  type IAnyStateTreeNode,
  type Instance,
  types,
  flow,
} from 'mobx-state-tree';

import type { IssueType } from 'common/types';

import { tegonDatabase } from 'store/database';

import { Issue, IssuesMap } from './models';

export const IssuesStore: IAnyStateTreeNode = types
  .model('IssuesStore', {
    issuesMap: IssuesMap,
    teamId: types.union(types.string, types.undefined),
  })
  .actions((self) => {
    const update = (issue: IssueType, id: string) => {
      self.issuesMap.set(id, Issue.create(issue));
    };

    const updateIssue = (updateProps: Partial<IssueType>, id: string) => {
      const issue = self.issuesMap.get(id);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const issueJson = (issue as any).toJSON();
      self.issuesMap.set(id, { ...issueJson, ...updateProps });
    };

    const deleteById = (id: string) => {
      self.issuesMap.delete(id);
    };

    const load = flow(function* () {
      const issues = yield tegonDatabase.issues.toArray();

      issues.forEach((issue: IssueType) => {
        self.issuesMap.set(issue.id, Issue.create(issue));
      });
    });

    return { update, deleteById, load, updateIssue };
  })
  .views((self) => ({
    getIssues() {
      return Array.from(self.issuesMap.values());
    },
    getIssuesForState(stateIds: string[], showSubIssues: boolean) {
      return Array.from(self.issuesMap.values()).filter((issue: IssueType) => {
        const isSubIssue = showSubIssues ? !issue.parentId : true;

        return stateIds.includes(issue.stateId) && isSubIssue;
      });
    },
    getIssuesForUser(
      showSubIssues: boolean,
      { userId, teamId }: { userId?: string; teamId?: string },
    ) {
      if (userId) {
        return Array.from(self.issuesMap.values()).filter(
          (issue: IssueType) => {
            const isTeamIssues = teamId ? issue.teamId === teamId : true;
            const isSubIssue = showSubIssues ? !issue.parentId : true;

            return issue.assigneeId === userId && isSubIssue && isTeamIssues;
          },
        );
      }

      return Array.from(self.issuesMap.values()).filter((issue: IssueType) => {
        const isTeamIssues = teamId ? issue.teamId === teamId : true;

        if (!showSubIssues) {
          return !issue.assigneeId && !issue.parentId && isTeamIssues;
        }

        return !issue.assigneeId && isTeamIssues;
      });
    },
    getIssuesForTeam(teamId: string, showSubIssues: boolean = true) {
      return Array.from(self.issuesMap.values()).filter((issue: IssueType) => {
        const isTeamIssues = teamId ? issue.teamId === teamId : true;
        const isSubIssue = showSubIssues ? !issue.parentId : true;

        return isTeamIssues && isSubIssue;
      });
    },
    getIssuesForPriority(
      priority: number,
      showSubIssues: boolean,
      teamId?: string,
    ) {
      return Array.from(self.issuesMap.values()).filter((issue: IssueType) => {
        const isSubIssue = showSubIssues ? !issue.parentId : true;
        const isTeamIssues = teamId ? issue.teamId === teamId : true;

        return issue.priority === priority && isTeamIssues && isSubIssue;
      });
    },
    getIssuesForLabel(
      labelId: string | undefined,
      showSubIssues: boolean,
      teamId?: string,
    ) {
      if (!labelId) {
        return Array.from(self.issuesMap.values()).filter(
          (issue: IssueType) => {
            const isSubIssue = showSubIssues ? !issue.parentId : true;
            const isTeamIssues = teamId ? issue.teamId === teamId : true;

            return issue.labelIds.length === 0 && isSubIssue && isTeamIssues;
          },
        );
      }

      return Array.from(self.issuesMap.values()).filter((issue: IssueType) =>
        showSubIssues
          ? issue.labelIds.includes(labelId) && issue.teamId === teamId
          : issue.labelIds.includes(labelId) &&
            issue.teamId === teamId &&
            !issue.parentId,
      );
    },
    getIssuesForNoLabel(showSubIssues: boolean, teamId: string) {
      return Array.from(self.issuesMap.values()).filter((issue: IssueType) =>
        showSubIssues
          ? issue.labelIds.length === 0 && issue.teamId === teamId
          : issue.labelIds.length === 0 &&
            issue.teamId === teamId &&
            !issue.parentId,
      );
    },
    getIssueById(issueId: string): IssueType {
      const issue = self.issuesMap.get(issueId);

      if (!issue) {
        return undefined;
      }

      return {
        ...issue,
        parent: issue.parentId ? self.issuesMap.get(issue.parentId) : undefined,
        children: Array.from(self.issuesMap.values()).filter(
          (is: IssueType) => is.parentId === issue.id,
        ),
      };
    },
    getIssuesFromArray(issueIds: string[]): IssueType[] {
      return issueIds
        .map((issueId: string) =>
          (self as IssuesStoreType).getIssueById(issueId),
        )
        .filter(Boolean);
    },
    getIssueByNumber(
      issueNumberWithIdentifier: string,
      teamId: string,
    ): IssueType {
      const issueNumber = parseInt(
        (issueNumberWithIdentifier as string).split('-')[1],
      );

      const issue = Array.from(self.issuesMap.values()).find(
        (issue: IssueType) =>
          issue.number === issueNumber && issue.teamId === teamId,
      );

      if (!issue) {
        return undefined;
      }

      return {
        ...issue,
        parent: issue.parentId ? self.issuesMap.get(issue.parentId) : undefined,
        children: Array.from(self.issuesMap.values()).filter(
          (is: IssueType) => is.parentId === issue.id,
        ),
      };
    },
    getSubIssues(issueId: string): IssueType[] {
      return Array.from(self.issuesMap.values()).filter(
        (issue: IssueType) => issue.parentId === issueId,
      );
    },

    // Used by filters
    isSubIssue(issueId: string): boolean {
      const issues = Array.from(self.issuesMap.values()).filter(
        (issue: IssueType) => issue.parentId === issueId,
      );

      return issues.length > 0;
    },
  }));

export type IssuesStoreType = Instance<typeof IssuesStore>;
