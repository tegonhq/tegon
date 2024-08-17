import {
  CommandDialog,
  CommandInput,
  CommandList,
} from '@tegonhq/ui/components/command';
import { observer } from 'mobx-react-lite';
import React from 'react';

import type { IssueRelationEnum } from 'common/types';

import { ModalIssues } from './modal-issues';

interface ParentOfModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: IssueRelationEnum;
}

export const AddIssueRelationModal = observer(
  ({ isOpen, onClose, type }: ParentOfModalProps) => {
    const [value, setValue] = React.useState('');

    return (
      <CommandDialog
        open={isOpen}
        onOpenChange={(value: boolean) => {
          if (!value) {
            onClose();
          }
        }}
        commandProps={{
          shouldFilter: false,
        }}
      >
        <CommandInput
          placeholder="Search for issue..."
          onValueChange={(value: string) => setValue(value)}
        />
        <CommandList>
          <ModalIssues value={value} onClose={onClose} type={type} />
        </CommandList>
      </CommandDialog>
    );
  },
);
