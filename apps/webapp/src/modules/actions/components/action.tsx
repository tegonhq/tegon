// import { useParams } from 'next/navigation';

import { AvatarText } from '@tegonhq/ui/components/avatar';
import { cn } from '@tegonhq/ui/lib/utils';
import type { ActionType } from 'common/types';
import { useUserData } from 'hooks/users';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/router';
import ReactTimeAgo from 'react-time-ago';
import { convertToTitleCase } from 'common/common-utils';

interface ActionProps {
  action: ActionType;
  noBorder: boolean;
}

export function Action({ action, noBorder }: ActionProps) {
  const { actionSlug } = useParams();
  const { userData, isLoading } = useUserData(action.createdById);
  const {
    query: { workspaceSlug },
    push,
  } = useRouter();

  if (isLoading) {
    return null;
  }

  return (
    <div
      key={action.id}
      className={cn(
        'ml-4 p-2 py-0 mr-4 hover:bg-grayAlpha-300 rounded',
        actionSlug === action.slug && 'bg-grayAlpha-300',
      )}
      onClick={() => {
        push(`/${workspaceSlug}/actions/${action.slug}`);
      }}
    >
      <div
        className={cn(
          'flex flex-col gap-1 py-2',
          !noBorder && 'border-b border-border',
        )}
      >
        <div className="flex justify-between text-sm">
          <div className="w-[calc(100%_-_70px)]">
            <div className="truncate">{convertToTitleCase(action.name)}</div>
          </div>
        </div>

        <div className="flex justify-between text-sm">
          {userData && (
            <div className="flex items-center gap-1">
              <AvatarText
                text={userData?.fullname}
                className="h-5 w-5 text-[9px] mr-2"
              />
              {userData.fullname}
            </div>
          )}
          <div className="text-muted-foreground text-xs">
            <ReactTimeAgo date={new Date(action.updatedAt)} />
          </div>
        </div>
      </div>
    </div>
  );
}
