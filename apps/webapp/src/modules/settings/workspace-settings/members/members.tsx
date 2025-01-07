import { Button } from '@tegonhq/ui/components/button';
import { Loader } from '@tegonhq/ui/components/loader';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { SettingSection } from 'modules/settings/setting-section';

import type { User } from 'common/types';

import { useUsersData } from 'hooks/users';

import { AddMemberDialog } from './add-member-dialog';
import { MemberItem } from './member-item';
import { Input } from '@tegonhq/ui/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@tegonhq/ui/components/ui/collapsible';
import { ChevronDown, ChevronRight } from '@tegonhq/ui/icons';
import { BadgeColor } from '@tegonhq/ui/components/ui/badge';

export const Members = observer(() => {
  const { users, isLoading } = useUsersData(false);
  const [newMemberDialog, setNewMemberDialog] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const [filteredUsers, setFilteredUsers] = React.useState<User[]>([]);
  const [isOpen, setIsOpen] = React.useState(true);
  React.useEffect(() => {
    // Initialize filtered users with all users
    console.log(users);
    
    setFilteredUsers(users);
  }, [users]);

  React.useEffect(() => {
    // Filter users when search value changes
    const filtered = users.filter((user) =>
      user.fullname.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.email.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchValue, users]);
  
  return (
    <>
      <SettingSection
        title="Members"
        description=" Manage who has access to this workspace"
      >
        <div>
          {isLoading && <Loader />}

          {!isLoading && (
            <div className="flex flex-col">
              <div className="flex justify-between items-center">
                <Button
                  variant="secondary"
                  onClick={() => setNewMemberDialog(true)}
                >
                  Add member
                </Button>
                {/* <h3 className="text-xs">{users.length} Members </h3> */}
                <div className="flex">
              <Input
                placeholder="Filter by name"
                onChange={(e) => setSearchValue(e.currentTarget.value)}
              />
            </div>
              </div>

              <div className="mt-4 flex flex-col">
              <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="flex flex-col gap-2"
      >
        <div className="flex gap-1 items-center">
          <CollapsibleTrigger asChild>
            <Button
              className="flex group items-center w-fit rounded-2xl bg-grayAlpha-100"
              variant="ghost"
              size="lg"
            >
              <BadgeColor
                style={{ backgroundColor: 'rgb(131, 131, 131)' }}
                className="w-2 h-2 group-hover:hidden"
              />
              <div className="hidden group-hover:block">
                {isOpen ? (
                  <ChevronDown size={20} />
                ) : (
                  <ChevronRight size={20} />
                )}
              </div>
              <h3 className="pl-2">Active</h3>
            </Button>
          </CollapsibleTrigger>

          <div className="rounded-2xl bg-grayAlpha-100 p-1.5 px-2 font-mono">
            {filteredUsers.length}
          </div>
        </div>

        <CollapsibleContent>
        {filteredUsers.map((userData: User, index) => (
                  <MemberItem
                    key={userData.id}
                    id={userData.id}
                    name={userData.fullname}
                    email={userData.email}
                    Workspace={userData.role === 'ADMIN' ? true : false}
                    className={index === users.length - 1 && 'pb-0 !border-b-0'}
                  />
                ))}
        </CollapsibleContent>
      </Collapsible>
                
              </div>
            </div>
          )}
        </div>
      </SettingSection>
      {newMemberDialog && (
        <AddMemberDialog setDialogOpen={setNewMemberDialog} />
      )}
    </>
  );
});
