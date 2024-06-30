/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiBookmarkFill, RiBookmarkLine } from '@remixicon/react';
import dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { cn } from 'common/lib/utils';
import type { ViewType } from 'common/types/view';

import { Button } from 'components/ui/button';
import { useCurrentTeam } from 'hooks/teams';
import { useUserData } from 'hooks/users';

import { useUpdateViewMutation } from 'services/views';

import { useContextStore } from 'store/global-context-provider';

interface ViewItemProps {
  view: ViewType;
}

export function ViewItem({ view }: ViewItemProps) {
  const { teamIdentifier, workspaceSlug } = useParams();
  const { userData } = useUserData(view.createdById);
  const { mutate: updateView } = useUpdateViewMutation({});

  return (
    <Link
      href={`/${workspaceSlug}/team/${teamIdentifier}/views/${view.id}`}
      className="flex gap-2 text-foreground items-center pl-8 pr-4 py-2 border-b"
    >
      <div className="min-w-[200px] grow flex flex-col gap-1">
        <div className="font-medium flex items-center group gap-2 min-h-[25px]">
          <div>{view.name}</div>

          <Button
            variant="ghost"
            size="sm"
            className={cn(
              view.isBookmarked
                ? 'flex items-center'
                : 'hidden items-center group-hover:flex',
            )}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              updateView({
                viewId: view.id,
                filters: view.filters,
                isBookmarked: !view.isBookmarked,
              });
            }}
          >
            {view.isBookmarked ? (
              <RiBookmarkFill size={14} className="text-yellow-600" />
            ) : (
              <RiBookmarkLine size={14} />
            )}
          </Button>
        </div>
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

      {views
        .filter((view: ViewType) => view.isBookmarked)
        .map((view: ViewType) => (
          <ViewItem view={view} key={view.id} />
        ))}
      {views
        .filter((view: ViewType) => !view.isBookmarked)
        .map((view: ViewType) => (
          <ViewItem view={view} key={view.id} />
        ))}
    </div>
  );
});
