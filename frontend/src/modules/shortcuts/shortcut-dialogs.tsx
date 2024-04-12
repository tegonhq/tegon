/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { AssigneeDialog, LabelDialog, StatusDialog } from './dialogs';
import { PriorityDialog } from './dialogs/priority-dialog';

export function ShortcutDialogs() {
  return (
    <>
      <StatusDialog />
      <AssigneeDialog />
      <LabelDialog />
      <PriorityDialog />
    </>
  );
}
