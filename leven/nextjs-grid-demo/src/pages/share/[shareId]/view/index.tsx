import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import { getMockShareViewData, type ShareViewData } from '@/lib/mockData';
import { ShareViewPage } from '@/components/GridView/ShareViewPage';

export interface ShareViewPageProps {
  shareViewData: ShareViewData;
}

export const getServerSideProps: GetServerSideProps<ShareViewPageProps> = async (context) => {
  const { shareId } = context.query;
  
  // In a real app, this would fetch data from an API
  // Here we simulate the server-side data fetch
  const shareViewData = getMockShareViewData(shareId as string);

  return {
    props: {
      shareViewData,
    },
  };
};

export default function ShareView({ shareViewData }: ShareViewPageProps) {
  return (
    <>
      <Head>
        <title>{shareViewData.view?.name || 'Share View'} - Grid Demo</title>
      </Head>
      <ShareViewPage shareViewData={shareViewData} />
    </>
  );
}