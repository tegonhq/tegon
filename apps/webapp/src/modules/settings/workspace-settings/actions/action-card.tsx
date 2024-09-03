import { Badge } from '@tegonhq/ui/components/badge';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@tegonhq/ui/components/card';
import Link from 'next/link';

import { useCurrentWorkspace } from 'hooks/workspace';

import type { ActionSource } from 'services/action';

interface ActionCardProps {
  action: ActionSource;
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
        {action.config.integrations && (
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
        )}
      </Card>
    </Link>
  );
}
