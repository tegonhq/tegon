/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { useIssueHistoryStore } from 'hooks/issues';

export function IssueActivity() {
  const history = useIssueHistoryStore();
  console.log(history);

  return (
    <div>
      <div>
        <div className=""> Activity</div>
      </div>
    </div>
  );
}
