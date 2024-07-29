import { Button } from '@tegonhq/ui/components/button';
import { CreateIssueLine, HelpLine, SearchLine } from '@tegonhq/ui/icons';
import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { NewIssue } from 'modules/issues/new-issue';
import { SearchDialog } from 'modules/search';

import { SCOPES } from 'common/scopes';

export function BottomBar() {
  const [newIssue, setNewIssue] = React.useState(false);
  const [search, setSearch] = React.useState(false);

  useHotkeys(
    'c',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e: any) => {
      setNewIssue(true);

      e.preventDefault();
    },
    { scopes: [SCOPES.Global] },
  );

  return (
    <div className="w-full flex justify-between px-6 py-4">
      <Button
        variant="ghost"
        onClick={() => {
          window.open('https://docs.tegon.ai', '_blank');
        }}
      >
        <HelpLine size={20} />
      </Button>

      <Button
        variant="ghost"
        isActive
        className="px-3"
        onClick={() => {
          setNewIssue(true);
        }}
      >
        <CreateIssueLine size={20} />
      </Button>

      <Button
        variant="ghost"
        onClick={() => {
          setSearch(true);
        }}
      >
        <SearchLine size={20} />
      </Button>

      <NewIssue open={newIssue} setOpen={setNewIssue} />
      <SearchDialog open={search} setOpen={setSearch} />
    </div>
  );
}
