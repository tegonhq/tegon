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

      // Second pass: Build parent-child relationships
      issues.forEach((issue: IssueType) => {
        if (issue.parentId) {
          const parent = self.issuesMap.get(issue.parentId);
          if (parent) {
            // Add this issue to parent's children array
            parent.children.push(issue.id);
          }
        }
      });
    });

    return { update, deleteById, load, updateIssue };
  })
  .views((self) => ({
    getIssues({
      teamId,
      projectId,
      cycleId,
    }: {
      teamId?: string;
      projectId?: string;
      cycleId?: string;
    }) {
      return Array.from(self.issuesMap.values()).filter((issue: IssueType) => {
        const isFromProject = projectId ? issue.projectId === projectId : true;
        const isTeamIssues = teamId ? issue.teamId === teamId : true;
        const isCycleIssue = cycleId ? issue.cycleId === cycleId : true;

        return isTeamIssues && isFromProject && isCycleIssue;
      });
    },
    getIssuesForState(
      stateIds: string[],
      { cycleId, projectId }: { cycleId?: string; projectId?: string },
    ) {
      return Array.from(self.issuesMap.values()).filter((issue: IssueType) => {
        const isFromProject = projectId ? issue.projectId === projectId : true;
        const isFromCycle = cycleId ? issue.cycleId === cycleId : true;

        return stateIds.includes(issue.stateId) && isFromProject && isFromCycle;
      });
    },
    getIssuesForUser({
      userId,
      teamId,
      cycleId,
      projectId,
    }: {
      userId?: string;
      teamId?: string;
      projectId?: string;
      cycleId?: string;
    }) {
      if (userId) {
        return Array.from(self.issuesMap.values()).filter(
          (issue: IssueType) => {
            const isTeamIssues = teamId ? issue.teamId === teamId : true;
            const isFromCycle = cycleId ? issue.cycleId === cycleId : true;

            const isFromProject = projectId
              ? issue.projectId === projectId
              : true;

            return (
              issue.assigneeId === userId &&
              isTeamIssues &&
              isFromCycle &&
              isFromProject
            );
          },
        );
      }

      return Array.from(self.issuesMap.values()).filter((issue: IssueType) => {
        const isTeamIssues = teamId ? issue.teamId === teamId : true;

        return !issue.assigneeId && isTeamIssues;
      });
    },
    getIssuesForProject({
      teamId,
      projectId,
      cycleId,
    }: {
      teamId?: string;
      projectId?: string;
      cycleId?: string;
    }) {
      return Array.from(self.issuesMap.values()).filter((issue: IssueType) => {
        const isTeamIssues = teamId ? issue.teamId === teamId : true;
        const isFromCycle = cycleId ? issue.cycleId === cycleId : true;
        const isFromProject = projectId ? issue.projectId === projectId : true;

        return isTeamIssues && isFromProject && isFromCycle;
      });
    },
    getIssuesForCycle({
      teamId,
      cycleId,
    }: {
      teamId?: string;
      cycleId?: string;
    }) {
      return Array.from(self.issuesMap.values()).filter((issue: IssueType) => {
        const isTeamIssues = teamId ? issue.teamId === teamId : true;
        const isFromCycle = cycleId ? issue.cycleId === cycleId : true;

        return isTeamIssues && isFromCycle;
      });
    },
    getIssuesForNoProject({
      teamId,
      cycleId,
    }: {
      teamId?: string;
      cycleId?: string;
    }) {
      return Array.from(self.issuesMap.values()).filter((issue: IssueType) => {
        const isTeamIssues = teamId ? issue.teamId === teamId : true;
        const isFromCycle = cycleId ? issue.cycleId === cycleId : true;

        return isTeamIssues && !issue.projectId && isFromCycle;
      });
    },
    getIssuesForTeam({
      teamId,
      projectId,
      cycleId,
    }: {
      teamId: string;
      projectId: string;
      cycleId?: string;
    }) {
      return Array.from(self.issuesMap.values()).filter((issue: IssueType) => {
        const isTeamIssues = teamId ? issue.teamId === teamId : true;
        const isFromProject = projectId ? issue.projectId === projectId : true;
        const isFromCycle = cycleId ? issue.cycleId === cycleId : true;

        return isTeamIssues && isFromProject && isFromCycle;
      });
    },
    getIssuesForPriority(
      priority: number,
      {
        teamId,
        projectId,
        cycleId,
      }: { teamId?: string; projectId?: string; cycleId?: string },
    ) {
      return Array.from(self.issuesMap.values()).filter((issue: IssueType) => {
        const isTeamIssues = teamId ? issue.teamId === teamId : true;
        const isFromProject = projectId ? issue.projectId === projectId : true;
        const isFromCycle = cycleId ? issue.cycleId === cycleId : true;

        return (
          issue.priority === priority &&
          isTeamIssues &&
          isFromProject &&
          isFromCycle
        );
      });
    },
    getIssuesForLabel(
      labelIds: string[] | undefined,
      {
        teamId,
        projectId,
        cycleId,
      }: { teamId?: string; projectId?: string; cycleId?: string },
    ) {
      return Array.from(self.issuesMap.values()).filter((issue: IssueType) => {
        const isFromProject = projectId ? issue.projectId === projectId : true;
        const isTeamIssues = teamId ? issue.teamId === teamId : true;
        const isFromCycle = cycleId ? issue.cycleId === cycleId : true;

        return (
          labelIds.some((labelId) => issue.labelIds.includes(labelId)) &&
          isTeamIssues &&
          isFromProject &&
          isFromCycle
        );
      });
    },
    getIssuesForNoLabel({
      teamId,
      projectId,
      cycleId,
    }: {
      teamId?: string;
      projectId?: string;
      cycleId?: string;
    }) {
      return Array.from(self.issuesMap.values()).filter((issue: IssueType) => {
        const isFromProject = projectId ? issue.projectId === projectId : true;
        const isTeamIssues = teamId ? issue.teamId === teamId : true;
        const isFromCycle = cycleId ? issue.cycleId === cycleId : true;

        return (
          issue.labelIds.length === 0 &&
          isTeamIssues &&
          isFromProject &&
          isFromCycle
        );
      });
    },

    getIssueById(issueId: string): IssueType {
      const issue = self.issuesMap.get(issueId);

      if (!issue) {
        return undefined;
      }

      return {
        ...issue,
        parent: issue.parentId ? self.issuesMap.get(issue.parentId) : undefined,
        children: [],
      };
    },
    getIssueByIdWithChildren(issueId: string): IssueType {
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
      return self.issuesMap
        .get(issueId)
        .children.map((id) => self.issuesMap.get(id));
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
