/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { EditLabel } from 'modules/settings/labels/edit-label';
import { Label } from 'modules/settings/labels/label';
import { NewLabel } from 'modules/settings/labels/new-label';

import type { LabelType } from 'common/types/label';

import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Separator } from 'components/ui/separator';
import { useCurrentTeam } from 'hooks/teams';

import { useContextStore } from 'store/global-context-provider';

export const Labels = observer(() => {
  const { labelsStore } = useContextStore();

  const currentTeam = useCurrentTeam();

  const [showNewLabelCreation, setNewLabelCreation] = React.useState(false);
  const [editLabelState, setEditLabelState] = React.useState(undefined);
  const [searchValue, setSearchValue] = React.useState('');

  return (
    <div>
      <div className="flex flex-col">
        <h2 className="text-2xl"> Labels </h2>
        <p className="text-sm text-muted-foreground">
          Manage team {currentTeam.name} specific labels
        </p>
      </div>

      <Separator className="my-4" />

      <div className="my-4">
        <p className="my-4 text-sm text-muted-foreground">
          Use labels to help organize and filter issues in your team. Labels
          created in this section are specific to this team, so they can be
          customized to your team’s needs.
        </p>
        <div className="flex justify-between">
          <div className="flex">
            <Input
              placeholder="Filter by name"
              onChange={(e) => setSearchValue(e.currentTarget.value)}
            />
          </div>

          <div className="flex gap-3">
            <Button
              disabled={showNewLabelCreation}
              onClick={() => {
                setNewLabelCreation(true);
              }}
            >
              New label
            </Button>
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
  );
});
