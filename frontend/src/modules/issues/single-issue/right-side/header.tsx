/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { useRouter } from 'next/router';

export function Header() {
  const {
    query: { issueId },
  } = useRouter();

  return (
    <div className="flex pl-8 px-4 py-4 w-full border-b justify-between items-center">
      <div className="text-sm text-muted-foreground">{issueId}</div>
    </div>
  );
}
