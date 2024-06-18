/** Copyright (c) 2024, Tegon, all rights reserved. **/
import { RiCloseCircleFill } from '@remixicon/react';

import {
  BacklogLine,
  DoneFill,
  InProgressLine,
  InReviewLine,
  TodoLine,
  TriageFill,
} from 'icons';

export const WORKFLOW_CATEGORY_ICONS = {
  Backlog: BacklogLine,
  Todo: TodoLine,
  'In Progress': InProgressLine,
  'In Review': InReviewLine,
  Done: DoneFill,
  Duplicate: RiCloseCircleFill,
  Canceled: RiCloseCircleFill,
  Triage: TriageFill,
};
