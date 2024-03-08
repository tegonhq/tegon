/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';

import { MemberItem } from 'modules/settings/members/member-item';

import { Loader } from 'components/ui/loader';
import { Separator } from 'components/ui/separator';
import { useCurrentTeam } from 'hooks/teams';
import { useUsersData } from 'hooks/users';

import type { User } from 'store/user-context';

export const Members = observer(() => {
  const currentTeam = useCurrentTeam();
  const { usersData, isLoading } = useUsersData(currentTeam.id);

  return (
    <div>
      <div className="flex flex-col">
        <h2 className="text-2xl"> Team Members </h2>
        <p className="text-sm text-muted-foreground">
          Manage who is a member of the {currentTeam.name} team
        </p>
      </div>

      <Separator className="my-4" />

      {isLoading && <Loader />}

      {!isLoading && (
        <div className="flex flex-col">
          <h3 className="text-xs mb-2"> {usersData.length} Members </h3>

          <div className="mt-4 flex flex-col gap-4">
            {usersData.map((userData: User, index) => (
              <MemberItem
                key={userData.id}
                name={userData.fullname}
                email={userData.email}
                className={index === usersData.length - 1 && 'pb-0 !border-b-0'}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
