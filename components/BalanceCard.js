import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import { useSession } from 'next-auth/react';

import axios from 'axios';

export default function BalanceCard({ balance }) {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const displayBalance = Number(balance) || 0; // Defaults to 0 if balance is falsy

  const handleCashOut = () => {
    console.log('Cash Out button clicked');
  };

  const handleBuyAirtime = () => {
    // Implement buy airtime functionality here
  };
  const handleLipa = async () => {
    // Implement Lipa functionality here
    const userId = session.user._id;
    const phoneNumber = session.user.phoneNumber;
    const transType = 'lipa';
    try {
      const { data } = await axios.post(
        '/api/transactions/initiateTransaction',
        {
          amount: 1,
          userId,
          phoneNumber,
          transType,
        }
      );

      if (data.ResponseCode == '0') {
        // toast.success('transaction initiated successfully');
        alert('confirm transaction on your phone: ' + phoneNumber);
      } else {
        alert('unable to push authorization request to your phone');
      }
    } catch (error) {
      console.error('unable to handle your request: ', error.message);
      alert('unable to handle your request: ');
      // toast.error('unable to handle your request: ');
      // Handle error here. For instance, you can show an error message to the user
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!session) {
    return <Typography>Please log in</Typography>;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Typography variant="h5">Hey, {session.user.name}!</Typography>
      <Typography variant="h8" component="div" gutterBottom>
        Balance: <span className="text-xs">KES.</span>
        <span id="total-winnings">{Math.floor(displayBalance)} </span>
        <button
          className="bg-customGreen hover:bg-customGreen-dark text-white py-0.5 px-1 text-xs rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={displayBalance === 0}
        >
          Cash Out
        </button>
      </Typography>
    </Box>
  );
}
