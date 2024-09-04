import { Badge } from '@tegonhq/ui/components/badge';
import { observer } from 'mobx-react-lite';
import { useParams } from 'next/navigation';

import { useGetExternalActionDataQuery } from 'services/action';

export const Metadata = observer(() => {
  const { actionSlug } = useParams<{ actionSlug: string }>();
  const { data: latestAction } = useGetExternalActionDataQuery(actionSlug);

  return (
    <div className="grow flex flex-col gap-4">
      <div className="min-w-[80px] flex flex-col gap-1">
        <div className="flex gap-1">
          {latestAction?.config?.integrations.map((integration: string) => (
            <Badge
              variant="secondary"
              key={integration}
              className="flex items-center gap-1 text-base"
            >
              {integration}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
});
