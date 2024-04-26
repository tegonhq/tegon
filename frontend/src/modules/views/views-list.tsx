/** Copyright (c) 2024, Tegon, all rights reserved. **/

import dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import type { ViewType } from 'common/types/view';

import { useCurrentTeam } from 'hooks/teams';
import { useUserData } from 'hooks/users';

import { useContextStore } from 'store/global-context-provider';

interface ViewItemProps {
  view: ViewType;
}

export function ViewItem({ view }: ViewItemProps) {
  const { teamIdentifier, workspaceSlug } = useParams();
  const { userData } = useUserData(view.createdById);

  return (
    <Link
      href={`/${workspaceSlug}/team/${teamIdentifier}/views/${view.id}`}
      className="flex gap-2 text-xs text-foreground items-center pl-8 pr-4 py-2 border-b hover:bg-active/50"
    >
      <div className="min-w-[200px] grow flex flex-col gap-1">
        <div className="font-medium">{view.name}</div>
        {view.description && (
          <div className="text-muted-foreground">{view.description}</div>
        )}
      </div>
      <div className="min-w-[70px]">
        {dayjs(view.createdAt).format('DD MMM')}
      </div>
      <div className="min-w-[70px]">{userData?.username}</div>
    </Link>
  );
}

export const ViewsList = observer(() => {
  const { viewsStore } = useContextStore();
  const team = useCurrentTeam();

  const views = viewsStore.getViewsForTeam(team.id);

  return (
    <div className="flex flex-col">
      <div className="flex gap-2 text-sm text-muted-foreground pl-8 pr-4 py-2 border-b">
        <div className="min-w-[200px] grow">Name</div>
        <div className="min-w-[70px]">Created</div>
        <div className="min-w-[70px]">Created by</div>
      </div>

      {views.map((view: ViewType) => (
        <ViewItem view={view} key={view.id} />
      ))}
    </div>
  );
});
