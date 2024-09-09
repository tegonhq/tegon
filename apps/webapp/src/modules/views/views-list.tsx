import { AvatarText } from '@tegonhq/ui/components/avatar';
import { Button } from '@tegonhq/ui/components/button';
import { BookMark } from '@tegonhq/ui/icons';
import dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import type { ViewType } from 'common/types';

import { useCurrentTeam } from 'hooks/teams';
import { useUserData } from 'hooks/users';

import { useUpdateViewMutation } from 'services/views';

import { useContextStore } from 'store/global-context-provider';

interface ViewItemProps {
  view: ViewType;
}

export function ViewItem({ view }: ViewItemProps) {
  const { teamIdentifier, workspaceSlug } = useParams();
  const { user } = useUserData(view.createdById);
  const { mutate: updateView } = useUpdateViewMutation({});

  return (
    <Link
      href={`/${workspaceSlug}/team/${teamIdentifier}/views/${view.id}`}
      className="flex gap-2 text-foreground items-center pl-8 pr-4 py-2 border-b border-border"
    >
      <div className="min-w-[200px] grow flex flex-col">
        <div className="font-medium flex items-center min-h-[25px]">
          <div>{view.name}</div>

          <Button
            variant="ghost"
            size="sm"
            className={'flex items-center'}
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
              <BookMark size={14} className="text-amber-600" />
            ) : (
              <BookMark size={14} />
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
      {user && (
        <div className="min-w-[70px] flex gap-2">
          <AvatarText text={user?.fullname} className="w-5 h-5 text-[9px]" />

          {user?.fullname}
        </div>
      )}
    </Link>
  );
}

export const ViewsList = observer(() => {
  const { viewsStore } = useContextStore();
  const team = useCurrentTeam();

  const views = viewsStore.getViewsForTeam(team.id);

  return (
    <div className="flex flex-col">
      <div className="flex gap-2 text-sm text-muted-foreground pl-8 pr-4 py-2 border-b border-border">
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
