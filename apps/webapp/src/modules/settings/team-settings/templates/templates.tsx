import { Button } from '@tegonhq/ui/components/button';
import { observer } from 'mobx-react-lite';
import React from 'react';

import type { TemplateType } from 'common/types';

import { useCurrentTeam } from 'hooks/teams';

import { useContextStore } from 'store/global-context-provider';

import { CreateNewTemplate } from './create-new-template';
import { Template } from './template';
import { SettingSection } from '../../setting-section';

export const Templates = observer(() => {
  const team = useCurrentTeam();
  const { templatesStore } = useContextStore();
  const [createTemplate, setCreateTemplate] = React.useState(false);

  const templates = templatesStore.getTemplatesForTeam(team.id);

  return (
    <SettingSection
      title="Templates"
      description="Any templates created here will be available while creating issues in that respective team"
    >
      <div className="flex flex-col gap-1">
        <div className="flex w-full justify-end">
          <Button variant="secondary" onClick={() => setCreateTemplate(true)}>
            Create template
          </Button>
        </div>

        {createTemplate && (
          <div className="mt-4">
            <CreateNewTemplate onClose={() => setCreateTemplate(false)} />
          </div>
        )}

        <div className="flex flex-col gap-1 pt-4">
          {templates.map((template: TemplateType, index: number) => (
            <Template template={template} key={index} />
          ))}
        </div>
      </div>
    </SettingSection>
  );
});
