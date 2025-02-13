import type { ActionConfig } from '@tegonhq/types';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@tegonhq/ui/components/card';
import Link from 'next/link';

import { useCurrentWorkspace } from 'hooks/workspace';

interface ActionCardProps {
  action: ActionConfig;
}

export function ActionCard({ action }: ActionCardProps) {
  const workspace = useCurrentWorkspace();

  return (
    <Link href={`/${workspace.slug}/settings/actions/${action.slug}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">
            {action.name}
          </CardTitle>
          <CardDescription>{action.description}</CardDescription>
        </CardHeader>
        {/* {action.config.integrations && (
          <CardFooter className="flex justify-start">
            {action.config.integrations.map((integration: string) => (
              <Badge
                variant="secondary"
                key={integration}
                className="flex items-center gap-1 text-base"
              >
                {integration}
              </Badge>
            ))}
          </CardFooter>
        )} */}
      </Card>
    </Link>
  );
}
