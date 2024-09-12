import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Layout from '../components/Layout';
import Notifications from '../components/Notifications';

function NotificationPage() {
  const { data: session, status } = useSession();

  // Handle loading state
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  // If not authenticated, handle it (e.g., redirect or show message)
  if (!session) {
    return <div>You are not logged in</div>;
  }

  const userId = session.user._id;

  return (
    <Layout title="Notifications">
      <Notifications userId={userId} />
    </Layout>
  );
}

export default NotificationPage;
