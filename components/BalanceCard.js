import React, { use } from 'react';
import { Card, CardContent, Typography, Button, Grid } from '@mui/material';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function BalanceCard({ balance, status }) {
  const router = useRouter();
  const { data: session } = useSession();
  const handleCashOut = () => {
    // Here you can add functionality to handle the cash out process
    console.log('Cash Out button clicked');
  };
  const handleInviteFriend = () => {
    const inviteLink = `http://localhost:3000/register?inviteCode=${session.user.inviteCode}&redirect=/`;
    let whatsappMessage = `Hey, I would like to invite you to join this cool platform. Please use the following link to register:${inviteLink}`;
    let whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      whatsappMessage
    )}`;
    window.open(whatsappUrl);
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
  const handleClick = () => {
    // Redirect the user to the ads page
    router.push('/ads');
  };

  return (
    <Card
      style={{ marginTop: '20px', marginBottom: '20px', textAlign: 'center' }}
    >
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          Unredeemed Points: {Math.floor(balance)}
        </Typography>
        <Typography variant="h7" component="div">
          Cash Equivalent KES: {Math.floor(balance * 0.9)}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCashOut}
          style={{ marginTop: 15 }}
          disabled={balance <= 0} // The button will be disabled if the balance is zero or less
        >
          Cash Out
        </Button>
        <Grid
          container
          spacing={2}
          justifyContent="center"
          style={{ marginTop: '20px' }}
        >
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleInviteFriend}
            >
              Invite a Friend
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="success"
              onClick={handleBuyAirtime}
            >
              Buy Airtime
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="info" onClick={handleClick}>
              {session.user.status === 'pending'
                ? 'Watch Ad to Complete Registration'
                : 'Watch Ads'}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
