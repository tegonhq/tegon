import type { LabelType } from 'common/types';

import { Button } from '@tegonhq/ui/components/button';
import { Input } from '@tegonhq/ui/components/input';
import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { EditLabel } from 'modules/settings/workspace-settings/labels/edit-label';
import { Label } from 'modules/settings/workspace-settings/labels/label';
import { NewLabel } from 'modules/settings/workspace-settings/labels/new-label';

import { useCurrentTeam } from 'hooks/teams';

import { useContextStore } from 'store/global-context-provider';

import { SettingSection } from '../setting-section';

export const Labels = observer(() => {
  const { labelsStore } = useContextStore();

  const currentTeam = useCurrentTeam();

  const [showNewLabelCreation, setNewLabelCreation] = React.useState(false);
  const [editLabelState, setEditLabelState] = React.useState(undefined);
  const [searchValue, setSearchValue] = React.useState('');

  return (
    <SettingSection
      title="Team labels"
      description={`Manage team ${currentTeam.name} specific labels`}
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
              <NewLabel
                onCancel={() => setNewLabelCreation(false)}
                teamId={currentTeam.id}
              />
            </div>
          )}
        </div>

        <div>
          {labelsStore.labels
            .filter(
              (label: LabelType) =>
                label.name.includes(searchValue) &&
                label.teamId === currentTeam.id,
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
