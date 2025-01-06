import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@tegonhq/ui/components/tabs';
import { observer } from 'mobx-react-lite';

import { useCycle } from 'hooks/cycles';
import { useProject } from 'hooks/projects';
import { useCurrentTeam } from 'hooks/teams';
import { useLocalState } from 'hooks/use-local-state';
import { useComputedWorkflows } from 'hooks/workflows';

import { useContextStore } from 'store/global-context-provider';

import { AssigneeInsights } from './assignee-insights';
import { LabelInsights } from './label-insights';
import { useFilterIssues } from '../issues-utils';

export const OverviewInsights = observer(() => {
  const { issuesStore, applicationStore } = useContextStore();
  const team = useCurrentTeam();
  const project = useProject();
  const cycle = useCycle();
  const [tab, setTab] = useLocalState('insights-tabs', 'assignee');

  const issues = issuesStore.getIssues({
    projectId: project?.id,
    teamId: team?.id,
    cycleId: cycle?.id,
    subIssue: applicationStore.displaySettings.showSubIssues,
  });
  const { workflows } = useComputedWorkflows();

  const computedIssues = useFilterIssues(issues, workflows, false);

  return (
    <div className="flex flex-col overflow-hidden h-full">
      <Tabs
        className="overflow-hidden flex flex-col"
        value={tab}
        onValueChange={(newValue: string) => setTab(newValue)}
      >
        <TabsList className="grid w-full grid-cols-2 bg-transparent gap-2 p-4">
          <TabsTrigger value="assignee" className="bg-grayAlpha-100">
            Assignee
          </TabsTrigger>
          <TabsTrigger value="label" className="bg-grayAlpha-100">
            Labels
          </TabsTrigger>
        </TabsList>

        <TabsContent value="label" className="overflow-auto h-full">
          <LabelInsights issues={computedIssues} />
        </TabsContent>

        <TabsContent value="assignee" className="overflow-auto h-full">
          <AssigneeInsights issues={computedIssues} />
        </TabsContent>
      </Tabs>
    </div>
  );
});
