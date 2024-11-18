import { NodeViewWrapper } from '@tiptap/react';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';

import { getWorkflowColor } from 'common/status-color';
import { getWorkflowIcon } from 'common/workflow-icons';

import { useTeamWorkflows } from 'hooks/workflows';

import { useContextStore } from 'store/global-context-provider';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TegonIssueComponent = observer((props: any) => {
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const { issuesStore, teamsStore } = useContextStore();

  const url = props.node.attrs.url;
  const identifier = url.split('/')[url.split('/').length - 1];
  const teamIdentifier = identifier.split('-')[0];

  const team = teamsStore.getTeamWithIdentifier(identifier.split('-')[0]);
  const workflows = useTeamWorkflows(teamIdentifier);

  const issue = team
    ? issuesStore.getIssueByNumber(identifier, team.id)
    : undefined;

  if (!issue) {
    return (
      <NodeViewWrapper className="react-component-with-content">
        <span className="content">{url}</span>
      </NodeViewWrapper>
    );
  }

  const workflow = workflows.find((workflow) => workflow.id === issue.stateId);

  const CategoryIcon = getWorkflowIcon(workflow);
  return (
    <NodeViewWrapper className="react-component-with-content" as="span">
      <Link
        className="gap-1 bg-grayAlpha-100 p-0.5 px-1 rounded box-decoration-clone"
        contentEditable={false}
        href={`/${workspaceSlug}/issue/${team.identifier}-${issue.number}`}
      >
        <span>
          <span className="inline-flex items-bottom justify-bottom top-1 relative">
            <CategoryIcon
              color={getWorkflowColor(workflow).color}
              className="mr-1"
            />
          </span>
          <span className="font-mono text-muted-foreground">
            {`${team.identifier}-${issue.number}`}
          </span>
        </span>
        <span> {issue.title}</span>
      </Link>
    </NodeViewWrapper>
  );
});
