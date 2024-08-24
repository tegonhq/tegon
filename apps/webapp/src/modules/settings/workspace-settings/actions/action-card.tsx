import { Button } from '@tegonhq/ui/components/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@tegonhq/ui/components/card';

import type { ActionSource } from 'services/action';
interface ActionCardProps {
  action: ActionSource;
}

export function ActionCard({ action }: ActionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{action.name}</CardTitle>
        <CardDescription>{action.description}</CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-start">
        <Button variant="secondary"> Use this action</Button>
      </CardFooter>
    </Card>
  );
}
