import { Button } from '@tegonhq/ui/components/button';
import React from 'react';

import type { LabelType } from 'common/types/label';

import { useCurrentWorkspace } from 'hooks/workspace';

import { useSuggestionIssueMutation } from 'services/issues/issue-suggestions';

import { AssigneeSuggestions } from './assignee-suggestions';

interface IssueSuggestionsProps {
  description: string;
  teamId: string;
  labelIds: string[];
  setAssigneeValue: (assigneeId: string) => void;
  setLabelValue: (labelIds: string[]) => void;
  assigneeId: string;
}

export function IssueSuggestions({
  description,
  teamId,
  labelIds,
  setLabelValue,
  setAssigneeValue,
  assigneeId,
}: IssueSuggestionsProps) {
  const workspace = useCurrentWorkspace();
  const [labels, setLabels] = React.useState([]);
  const [assignees, setAssignees] = React.useState([]);

  const { mutate: getSuggestions } = useSuggestionIssueMutation({
    onSuccess: (data) => {
      if (data.labels) {
        setLabels(data.labels);
      }
      if (data.assignees) {
        setAssignees(data.assignees);
      }
    },
  });

  React.useEffect(() => {
    getSuggestions({
      description,
      teamId,
      workspaceId: workspace.id,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [description]);

  const filteredLabels = labels.filter(
    (label: LabelType) => labelIds.indexOf(label.id) === -1,
  );

  const filteredAssignees = assignees
    .filter((assignee) => assignee.id !== assigneeId)
    .map((assignee) => assignee.id);

  if (labels.length === 0 && assignees.length === 0) {
    return null;
  }

  return (
    <div className="flex my-3 items-center gap-2 flex-wrap w-full">
      {(filteredLabels.length > 0 || filteredAssignees.length > 0) && (
        <span className="text-xs text-muted-foreground">Suggestions</span>
      )}
      {filteredLabels.map((label: LabelType) => {
        return (
          <Button
            variant="outline"
            type="button"
            className="border-dashed"
            key={label.id}
            size="sm"
            onClick={() => {
              setLabelValue([...labelIds, label.id]);
            }}
          >
            {label.name}
          </Button>
        );
      })}
      <AssigneeSuggestions
        userIds={filteredAssignees}
        setAssigneeValue={setAssigneeValue}
        assigneeId={assigneeId}
        teamId={teamId}
      />
    </div>
  );
}
