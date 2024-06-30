/** Copyright (c) 2024, Tegon, all rights reserved. **/

import React from 'react';

import { Button } from 'components/ui/button';
import { useIssueData } from 'hooks/issues';
import { CrossLine } from 'icons';

import { useSummarizeIssue } from 'services/issues';

interface IssueSummaryProps {
  onClose: () => void;
}

export function IssueSummary({ onClose }: IssueSummaryProps) {
  const issueData = useIssueData();
  const { data, isLoading } = useSummarizeIssue(issueData.id);

  const summary = React.useMemo(() => {
    if (isLoading) {
      return ['Loading...'];
    }

    if (!data) {
      return ['More activity is needed to summarize'];
    }

    if (data.length === 0) {
      return ['More activity is needed to summarize'];
    }

    return data;
  }, [data, isLoading]);

  return (
    <div className="bg-grayAlpha-100 p-3 pt-1 mt-2 rounded relative">
      <ul className="ml-6 list-disc [&>li]:mt-2">
        {summary.map((text: string, index: number) => (
          <li key={index}>{text}</li>
        ))}
      </ul>

      <Button
        variant="ghost"
        className="absolute right-1 top-1"
        onClick={onClose}
      >
        <CrossLine size={16} />
      </Button>
    </div>
  );
}
