import {
  AssigneeLine,
  LabelLine,
  PriorityHigh,
  SubIssue,
} from '@tegonhq/ui/icons';

export const allCommands = [
  {
    name: 'Assignee',
    id: 'assigneeId',
    Icon: AssigneeLine,
  },
  {
    name: 'Label',
    id: 'labelIds',
    Icon: LabelLine,
  },
  {
    name: 'Priority',
    id: 'priority',
    Icon: PriorityHigh,
  },
  {
    name: 'Create sub-issue',
    id: 'create-sub-issue',
    Icon: SubIssue,
  },
];
