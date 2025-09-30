import { useMemo } from 'react';
import type { ShareViewData } from '@/lib/mockData';
import { AppLayout } from './AppLayout';
import { ShareView } from './ShareView';

export interface ShareViewPageProps {
  shareViewData: ShareViewData;
}

export const ShareViewPage = (props: ShareViewPageProps) => {
  const { view } = props.shareViewData;

  return (
    <AppLayout>
      <div className="flex size-full flex-col md:px-3 md:pb-3">
        <div className="flex w-full justify-between px-1 py-2 md:px-0 md:py-3">
          <h1 className="font-semibold md:text-lg">{view?.name}</h1>
          <div className="flex items-center">
            <p className="ml-1 font-semibold text-blue-600">Grid Demo</p>
          </div>
        </div>
        <div className="flex w-full grow flex-col overflow-hidden border md:rounded md:shadow-md bg-white">
          <ShareView shareViewData={props.shareViewData} />
        </div>
      </div>
    </AppLayout>
  );
};