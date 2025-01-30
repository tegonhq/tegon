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
import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { IssueRelationEnum, TeamTypeEnum } from 'common/types';

import { DropdownItem } from './dropdown-item';

interface RelatedDropdownItemsProps {
  setRelatedModal: (type: IssueRelationEnum) => void;
  teamType: TeamTypeEnum;
}

const relationshipItems = {
  [TeamTypeEnum.ENGINEERING]: [
    {
      type: IssueRelationEnum.PARENT,
      Icon: ParentIssueLine,
      title: 'Parent of...',
    },
    {
      type: IssueRelationEnum.SUB_ISSUE,
      Icon: SubIssue,
      title: 'Sub-issue of...',
    },
    {
      type: IssueRelationEnum.RELATED,
      Icon: RelatedIssueLine,
      title: 'Related to...',
    },
    {
      type: IssueRelationEnum.BLOCKED,
      Icon: BlockedFill,
      title: 'Blocked by...',
    },
    {
      type: IssueRelationEnum.BLOCKS,
      Icon: BlocksFill,
      title: 'Blocks...',
    },
    {
      type: IssueRelationEnum.DUPLICATE_OF,
      Icon: DuplicateLine,
      title: 'Duplicate of...',
    },
  ],
  [TeamTypeEnum.SUPPORT]: [
    {
      type: IssueRelationEnum.RELATED,
      Icon: RelatedIssueLine,
      title: 'Related to...',
    },
    {
      type: IssueRelationEnum.BLOCKED,
      Icon: BlockedFill,
      title: 'Blocked by...',
    },

    {
      type: IssueRelationEnum.DUPLICATE_OF,
      Icon: DuplicateLine,
      title: 'Duplicate of...',
    },
  ],
};

export const RelatedDropdownItems = observer(
  ({ setRelatedModal, teamType }: RelatedDropdownItemsProps) => {
    const items =
      relationshipItems[teamType] ||
      relationshipItems[TeamTypeEnum.ENGINEERING];

    return (
      <>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <DropdownItem Icon={RelatedIssueLine} title="Add related" />
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              {items.map((item) => (
                <DropdownMenuItem
                  key={item.type}
                  onClick={() => {
                    setRelatedModal(item.type);
                  }}
                >
                  <DropdownItem Icon={item.Icon} title={item.title} />
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </>
    );
  },
);
