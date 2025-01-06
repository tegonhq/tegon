import { RiClipboardLine } from '@remixicon/react';
import { Button } from '@tegonhq/ui/components/button';
import { Input } from '@tegonhq/ui/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@tegonhq/ui/components/select';
import { useToast } from '@tegonhq/ui/components/ui/use-toast';
import copy from 'copy-to-clipboard';
import { observer } from 'mobx-react-lite';

import { SettingSection } from 'modules/settings/setting-section';

import { useCurrentTeam } from 'hooks/teams';

import { useUpdateTeamPreferencesMutation } from 'services/team';

export const Preferences = observer(() => {
  const team = useCurrentTeam();
  const { toast } = useToast();

  const teamEmail = `triage+${team?.id}@tegon.ai`;

  const { mutate: updateTeamPreferences } = useUpdateTeamPreferencesMutation(
    {},
  );

  const onValueChange = (value: string) => {
    updateTeamPreferences({
      triage: value === 'Enabled' ? true : false,
      teamId: team.id,
    });
  };

  return (
    <SettingSection
      title="Team preferences"
      description="Manage your team preferences"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <h3 className="text-lg"> Create by email </h3>

          <p className="text-muted-foreground">
            With the unique email created for your team, you can send or forward
            emails and we will automatically create issues in triage from them.
          </p>

          <div className="flex gap-1 max-w-[500px] mt-2">
            <Input value={teamEmail} />
            <Button
              variant="ghost"
              onClick={() => {
                copy(teamEmail);
                toast({
                  description: 'Email is copied to clipboard',
                });
              }}
            >
              <RiClipboardLine size={16} className="text-muted-foreground" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col">
          <h3 className="text-lg"> Triage </h3>

          <p className="text-muted-foreground">
            Triage is a special Inbox for your team. When an issue is created by
            integration or by a workspace member not belonging to your specific
            team, it will appear here. Triage offers a chance to review, update,
            and prioritize issues before they are added to your team workflow
          </p>

          <div className="flex gap-1 max-w-[500px] mt-2">
            <Select
              onValueChange={onValueChange}
              defaultValue={team.preferences.triage ? 'Enabled' : 'Disabled'}
            >
              <SelectTrigger className="flex gap-1 items-center">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="disabled" value="Disabled">
                  Disabled
                </SelectItem>
                <SelectItem key="enabled" value="Enabled">
                  Enabled
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </SettingSection>
  );
});
