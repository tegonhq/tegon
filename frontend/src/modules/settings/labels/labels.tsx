/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';

import { LabelType } from 'common/types/label';

import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Separator } from 'components/ui/separator';

import { useLabelStore } from 'store/label';

import { Label } from './label';

export const Labels = observer(() => {
  const labelStore = useLabelStore();

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
            <Input placeholder="Filter by name" />
          </div>

          <div className="flex gap-3">
            <Button variant="outline"> New group </Button>
            <Button> New label </Button>
          </div>
        </div>
      </div>

      <div>
        {labelStore.labels.map((label: LabelType) => (
          <Label key={label.name} label={label} />
        ))}
      </div>
    </div>
  );
});
