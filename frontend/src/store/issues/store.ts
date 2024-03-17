/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/
import {
  type IAnyStateTreeNode,
  type Instance,
  types,
  flow,
} from 'mobx-state-tree';

import type { IssueType } from 'common/types/issue';

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
    const deleteById = (id: string) => {
      self.issuesMap.delete(id);
    };

    const load = flow(function* (teamId: string) {
      self.teamId = teamId;

      const issues = teamId
        ? yield tegonDatabase.issues
            .where({
              teamId,
            })
            .toArray()
        : [];

      issues.forEach((issue: IssueType) => {
        self.issuesMap.set(issue.id, Issue.create(issue));
      });
    });

    return { update, deleteById, load };
  })
  .views((self) => ({
    getIssuesForState(stateId: string, teamId: string, showSubIssues: boolean) {
      return Array.from(self.issuesMap.values()).filter((issue: IssueType) =>
        showSubIssues
          ? issue.teamId === teamId && issue.stateId === stateId
          : issue.teamId === teamId &&
            issue.stateId === stateId &&
            !issue.parentId,
      );
    },
    getIssuesForUser(showSubIssues: boolean, userId?: string) {
      if (userId) {
        return Array.from(self.issuesMap.values()).filter(
          (issue: IssueType) => {
            if (!showSubIssues) {
              return issue.assigneeId === userId && !issue.parentId;
            }

            return issue.assigneeId === userId;
          },
        );
      }

      return Array.from(self.issuesMap.values()).filter((issue: IssueType) => {
        if (!showSubIssues) {
          return !issue.assigneeId && !issue.parentId;
        }

        return !issue.assigneeId;
      });
    },
    getIssuesForPriority(priority: number, showSubIssues: boolean) {
      return Array.from(self.issuesMap.values()).filter((issue: IssueType) =>
        showSubIssues
          ? issue.priority === priority
          : issue.priority === priority && !issue.parentId,
      );
    },
    getIssueById(issueId: string): IssueType {
      const issue = self.issuesMap.get(issueId);

      return {
        ...issue,
        parent: issue.parentId ? self.issuesMap.get(issue.parentId) : undefined,
        children: Array.from(self.issuesMap.values()).filter(
          (is: IssueType) => is.parentId === issue.id,
        ),
      };
    },
    getIssueByNumber(issueNumberWithIdentifier: string): IssueType {
      const issueNumber = parseInt(
        (issueNumberWithIdentifier as string).split('-')[1],
      );

      const issue = Array.from(self.issuesMap.values()).find(
        (issue: IssueType) => issue.number === issueNumber,
      );

      return {
        ...issue,
        parent: issue.parentId ? self.issuesMap.get(issue.parentId) : undefined,
        children: Array.from(self.issuesMap.values()).filter(
          (is: IssueType) => is.parentId === issue.id,
        ),
      };
    },
  }));

export type IssuesStoreType = Instance<typeof IssuesStore>;
