/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import React from 'react';

import { IssueRelationType } from 'common/types/issue';

import { Dialog, DialogContent } from 'components/ui/dialog';
import { Input } from 'components/ui/input';

import { ModalIssues } from './modal-issues';

interface ParentOfModalProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  type: IssueRelationType;
}

export const UpdateIssueModal = observer(
  ({ isOpen, setOpen, type }: ParentOfModalProps) => {
    const [value, setValue] = React.useState('');

    const onClose = () => {
      setOpen(false);
    };

    return (
      <Dialog open={isOpen} onOpenChange={setOpen}>
        <DialogContent closeIcon={false}>
          <div>
            <div className="p-3 border-b">
              <Input
                value={value}
                onChange={(e) => setValue(e.currentTarget.value)}
                className="text-md outline-none ring-none focus-visible:ring-0 border-0 shadow-none placeholder:text-gray-400 dark:placeholder:text-gray-600"
                placeholder="Search for issue to add as a sub-issue"
              />
            </div>
            <ModalIssues value={value} onClose={onClose} type={type} />
          </div>
        </DialogContent>
      </Dialog>
    );
  },
);
