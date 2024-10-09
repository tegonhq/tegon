import { SaveViewActions } from './save-view-actions';
import { ViewOptions } from '../components';

export function IssuesViewOptions() {
  return (
    <div className="flex gap-2 h-full">
      <ViewOptions />
      <SaveViewActions />
    </div>
  );
}
