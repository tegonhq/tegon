import { observer } from 'mobx-react-lite';

import { LeftSide } from './left-side';
import { RightSide } from './right-side';

export const Overview = observer(() => {
  return (
    <main className="grid grid-cols-5 h-[calc(100vh_-_53px)]">
      <div className="col-span-4 flex flex-col h-[calc(100vh_-_55px)]">
        <LeftSide />
      </div>
      <div className="border-l border-border flex-col flex">
        <RightSide />
      </div>
    </main>
  );
});
