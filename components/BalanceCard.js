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
import { useSession, getSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { set } from 'mongoose';
import JackpotCard from './JackpotCard';

const Item = styled(Card)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function BalanceCard({ balance, networkSize }) {
  const router = useRouter();
  const { data: session, update } = useSession();

  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [adVideos, setAdVideos] = useState([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [registrationComplete, setRegistrationComplete] = useState(
    session.user.registrationStatus
  );
  // console.log(session.user.registrationStatus);

  useEffect(() => {
    axios
      .get('/api/getJoinersAds')
      .then((response) => {
        setAdVideos(response.data);
      })
      .catch((error) => {
        console.error('Failed to fetch videos:', error);
      });
  }, []);

  const handleCashOut = () => {
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

  const handleWatchAd = () => {
    setIsWatchingAd(true);
  };

  const handleAdEnded = async () => {
    if (currentAdIndex + 1 < adVideos.length) {
      setCurrentAdIndex(currentAdIndex + 1);
    } else {
      setIsWatchingAd(false);

      await axios
        .put(`/api/user/${session.user._id}/completeRegistration`)
        .then(() => {
          // Update the local state
          setRegistrationComplete('complete');
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <Box sx={{ flexGrow: 1, mb: 2 }}>
      <Typography variant="h3" sx={{ textAlign: 'center' }}>
        Hey, {session.user.name}!
      </Typography>
      <Item sx={{ mb: 2 }}>
        <Typography variant="h6" component="div" gutterBottom>
          Balance
        </Typography>
        <Typography variant="h5" component="div" gutterBottom>
          $<span id="total-winnings">{Math.floor(balance * 0.9)}</span>
        </Typography>
        <Button variant="contained">Cash Out</Button>
      </Item>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Item>
          <Typography variant="h6" component="div" gutterBottom>
            Network Size
          </Typography>
          <ul sx={{ mb: 2 }}>
            <li>
              Level 1: <span id="level-1-commission">{networkSize[0]}</span>
            </li>
            <li>
              Level 2: <span id="level-2-commission">{networkSize[1]}</span>
            </li>
            <li>
              Level 3: <span id="level-3-commission">{networkSize[2]}</span>
            </li>
          </ul>

          {/* <Button
            variant="contained"
            color="secondary"
            onClick={handleInviteFriend}
          >
            Invite a Friend Now!
          </Button> */}
        </Item>
        <Item>
          <Typography variant="h6" component="div" gutterBottom>
            Potential Commission
          </Typography>
          <ul>
            <li>
              Level 1: $<span id="level-1-commission">0.00</span>
            </li>
            <li>
              Level 2: $<span id="level-2-commission">0.00</span>
            </li>
            <li>
              Level 3: $<span id="level-3-commission">0.00</span>
            </li>
            <li>
              Referral: $<span id="level-3-commission">0.00</span>
            </li>
          </ul>
          {/* <Button
            variant="contained"
            color="secondary"
            onClick={handleInviteFriend}
          >
            Invite a Friend Now!
          </Button> */}
        </Item>
      </Box>
      {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Item>
          <JackpotCard
            name={'Weekly'}
            amount={100}
            entries={2}
            drawDate={'10-03-23'}
          />
        </Item>
        <Item>
          <JackpotCard
            name={'Monthly'}
            amount={500}
            entries={7}
            drawDate={'10-03-23'}
          />
        </Item>
        <Item>
          <JackpotCard
            name={'Annual'}
            amount={3000}
            entries={52}
            drawDate={'10-03-23'}
          />
        </Item>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Item>
          <Typography variant="h6" component="div" gutterBottom>
            Featured Ad
          </Typography>
        </Item>
      </Box> */}
    </Box>

    // <Card
    //   style={{ marginTop: '20px', marginBottom: '20px', textAlign: 'center' }}
    // >
    //   <h1>Hey, {session.user.name}</h1>
    //   <CardContent>
    //     <Typography variant="h7" component="div">
    //       <h3>Balance</h3>
    //       <p>
    //         $<span id="total-winnings">0.00</span>
    //       </p>
    //       {/* Cash Equivalent KES: {Math.floor(balance * 0.9)} */}
    //     </Typography>
    //     <Button
    //       variant="contained"
    //       color="primary"
    //       onClick={handleCashOut}
    //       style={{ marginTop: 15 }}
    //       disabled={balance <= 0} // The button will be disabled if the balance is zero or less
    //     >
    //       Cash Out
    //     </Button>
    //     </CardContent>
    //   <CardContent>
    //     <Grid
    //       container
    //       spacing={2}
    //       justifyContent="center"
    //       style={{ marginTop: '20px' }}
    //     >
    //       <Grid item>
    //         <Button
    //           variant="contained"
    //           color="secondary"
    //           onClick={handleInviteFriend}
    //         >
    //           Invite a Friend
    //         </Button>
    //       </Grid>
    //       <Grid item>
    //         <Button
    //           variant="contained"
    //           color="success"
    //           onClick={handleBuyAirtime}
    //         >
    //           Buy Airtime
    //         </Button>
    //       </Grid>
    //       <Grid item>
    //         <Button
    //           variant="contained"
    //           color="info"
    //           onClick={
    //             registrationComplete === 'complete'
    //               ? handleClick
    //               : handleWatchAd
    //           }
    //           disabled={isWatchingAd}
    //         >
    //           {registrationComplete === 'complete'
    //             ? 'Watch Ads'
    //             : 'Watch Ad to complete registration'}
    //         </Button>
    //         {isWatchingAd && adVideos.length > 0 && (
    //           <video
    //             src={adVideos[currentAdIndex].videoUrl}
    //             onEnded={handleAdEnded}
    //             autoPlay
    //             controls
    //           />
    //         )}
    //       </Grid>
    //     </Grid>
    //   </CardContent>
    // </Card>
  );
}
