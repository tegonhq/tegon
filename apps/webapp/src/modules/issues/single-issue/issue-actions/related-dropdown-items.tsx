import { IssueRelationEnum } from 'common/types';
import {
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuItem,
} from '@tegonhq/ui/components/dropdown-menu';
import {
  RelatedIssueLine,
  ParentIssueLine,
  SubIssue,
  BlockedFill,
  DuplicateLine,
  BlocksFill,
} from '@tegonhq/ui/icons';
import * as React from 'react';

import { DropdownItem } from './dropdown-item';

interface RelatedDropdownItemsProps {
  setRelatedModal: (type: IssueRelationEnum) => void;
}

export function RelatedDropdownItems({
  setRelatedModal,
}: RelatedDropdownItemsProps) {
  return (
    <>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <DropdownItem Icon={RelatedIssueLine} title="Add related" />
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <DropdownMenuItem
              onClick={() => {
                setRelatedModal(IssueRelationEnum.PARENT);
              }}
            >
              <DropdownItem Icon={ParentIssueLine} title="Parent of..." />
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                setRelatedModal(IssueRelationEnum.SUB_ISSUE);
              }}
            >
              <DropdownItem Icon={SubIssue} title=" Sub-issue of..." />
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                setRelatedModal(IssueRelationEnum.RELATED);
              }}
            >
              <DropdownItem Icon={RelatedIssueLine} title=" Related to..." />
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                setRelatedModal(IssueRelationEnum.BLOCKED);
              }}
            >
              <DropdownItem Icon={BlockedFill} title=" Blocked by..." />
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                setRelatedModal(IssueRelationEnum.BLOCKS);
              }}
            >
              <DropdownItem Icon={BlocksFill} title="Blocks..." />
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                setRelatedModal(IssueRelationEnum.DUPLICATE_OF);
              }}
            >
              <DropdownItem Icon={DuplicateLine} title="Duplicate of..." />
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    </>
  );
}
