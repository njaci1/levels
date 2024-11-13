import React, { useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import { useSession } from 'next-auth/react';
import Hello from '../components/Hello';
import { Container, Typography, Box, Paper } from '@mui/material';
import AdPlayer from '../components/AdsPlayer'; // Import the AdPlayer component
import { ThumbsDown, ThumbsUp } from 'react-feather';

function Ads() {
  const { data: session } = useSession();

  useEffect(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);

  return (
    <Layout title="Ads">
      {session ? (
        <div className="w-full h-full mt-0">
          <AdPlayer type="video" className="w-full h-full object-cover" />
        </div>
      ) : (
        <Hello />
      )}
    </Layout>
  );
}

export default Ads;
