import { observer } from 'mobx-react-lite';

import { IssuesViewOptions } from 'modules/issues/all/issues-view-options';
import { ListView } from 'modules/issues/all/list-view';
import { FiltersView } from 'modules/issues/filters-view/filters-view';

export const ProjectIssues = observer(() => {
  return (
    <>
      <FiltersView Actions={<IssuesViewOptions />} />
      <ListView />
    </>
  );
});
