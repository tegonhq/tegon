import { Separator } from '@tegonhq/ui/components/ui/separator';
import { observer } from 'mobx-react-lite';

import type { IssueType, TeamType } from 'common/types';

import { useContextStore } from 'store/global-context-provider';

import { TeamDropdown } from './team-dropdown';
import { TemplateDropdown } from './templates-dropdown';

interface NewIssueHeaderProps {
  team: TeamType;
  setTeam: (value: string) => void;
  resetFormValues: (defaultValues: Partial<IssueType>) => void;
}

export const NewIssueHeader = observer(
  ({ team, setTeam, resetFormValues }: NewIssueHeaderProps) => {
    const { templatesStore } = useContextStore();
    const templates = templatesStore.getTemplatesForTeam(team.id);

    const applyTemplate = (templateData: string) => {
      resetFormValues(JSON.parse(templateData));
    };

    return (
      <div className="flex p-4 pb-0 gap-2 items-center">
        <TeamDropdown
          value={team.identifier}
          onChange={(value: string) => setTeam(value)}
        />
        {templates.length > 0 && (
          <>
            <Separator orientation="vertical" className="h-5" />
            <TemplateDropdown
              templates={templates}
              applyTemplate={applyTemplate}
            />
          </>
        )}
      </div>
    );
  },
);
