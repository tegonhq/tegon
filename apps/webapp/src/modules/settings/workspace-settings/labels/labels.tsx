import type { LabelType } from '@tegonhq/types';

import { Button } from '@tegonhq/ui/components/button';
import { Input } from '@tegonhq/ui/components/input';
import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { SettingSection } from 'modules/settings/setting-section';

import { useContextStore } from 'store/global-context-provider';

import { EditLabel } from './edit-label';
import { Label } from './label';
import { NewLabel } from './new-label';

export const Labels = observer(() => {
  const { labelsStore } = useContextStore();

  const [showNewLabelCreation, setNewLabelCreation] = React.useState(false);
  const [editLabelState, setEditLabelState] = React.useState(undefined);
  const [searchValue, setSearchValue] = React.useState('');

  return (
    <SettingSection
      title="Workspace labels"
      description="  Use labels and label groups to help organize and filter issues in your
          workspace. Labels created in this section are available for all teams
          to use. To create labels or label groups that only apply to certain
          teams, add them in the team-specific label settings."
    >
      <div className="flex flex-col">
        <div className="mb-4">
          <div className="flex justify-between">
            <div className="flex gap-3">
              <Button
                disabled={showNewLabelCreation}
                variant="secondary"
                onClick={() => {
                  setNewLabelCreation(true);
                }}
              >
                New label
              </Button>
            </div>
            <div className="flex">
              <Input
                placeholder="Filter by name"
                onChange={(e) => setSearchValue(e.currentTarget.value)}
              />
            </div>
          </div>

          {showNewLabelCreation && (
            <div className="my-3">
              <NewLabel onCancel={() => setNewLabelCreation(false)} />
            </div>
          )}
        </div>

        <div>
          {labelsStore.labels
            .filter(
              (label: LabelType) =>
                label.name.includes(searchValue) && !label.teamId,
            )
            .map((label: LabelType) => {
              if (editLabelState === label.id) {
                return (
                  <EditLabel
                    key={label.name}
                    label={label}
                    onCancel={() => setEditLabelState(undefined)}
                  />
                );
              }

              return (
                <Label
                  key={label.name}
                  label={label}
                  setEditLabelState={(labelId) => setEditLabelState(labelId)}
                />
              );
            })}
        </div>
      </div>
    </SettingSection>
  );
});
