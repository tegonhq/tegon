/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';

import type { TeamType } from 'common/types/team';

import { Button } from 'components/ui/button';

interface TeamListItemProps {
  name: string;
  team: TeamType;
  // TODO fix this as a remix icon
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon?: any;
  subList?: boolean;
  href: string;
}

export const TeamListItem = ({
  name,
  team,
  Icon,
  href,
  subList = false,
}: TeamListItemProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const isActive =
    pathname ===
    `/${router.query.workspaceSlug}/team/${team.identifier}/${href}`;

  const redirect = (location: string) => {
    router.push(location);
  };

  if (subList) {
    return (
      <Button
        size="sm"
        variant="ghost"
        isActive={isActive}
        onClick={() =>
          redirect(
            `/${router.query.workspaceSlug}/team/${team.identifier}/${href}`,
          )
        }
        className="w-full text-sm flex justify-start px-2 mb-1"
      >
        {name}
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      isActive={isActive}
      onClick={() =>
        redirect(
          `/${router.query.workspaceSlug}/team/${team.identifier}/${href}`,
        )
      }
      className="w-full text-sm flex justify-start px-5 mb-1"
    >
      {Icon && (
        <Icon className="mr-3 arrow-right-icon ml-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
      )}
      {name}
    </Button>
  );
};
