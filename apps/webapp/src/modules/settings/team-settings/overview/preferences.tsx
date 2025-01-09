import { RiClipboardLine } from '@remixicon/react';
import { Button } from '@tegonhq/ui/components/button';
import { Input } from '@tegonhq/ui/components/input';
import { useToast } from '@tegonhq/ui/components/use-toast';
import copy from 'copy-to-clipboard';
import { observer } from 'mobx-react-lite';

import { SettingSection } from 'modules/settings/setting-section';

import { useCurrentTeam } from 'hooks/teams';

export const Preferences = observer(() => {
  const team = useCurrentTeam();
  const { toast } = useToast();

  const teamEmail = `triage+${team?.id}@tegon.ai`;

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
      </div>
    </SettingSection>
  );
});
