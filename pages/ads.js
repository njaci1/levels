import React, { useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import { useSession } from 'next-auth/react';
import Hello from '../components/Hello';
import { Container, Typography, Box, Paper } from '@mui/material';
import AdPlayer from '../components/AdsPlayer'; // Import the AdPlayer component

function Ads() {
  const { data: session } = useSession();

  useEffect(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);

  return (
    <Layout title="Ads">
      {session ? (
        <Container maxWidth="md">
          <Box my={4}>
            <Typography variant="h4" component="h1" gutterBottom>
              Watch Ads
            </Typography>
            <Typography variant="body1" gutterBottom>
              Here are some ads for you to watch:
            </Typography>
            <Box my={2}>
              <Paper elevation={3}>
                <Box p={2}>
                  <Typography variant="h6" gutterBottom>
                    Video Ad
                  </Typography>
                  <AdPlayer type="video" />
                </Box>
              </Paper>
            </Box>
          </Box>
        </Container>
      ) : (
        <Hello />
      )}
    </Layout>
  );
}

export default Ads;
