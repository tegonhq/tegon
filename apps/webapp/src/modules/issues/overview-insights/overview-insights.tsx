import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@tegonhq/ui/components/tabs';

import { useProject } from 'hooks/projects';
import { useCurrentTeam } from 'hooks/teams';

import { useContextStore } from 'store/global-context-provider';

import { AssigneeInsights } from './assignee-insights';
import { LabelInsights } from './label-insights';
import { StatusInsights } from './status-insights';

export function OverviewInsights() {
  const { issuesStore, applicationStore } = useContextStore();
  const team = useCurrentTeam();
  const project = useProject();

  const issues = issuesStore.getIssues({
    projectId: project?.id,
    teamId: team?.id,
    subIssue: applicationStore.displaySettings.showSubIssues,
  });

  return (
    <div className="flex flex-col">
      <Tabs className="p-2" defaultValue="status">
        <TabsList className="grid w-full grid-cols-3 bg-transparent gap-2 p-0">
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

        <TabsContent value="status">
          <StatusInsights issues={issues} />
        </TabsContent>

        <TabsContent value="label">
          <LabelInsights issues={issues} />
        </TabsContent>

        <TabsContent value="assignee">
          <AssigneeInsights issues={issues} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
