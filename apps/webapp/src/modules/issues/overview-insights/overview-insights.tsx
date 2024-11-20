import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@tegonhq/ui/components/tabs';

import { useProject } from 'hooks/projects';
import { useCurrentTeam } from 'hooks/teams';
import { useLocalState } from 'hooks/use-local-state';

import { useContextStore } from 'store/global-context-provider';

import { AssigneeInsights } from './assignee-insights';
import { LabelInsights } from './label-insights';
import { StatusInsights } from './status-insights';

export function OverviewInsights() {
  const { issuesStore, applicationStore } = useContextStore();
  const team = useCurrentTeam();
  const project = useProject();
  const [tab, setTab] = useLocalState('insights-tabs', 'status');

  const issues = issuesStore.getIssues({
    projectId: project?.id,
    teamId: team?.id,
    subIssue: applicationStore.displaySettings.showSubIssues,
  });

  return (
    <div className="flex flex-col overflow-hidden">
      <Tabs
        className="overflow-hidden"
        value={tab}
        onValueChange={(newValue: string) => setTab(newValue)}
      >
        <TabsList className="grid w-full grid-cols-3 bg-transparent gap-2 p-4">
          <TabsTrigger value="status" className="bg-grayAlpha-100">
            Status
          </TabsTrigger>
          <TabsTrigger value="assignee" className="bg-grayAlpha-100">
            Assignee
          </TabsTrigger>
          <TabsTrigger value="label" className="bg-grayAlpha-100">
            Labels
          </TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="overflow-auto h-full">
          <StatusInsights issues={issues} />
        </TabsContent>

        <TabsContent value="label" className="overflow-auto h-full">
          <LabelInsights issues={issues} />
        </TabsContent>

        <TabsContent value="assignee" className="overflow-auto h-full">
          <AssigneeInsights issues={issues} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
