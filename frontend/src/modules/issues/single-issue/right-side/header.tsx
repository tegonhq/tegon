/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiClipboardLine, RiGitBranchLine, RiLinkM } from '@remixicon/react';
import { useRouter } from 'next/router';

import { Button } from 'components/ui/button';

export function Header() {
  const {
    query: { issueId },
  } = useRouter();

  return (
    <div className="flex pl-8 px-4 py-[14px] w-full border-b items-center">
      <div className="text-sm text-muted-foreground w-[95px] text-left">
        {issueId}
      </div>

      <div className="flex gap-1 justify-start">
        <Button variant="ghost" size="xs">
          <RiLinkM size={16} className="text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="xs">
          <RiClipboardLine size={16} className="text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="xs">
          <RiGitBranchLine size={16} className="text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}
