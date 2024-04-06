import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession, getSession } from 'next-auth/react';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Box,
} from '@mui/material';
import { styled } from '@mui/system';

export default function JackpotButton(name) {
  const router = useRouter();
  const { data: session, update } = useSession();

  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [adVideos, setAdVideos] = useState([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [registrationComplete, setRegistrationComplete] = useState(
    session.user.registrationStatus
  );

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

  const handleInviteFriend = () => {
    const inviteLink = `http://localhost:3000/register?inviteCode=${session.user.inviteCode}&redirect=/`;
    let whatsappMessage = `Hey, I would like to invite you to join this cool platform. Please use the following link to register:${inviteLink}`;
    let whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
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
    <Button
      variant="contained"
      color="primary"
      onClick={name === 'Joiners' ? handleInviteFriend : handleGoToAds}
    >
      {name === 'inviteFriend' ? 'Invite Friend' : 'Join Now!'}
    </Button>
  );
}
