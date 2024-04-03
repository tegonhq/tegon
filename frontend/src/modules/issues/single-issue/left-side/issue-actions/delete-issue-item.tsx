/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiDeleteBin7Line } from '@remixicon/react';
import React from 'react';

import { DropdownMenuItem } from 'components/ui/dropdown-menu';

import { DropdownItem } from './dropdown-item';

interface DeleteIssueItemProps {
  setDeleteIssueDialog: (value: boolean) => void;
}

export function DeleteIssueItem({
  setDeleteIssueDialog,
}: DeleteIssueItemProps) {
  return (
    <>
      <DropdownMenuItem onClick={() => setDeleteIssueDialog(true)}>
        <DropdownItem Icon={RiDeleteBin7Line} title="Delete" />
      </DropdownMenuItem>
    </>
  );
}
