import React, { use } from 'react';
import { Card, CardContent, Typography, Button, Grid } from '@mui/material';
import { useSession } from 'next-auth/react';

export default function BalanceCard({ balance }) {
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

  const handleLipa = () => {
    // Implement Lipa functionality here
  };

  return (
    <Card
      style={{ marginTop: '20px', marginBottom: '20px', textAlign: 'center' }}
    >
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          Current Balance
        </Typography>
        <Typography variant="h5" component="div">
          ksh.{balance}
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
            <Button variant="contained" color="info" onClick={handleLipa}>
              Lipa
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
