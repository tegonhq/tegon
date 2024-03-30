/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiClipboardLine, RiGitBranchLine } from '@remixicon/react';
import copy from 'copy-to-clipboard';
import { useRouter } from 'next/router';
import React from 'react';

import { Button } from 'components/ui/button';
import { useToast } from 'components/ui/use-toast';

import { UserContext } from 'store/user-context';

export function Header() {
  const {
    query: { issueId },
  } = useRouter();
  const userdata = React.useContext(UserContext);
  const { toast } = useToast();

  return (
    <div className="flex pl-7 px-4 py-3 w-full border-b justify-between items-center">
      <div className="text-sm text-muted-foreground w-[95px] text-left">
        {issueId}
      </div>

      <div className="flex gap-1 justify-center ml-1">
        {/* <Button variant="ghost" size="xs"   onClick={() => copy(`${userdata.username}/${issueId}`)}>
          <RiLinkM size={16} className="text-muted-foreground" />
        </Button> */}
        <Button
          variant="ghost"
          size="xs"
          onClick={() => {
            copy(issueId as string);
            toast({
              title: `${issueId}`,
              description: 'Issue id copied to clipboard',
            });
          }}
        >
          <RiClipboardLine size={16} className="text-muted-foreground" />
        </Button>
        <Button
          variant="ghost"
          size="xs"
          onClick={() => {
            copy(`${userdata.username}/${issueId}`);
            toast({
              title: `${userdata.username}/${issueId}`,
              description: 'Branch name copied to clipboard',
            });
          }}
        >
          <RiGitBranchLine size={16} className="text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}
