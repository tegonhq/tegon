/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiCheckLine, RiCloseLine } from '@remixicon/react';
import * as React from 'react';

import { TriageIssues } from 'modules/issues/triage/left-side/triage-issues';

import { Button } from 'components/ui/button';

import { TriageAcceptModal } from './triage-accept-modal';
import { TriageDeclineModal } from './triage-decline-modal';
import { Header } from '../../triage/left-side/header';
import { LeftSide } from '../left-side/left-side';
import { RightSide } from '../right-side/right-side';

export function TriageView() {
  const [triageAction, setTriageAction] = React.useState<
    'Accept' | 'Decline' | 'Duplicate'
  >(undefined);

  const onClose = (value: boolean) => {
    if (!value) {
      setTriageAction(undefined);
    }
  };

  const chooseTriageAction = (action: 'Accept' | 'Decline' | 'Duplicate') => {
    setTriageAction(action);
  };

  return (
    <main className="grid grid-cols-4 h-full">
      <div className="border-l flex flex-col col-span-1">
        <Header title="Triage" />
        <TriageIssues />
      </div>
      <div className="border-l flex col-span-3">
        <div className="flex flex-col h-full w-full">
          <div className="p-3.5 px-4 border-b flex justify-end gap-3">
            <Button
              variant="outline"
              size="xs"
              onClick={() => chooseTriageAction('Accept')}
            >
              <RiCheckLine size={14} className="mr-2" />
              Accept
            </Button>

            <Button
              variant="outline"
              size="xs"
              onClick={() => chooseTriageAction('Decline')}
            >
              <RiCloseLine size={14} className="mr-2" />
              Decline
            </Button>
          </div>
          <main className="grid grid-cols-4 h-full">
            <div className="col-span-4 xl:col-span-3 flex flex-col h-[calc(100vh_-_52px)]">
              <LeftSide />
            </div>
            <div className="bg-background border-l dark:bg-slate-800/50 hidden flex-col xl:col-span-1 xl:flex">
              <RightSide />
            </div>
          </main>
        </div>
      </div>
      {triageAction === 'Accept' && (
        <TriageAcceptModal setDialogOpen={onClose} />
      )}
      {triageAction === 'Decline' && (
        <TriageDeclineModal setDialogOpen={onClose} />
      )}
    </main>
  );
}
