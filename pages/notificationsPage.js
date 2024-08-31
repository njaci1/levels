import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Layout from '../components/Layout';
import Notifications from '../components/Notifications';

function NotificationPage() {
  const { data: session } = useSession();
  const userId = session.user._id;

  return (
    <Layout title="Notifications">
      <Notifications userId={userId} />
    </Layout>
  );
}

export default NotificationPage;
