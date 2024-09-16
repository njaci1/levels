import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import BalanceCard from './BalanceCard';
import NetworkCard from './Network';
import Layout from './Layout';
import JackpotCard from './JackpotCard';
import { Grid, Box, Typography } from '@mui/material';

export default function Mainpage() {
  // State for storing network data
  const [networkData, setNetworkData] = useState({
    inviteesLevel1Count: 0,
    inviteesLevel2Count: 0,
    inviteesLevel3Count: 0,
    balance: 0,
    status: 'pending',
  });

  const { data: session } = useSession();

  // Fetch user network on component mount
  useEffect(() => {
    const fetchUserNetwork = async () => {
      const res = await fetch('/api/user/inviteeLevels');
      const data = await res.json();
      setNetworkData(data);
    };

    fetchUserNetwork();
  }, []);

  const [jackpots, setJackpots] = useState({
    weekly: 1000,
    monthly: 5000,
    annual: 9000,
    joiners: 10000,
  });

  const [jackpotEntries, setJackpotEntries] = useState({
    weekly: 1,
    monthly: 3,
    annual: 10,
  });

  useEffect(() => {
    fetch('/api/jackpotTotals')
      .then((response) => response.json())
      .then((data) => {
        setJackpots({
          weekly: data.weeklyTotal,
          monthly: data.monthlyTotal,
          annual: data.annualTotal,
          joiners: data.joinersTotal,
        });
      });
  }, []);

  useEffect(() => {
    fetch('/api/getJackpotEntries')
      .then((response) => response.json())
      .then((data) => {
        setJackpotEntries({
          weekly: data.weeklyEntries,
          monthly: data.monthlyEntries,
          annual: data.annualEntries,
        });
      });
  }, []);

  return (
    <Layout>
      {/* Fixed Header with Balance and Network */}
      <Box
        sx={{
          position: 'fixed',
          top: 40, // Stick to the top
          left: 0, // Align to the left
          right: 0, // Align to the right (full width)
          zIndex: 1000,
          backgroundColor: 'white',
          paddingBottom: '10px',
          paddingTop: '10px',
        }}
      >
        <BalanceCard
          balance={networkData.balance}
          status={networkData.status}
          networkSize={[
            networkData.inviteesLevel1Count,
            networkData.inviteesLevel2Count,
            networkData.inviteesLevel3Count,
          ]}
        />
        <NetworkCard
          networkSize={[
            networkData.inviteesLevel1Count,
            networkData.inviteesLevel2Count,
            networkData.inviteesLevel3Count,
          ]}
        />
        <Typography
          variant="h3"
          align="center"
          sx={{ mb: 0, marginTop: '30px' }}
        >
          Active Jackpots
        </Typography>
      </Box>

      {/* Jackpot Cards with scrollable area */}
      <Box sx={{ marginTop: '290px' }}>
        {' '}
        {/* Adjust this value to create space below the fixed section */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <JackpotCard
              name="Weekly"
              amount={jackpots.weekly}
              entries={jackpotEntries.weekly}
              drawDate={'Fri 8 PM'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <JackpotCard
              name="Monthly"
              amount={jackpots.monthly}
              entries={jackpotEntries.monthly}
              drawDate={'1st Sat'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <JackpotCard
              name="Annual"
              amount={jackpots.annual}
              entries={jackpotEntries.annual}
              drawDate={'1st Jan'}
            />
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}
