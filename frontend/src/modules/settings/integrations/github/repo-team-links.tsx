/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiAddLine } from '@remixicon/react';
import { observer } from 'mobx-react-lite';
import React from 'react';

import type { TeamType } from 'common/types/team';

import { Button } from 'components/ui/button';
import { Dialog, DialogTrigger } from 'components/ui/dialog';
import { useTeams } from 'hooks/teams';

import { RepoTeamLinkDialog } from './repo-team-link-dialog';
import { TeamRepoItems } from './team-repo-items';

export const RepoTeamLinks = observer(() => {
  const [open, setOpen] = React.useState(false);
  const teams = useTeams();

  return (
    <div className="flex flex-col text-sm border rounded-md p-3 mt-8 items-center">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h3 className="font-medium">GitHub Issues</h3>
          <p className="text-muted-foreground">
            Automatically import and sync issues from selected Github
            repositories into a designated Team
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" onClick={() => {}}>
              <RiAddLine size={16} />
            </Button>
          </DialogTrigger>
          <RepoTeamLinkDialog
            defaultValues={{}}
            onClose={() => setOpen(false)}
          />
        </Dialog>
      </div>

      <div className="mt-4 w-full">
        {teams.map((team: TeamType) => (
          <TeamRepoItems team={team} key={team.id} />
        ))}
      </div>
    </div>
  );
});
