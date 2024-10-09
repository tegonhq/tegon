import { Button } from '@tegonhq/ui/components/button';
import { CreateIssueLine, HelpLine, SearchLine } from '@tegonhq/ui/icons';
import { Tooltip, TooltipContent, TooltipTrigger } from '@tegonhq/ui/components/tooltip';
import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { NewIssue } from 'modules/issues/new-issue';
import { SearchDialog } from 'modules/search';

import { SCOPES } from 'common/scopes';

interface BottomBarButtonProps {
  icon: React.ReactElement;
  tooltip: string;
  onClick: () => void;
  isActive?: boolean;
}

const BottomBarButton: React.FC<BottomBarButtonProps> = ({ icon, tooltip, onClick, isActive }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        variant="link"
        onClick={onClick}
        isActive={isActive}
        className="px-3"
      >
        {icon}
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>{tooltip}</p>
    </TooltipContent>
  </Tooltip>
);

export function BottomBar() {
  const [newIssue, setNewIssue] = React.useState(false);
  const [search, setSearch] = React.useState(false);

  useHotkeys(
    'c',
    (e: any) => {
      setNewIssue(true);
      e.preventDefault();
    },
    { scopes: [SCOPES.Global] },
  );

  return (
    <div className="w-full flex justify-between px-6 py-4">
      <BottomBarButton
        icon={<HelpLine size={20} />}
        tooltip="Help from docs"
        onClick={() => {
          window.open('https://docs.tegon.ai', '_blank');
        }}
      />

      <BottomBarButton
        icon={<CreateIssueLine size={20} />}
        tooltip="Create New Issue (C)"
        onClick={() => {
          setNewIssue(true);
        }}
        isActive
      />

      <BottomBarButton
        icon={<SearchLine size={20} />}
        tooltip="Search Workspace (⌘ + /)"
        onClick={() => {
          setSearch(true);
        }}
      />

      <NewIssue open={newIssue} setOpen={setNewIssue} />
      <SearchDialog open={search} setOpen={setSearch} />
    </div>
  );
}