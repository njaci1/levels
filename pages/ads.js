import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import { useSession } from 'next-auth/react';
import Hello from '../components/Hello';

import AdPlayer from '../components/AdsPlayer'; // Import the AdPlayer component

export default function Ads() {
  const { data: session } = useSession();

  return (
    <Layout title="Ads">
      {session ? (
        <div className="overflow-hidden flex flex-col">
          <AdPlayer />
        </div>
      ) : (
        <Hello />
      )}
    </Layout>
  );
}
