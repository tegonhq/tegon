import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@tegonhq/ui/components/tabs';

import { useFilterIssues } from 'modules/issues/issues-utils';

import { useCurrentTeam } from 'hooks/teams';
import { useComputedWorkflows } from 'hooks/workflows';

import { useContextStore } from 'store/global-context-provider';

import { AssigneeInsights } from './assignee-insights';
import { LabelInsights } from './label-insights';
import { PriorityInsights } from './priority-insights';
import { StatusInsights } from './status-insights';

interface OverviewInsightsProps {
  title: string;
}

export function OverviewInsights({ title }: OverviewInsightsProps) {
  const { issuesStore } = useContextStore();
  const team = useCurrentTeam();
  const { workflows } = useComputedWorkflows();

  const computedIssues = useFilterIssues(
    issuesStore.getIssuesForTeam(team.id),
    workflows,
  );

  return (
    <div className="flex flex-col">
      <div className="text-sm p-3 border-b">{title}</div>

      <Tabs className="p-2" defaultValue="status">
        <TabsList className="flex w-full gap-2 justify-between bg-accent">
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
