import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import axios from 'axios';

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
    <button
      className="bg-customGreen hover:bg-customGreen-dark text-white mt-4 py-3 px-8 sm:w-full sm:py-2 sm:px-0 rounded"
      onClick={name === 'Joiners' ? handleInviteFriend : handleGoToAds}
    >
      {name === 'Joiners' ? 'Invite Friend' : 'Join Now!'}
    </button>
  );
}
