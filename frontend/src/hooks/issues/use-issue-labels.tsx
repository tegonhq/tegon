/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { computed } from 'mobx';
import * as React from 'react';

import type { LabelType } from 'common/types/label';

import { useLabelsStore } from 'hooks/labels';

import { useIssueData } from './use-issue-data';

export function useIssueLabels() {
  const labelsStore = useLabelsStore();
  const issue = useIssueData();

  const getLabels = () => {
    const labels = labelsStore.labels.filter((label: LabelType) =>
      issue.labelIds.includes(label.id),
    );

    return labels;
  };

  const labels = React.useMemo(
    () => computed(() => getLabels()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [labelsStore],
  ).get();

  return labels;
}
