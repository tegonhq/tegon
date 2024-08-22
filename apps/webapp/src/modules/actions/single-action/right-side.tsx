import { AvatarText } from '@tegonhq/ui/components/avatar';
import { Badge } from '@tegonhq/ui/components/badge';
import { observer } from 'mobx-react-lite';
import { useParams } from 'next/navigation';

import { useUserData } from 'hooks/users';

import { useContextStore } from 'store/global-context-provider';

import { StatusMapping } from '../utils';

type StatusMapKey = keyof typeof StatusMapping;

export const RightSide = observer(() => {
  const { actionSlug } = useParams();
  const { actionsStore } = useContextStore();
  const action = actionsStore.getAction(actionSlug);

  const { userData, isLoading } = useUserData(action?.createdById);

  if (isLoading) {
    return null;
  }
  return (
    <div className="grow p-6 flex flex-col gap-4">
      <div className="min-w-[80px] flex flex-col gap-1">
        <div className="text-sm">State</div>
        <div>{StatusMapping[action.status as StatusMapKey]}</div>
      </div>

      <div className="min-w-[80px] flex flex-col gap-1">
        <div className="text-sm">Version</div>
        <div>v{action.version}</div>
      </div>

      <div className="min-w-[80px] flex flex-col gap-1">
        <div className="text-sm">Integrations</div>
        <div className="flex gap-1">
          {action.integrations.map((integration: string) => (
            <Badge
              variant="secondary"
              key={integration}
              className="flex items-center gap-1"
            >
              {integration}
            </Badge>
          ))}
        </div>
      </div>

      <div className="min-w-[80px] flex flex-col gap-1">
        <div className="text-sm">Created by</div>
        <div className="flex gap-1 items-center">
          <AvatarText text={userData.fullname} /> {userData.fullname}
        </div>
      </div>
    </div>
  );
});
