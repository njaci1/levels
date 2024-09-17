import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { Button } from '@mui/material';
import { styled } from '@mui/system';

// Styled button to maintain consistency with other button styles
const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: '1em',
  backgroundColor: '#3f51b5',
  color: 'white',
  padding: '0.75em 2em', // Larger button for better interaction
  '&:hover': {
    backgroundColor: '#303f9f',
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%', // Full-width button on mobile
    padding: '0.5em 0', // Compact padding on smaller screens
  },
}));

export default function JackpotButton({ name }) {
  const router = useRouter();
  const { data: session } = useSession();

  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [adVideos, setAdVideos] = useState([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [registrationComplete, setRegistrationComplete] = useState(
    session?.user?.registrationStatus || 'pending'
  );

  useEffect(() => {
    if (name === 'Joiners') {
      axios
        .get('/api/getJoinersAds')
        .then((response) => {
          setAdVideos(response.data);
        })
        .catch((error) => {
          console.error('Failed to fetch videos:', error);
        });
    }
  }, [name]);

  const handleInviteFriend = () => {
    const inviteLink = `${process.env.NEXT_PUBLIC_BASE_URL}/register?inviteCode=${session?.user?.inviteCode}&redirect=/`;
    const whatsappMessage = `Hey, I would like to invite you to join this cool platform. Please use the following link to register: ${inviteLink}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      whatsappMessage
    )}`;
    window.open(whatsappUrl);
  };

  const handleGoToAds = () => {
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
        .put(`/api/user/${session?.user?._id}/completeRegistration`)
        .then(() => {
          setRegistrationComplete('complete');
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <StyledButton
      variant="contained"
      color="primary"
      sx={{ backgroundColor: '#6bbd00' }}
      onClick={name === 'Joiners' ? handleInviteFriend : handleGoToAds}
    >
      {name === 'Joiners' ? 'Invite Friend' : 'Join Now!'}
    </StyledButton>
  );
}
