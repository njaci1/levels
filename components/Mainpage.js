import React, { useState, useEffect } from 'react';

import BalanceCard from './BalanceCard';
import NetworkCard from './Network';
import Layout from './Layout';
import JackpotCard from './JackpotCard';
import { Grid, Box, Typography } from '@mui/material';

export default function Mainpage() {
  // State for storing network data
  const [networkData, setNetworkData] = useState({
    inviteesLevel1Count: 'loading...',
    inviteesLevel2Count: 'loading...',
    inviteesLevel3Count: 'loading...',
    balance: 'loading...',
    status: 'pending',
  });

  // Fetch user network on component mount
  useEffect(() => {
    const fetchUserNetwork = async () => {
      const res = await fetch('/api/user/inviteeLevels');
      const data = await res.json();
      setNetworkData(data);
    };

    fetchUserNetwork();
  }, []);

  return (
    <Layout>
      {/* Fixed Header with Balance and Network */}
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Box
          sx={{
            position: 'fixed',
            top: 45, // Stick to the top
            left: 0, // Align to the left
            right: 0, // Align to the right (full width)
            zIndex: 990,
            backgroundColor: 'white',
            paddingBottom: '10px',
            paddingTop: '10px',
          }}
        >
          <BalanceCard
            balance={networkData.balance}
            status={networkData.status}
          />
          <NetworkCard
            networkSize={[
              networkData.inviteesLevel1Count,
              networkData.inviteesLevel2Count,
              networkData.inviteesLevel3Count,
            ]}
          />
          <Typography
            variant="h4"
            align="center"
            sx={{ mb: 0, marginTop: '35px' }}
          >
            Prize Pool
          </Typography>
        </Box>

        {/* Jackpot Cards with scrollable area */}
        <Box sx={{ flex: 1, overflowY: 'auto', marginTop: '325px' }}>
          {' '}
          {/* Adjust this value to create space below the fixed section */}
          <Grid item xs={12} sm={6} md={4}>
            <JackpotCard name="Today!" />
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <JackpotCard name="This Week" />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <JackpotCard name="End Month" />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <JackpotCard name="End of Year" />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Layout>
  );
}
