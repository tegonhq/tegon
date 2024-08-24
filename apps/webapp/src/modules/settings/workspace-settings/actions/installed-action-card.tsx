import { buttonVariants } from '@tegonhq/ui/components/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@tegonhq/ui/components/card';
import { cn } from '@tegonhq/ui/lib/utils';
import Link from 'next/link';

import type { ActionType } from 'common/types';

import { useCurrentWorkspace } from 'hooks/workspace';

import { useGetExternalActionDataQuery } from 'services/action';
interface ActionCardProps {
  action: ActionType;
}

export function InstalledActionCard({ action }: ActionCardProps) {
  const workspace = useCurrentWorkspace();
  const { data: latestAction } = useGetExternalActionDataQuery(action.slug);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{action.name}</CardTitle>
        <CardDescription>{latestAction?.description}</CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-start">
        <Link
          href={`/${workspace.slug}/settings/actions/${action.slug}`}
          className={cn(buttonVariants({ variant: 'secondary' }))}
        >
          Edit configuration
        </Link>
      </CardFooter>
    </Card>
  );
}
