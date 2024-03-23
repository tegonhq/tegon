/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
  RiAddLine,
  RiFileAddLine,
  RiFileCopyLine,
  RiFileDownloadLine,
  RiFileForbidLine,
  RiFileTransferLine,
  RiFileWarningLine,
} from '@remixicon/react';
import React from 'react';

import { cn } from 'common/lib/utils';
import { IssueRelationEnum } from 'common/types/issue-relation';

import { Button } from 'components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from 'components/ui/dropdown-menu';

import { AddIssueRelationModal } from './modals';

export function IssueRelatedDropdown() {
  const [modal, setModal] = React.useState<IssueRelationEnum>(undefined);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              role="combobox"
              size="lg"
              className={cn(
                'flex items-center border text-foreground dark:bg-transparent border-transparent hover:border-slate-200 dark:border-transparent dark:hover:border-slate-700 px-3 shadow-none justify-between text-sm font-normal focus-visible:ring-1 focus-visible:border-primary',
              )}
            >
              <div className="flex items-center gap-2">
                <div className="flex text-muted-foreground items-center">
                  <RiAddLine size={18} className="mr-3" /> Add Relation
                </div>
              </div>
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="text-muted-foreground">
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                setModal(IssueRelationEnum.PARENT);
              }}
            >
              <div className="flex items-center gap-2">
                <RiFileAddLine size={16} />
                Parent of...
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                setModal(IssueRelationEnum.SUB_ISSUE);
              }}
            >
              <div className="flex items-center gap-2">
                <RiFileDownloadLine size={16} />
                Sub-issue of...
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                setModal(IssueRelationEnum.RELATED);
              }}
            >
              <div className="flex items-center gap-2">
                <RiFileTransferLine size={16} />
                Related to...
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                setModal(IssueRelationEnum.BLOCKED);
              }}
            >
              <div className="flex items-center gap-2">
                <RiFileWarningLine size={16} />
                Blocked by...
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                setModal(IssueRelationEnum.BLOCKS);
              }}
            >
              <div className="flex items-center gap-2">
                <RiFileForbidLine size={16} />
                Blocked to...
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                setModal(IssueRelationEnum.DUPLICATE_OF);
              }}
            >
              <div className="flex items-center gap-2">
                <RiFileCopyLine size={16} />
                Duplicate of...
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {modal && (
        <AddIssueRelationModal
          isOpen
          type={modal}
          setOpen={(open: boolean) => {
            if (!open) {
              setModal(undefined);
            }
          }}
        />
      )}
    </>
  );
}
