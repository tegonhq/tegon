/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { useFilterIssues } from 'modules/issues/issues-utils';

import { Tabs, TabsContent, TabsList, TabsTrigger } from 'components/ui/tabs';

import { useContextStore } from 'store/global-context-provider';

import { AssigneeInsights } from './assignee-insights';
import { LabelInsights } from './label-insights';
import { StatusInsights } from './status-insights';
import { PriorityInsights } from './priority-insights';

interface OverviewInsightsProps {
  title: string;
}

export function OverviewInsights({ title }: OverviewInsightsProps) {
  const { issuesStore } = useContextStore();
  const computedIssues = useFilterIssues(issuesStore.getIssues());

  return (
    <div className="flex flex-col">
      <div className="text-sm p-3 border-b">{title}</div>

      <Tabs className="p-2" defaultValue="status">
        <TabsList className="flex w-full gap-2 justify-between bg-active">
          <TabsTrigger value="status" className="text-xs">
            Status
          </TabsTrigger>
          <TabsTrigger value="assignee" className="text-xs">
            Assignee
          </TabsTrigger>
          <TabsTrigger value="label" className="text-xs">
            Labels
          </TabsTrigger>
          <TabsTrigger value="priority" className="text-xs">
            Priority
          </TabsTrigger>
        </TabsList>

        <TabsContent value="status">
          <StatusInsights issues={computedIssues} />
        </TabsContent>

        <TabsContent value="label">
          <LabelInsights issues={computedIssues} />
        </TabsContent>

        <TabsContent value="assignee">
          <AssigneeInsights issues={computedIssues} />
        </TabsContent>

        <TabsContent value="priority">
          <PriorityInsights issues={computedIssues} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
