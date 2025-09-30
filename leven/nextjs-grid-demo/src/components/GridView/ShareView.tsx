import type { ShareViewData } from '@/lib/mockData';
import { GridView } from './GridView';

export interface ShareViewProps {
  shareViewData: ShareViewData;
}

export const ShareView = ({ shareViewData }: ShareViewProps) => {
  return (
    <div className="h-full w-full">
      <GridView shareViewData={shareViewData} />
    </div>
  );
};