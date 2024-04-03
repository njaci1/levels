import React, { useState, useEffect } from 'react';
import { useSession, getSession } from 'next-auth/react';
import NetworkTable from './NetworkTable';
import BalanceCard from './BalanceCard';
import Layout from './Layout';
import JackpotCard from './JackpotCard';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  styled,
  Box,
} from '@mui/material';
import { join } from 'path';

export default function Mainpage() {
  // State for storing network data
  const [networkData, setNetworkData] = useState({
    inviteesLevel1Count: 0,
    inviteesLevel2Count: 0,
    inviteesLevel3Count: 0,
    earningsLevel0: 0,
    earningsLevel1: 0,
    earningsLevel2: 0,
    earningsLevel3: 0,
    totalEarnings: 0,
    balance: 0,
    withdrawals: 0,
    status: 'pending',
  });
  const { data: session, update } = useSession();

  // Fetch user network on component mount
  useEffect(() => {
    const fetchUserNetwork = async () => {
      const res = await fetch('/api/user/inviteeLevels');
      const data = await res.json();
      setNetworkData(data); // Save the network data in state
      // console.log(data);
    };

    fetchUserNetwork();
  }, []); // Empty array means this effect runs once on component mount

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
      }); // Fetch jackpot totals from the API
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
      }); // Fetch jackpot entries from the API
  }, []);

  return (
    <div>
      <Layout>
        <BalanceCard
          balance={networkData.balance}
          status={networkData.status}
          networkSize={[
            networkData.inviteesLevel1Count,
            networkData.inviteesLevel2Count,
            networkData.inviteesLevel3Count,
          ]}
        />
        {/* <NetworkTable networkData={networkData} /> */}
        <Box sx={{ flexGrow: 1, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
            <JackpotCard
              name="weekly"
              amount={jackpots.weekly}
              entries={jackpotEntries.weekly}
              drawDate={'Fri 8 PM'}
            />

            <JackpotCard
              name="monthly"
              amount={jackpots.monthly}
              entries={jackpotEntries.monthly}
              drawDate={'1st Sat'}
            />
            <JackpotCard
              name="annual"
              amount={jackpots.annual}
              entries={jackpotEntries.annual}
              drawDate={'1st Jan'}
            />
          </Box>
        </Box>
      </Layout>
    </div>
  );
}
