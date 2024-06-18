/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';

import { SettingSection } from 'modules/settings/setting-section';

import { Loader } from 'components/ui/loader';
import { useUsersData } from 'hooks/users';

import type { User } from 'store/user-context';

import { MemberItem } from './member-item';

export const Members = observer(() => {
  const { usersData, isLoading } = useUsersData();

  return (
    <SettingSection
      title="Members"
      description=" Manage who has access to this workspace"
    >
      <div>
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
                  className={
                    index === usersData.length - 1 && 'pb-0 !border-b-0'
                  }
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </SettingSection>
  );
});
