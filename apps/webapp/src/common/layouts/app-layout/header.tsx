import { Button } from '@tegonhq/ui/components/button';
import { CreateIssueLine, SearchLine } from '@tegonhq/ui/icons';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { useNewIssue } from 'modules/issues/new-issue';
import { SearchDialog } from 'modules/search';
import { TooltipWrapper } from 'common/wrappers/tooltip-wrapper';

export const Header = observer(() => {
  const [search, setSearch] = React.useState(false);
  const { openNewIssue } = useNewIssue();

  return (
    <>
      <div className="flex">
        <TooltipWrapper tooltip="Create new issue (C)">
          <Button
            variant="ghost"
            className="justify-start w-fit"
            size="sm"
            onClick={() => {
              openNewIssue({});
            }}
          >
            <CreateIssueLine size={18} />
          </Button>
        </TooltipWrapper>

        <TooltipWrapper tooltip="Search issues (CMD + /)">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 justify-start w-fit"
            onClick={() => {
              setSearch(true);
            }}
          >
            <SearchLine size={18} />
          </Button>
        </TooltipWrapper>
      </div>

      <SearchDialog open={search} setOpen={setSearch} />
    </>
  );
});