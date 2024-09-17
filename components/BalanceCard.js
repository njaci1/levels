import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  styled,
  Box,
} from '@mui/material';
import { useSession } from 'next-auth/react';

import axios from 'axios';

const Item = styled(Card)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const StyledCard = styled(Card)({
  margin: '1em',
  padding: '1em',
  backgroundColor: '#f5f5f5',
  borderRadius: '15px',
  boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
});

export default function BalanceCard({ balance }) {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

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
        Balance: KES <span id="total-winnings">{Math.floor(balance)} </span>
        <Button
          variant="contained"
          sx={{
            padding: '2px 4px',
            fontSize: '0.525rem',
            backgroundColor: '#56BD00 ',
          }}
          disabled={balance === 0}
        >
          Cash Out
        </Button>
      </Typography>
    </Box>
  );
}
