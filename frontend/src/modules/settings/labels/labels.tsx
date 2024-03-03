/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { LabelType } from 'common/types/label';

import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Separator } from 'components/ui/separator';

import { useLabelStore } from 'store/labels';

import { EditLabel } from './edit-label';
import { Label } from './label';
import { NewLabel } from './new-label';

export const Labels = observer(() => {
  const labelStore = useLabelStore();
  const [showNewLabelCreation, setNewLabelCreation] = React.useState(false);
  const [editLabelState, setEditLabelState] = React.useState(undefined);
  const [searchValue, setSearchValue] = React.useState('');

  return (
    <div>
      <div className="flex flex-col">
        <h2 className="text-2xl"> Workspace Labels </h2>
        <p className="text-sm text-muted-foreground">Manage workspace labels</p>
      </div>

      <Separator className="my-4" />

      <div className="my-4">
        <p className="my-4 text-sm text-muted-foreground">
          Use labels and label groups to help organize and filter issues in your
          workspace. Labels created in this section are available for all teams
          to use. To create labels or label groups that only apply to certain
          teams, add them in the team-specific label settings.
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
            <NewLabel onCancel={() => setNewLabelCreation(false)} />
          </div>
        )}
      </div>

      <div>
        {labelStore.labels
          .filter((label: LabelType) => label.name.includes(searchValue))
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
