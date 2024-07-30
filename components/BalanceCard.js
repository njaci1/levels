import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  styled,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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

const StyledCard = styled(Card)({
  margin: '1em',
  padding: '1em',
  backgroundColor: '#f5f5f5',
  borderRadius: '15px',
  boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
});

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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Typography variant="h3">Hey, {session.user.name}!</Typography>
      <Typography variant="h8" component="div" gutterBottom>
        Balance: KES{' '}
        <span id="total-winnings">{Math.floor(balance * 0.9)}</span>{' '}
        <Button
          variant="contained"
          sx={{ padding: '2px 4px', fontSize: '0.525rem' }}
        >
          Cash Out
        </Button>
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 2,
          width: '100%',
          justifyContent: 'space-around',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6" component="div" gutterBottom>
            Network Size and Potential Commission
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Level</TableCell>
                  <TableCell align="right">Network Size</TableCell>
                  <TableCell align="right">Potential Commission</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[1, 2, 3].map((level) => (
                  <TableRow key={level}>
                    <TableCell component="th" scope="row">
                      {level}
                    </TableCell>
                    <TableCell align="right">
                      {networkSize[level - 1]}
                    </TableCell>
                    <TableCell align="right">$0.00</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
}

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
// );
