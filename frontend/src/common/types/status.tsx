/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
  CanceledLine,
  DoneFill,
  InProgressLine,
  InReviewLine,
  TodoLine,
  TriageFill,
  UnscopedLine,
} from 'icons';

export const WORKFLOW_CATEGORY_ICONS = {
  Backlog: UnscopedLine,
  Todo: TodoLine,
  'In Progress': InProgressLine,
  'In Review': InReviewLine,
  Unscoped: UnscopedLine,
  Done: DoneFill,
  Duplicate: CanceledLine,
  Canceled: CanceledLine,
  Triage: TriageFill,
};
