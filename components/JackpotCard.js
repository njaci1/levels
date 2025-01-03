import React, { useState, useEffect } from 'react';
import JackpotButton from './JackpotButton';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Box,
} from '@mui/material';
import { display, styled } from '@mui/system';
import axios from 'axios';
import { getSession } from 'next-auth/react';

const session = getSession();

// Styled card with responsive padding and box-shadow
const StyledCard = styled(Card)(({ theme }) => ({
  margin: '1em',
  padding: '1.5em',
  // backgroundColor: '#f5f5f5',
  borderRadius: '15px',

  height: '85%',
  boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
  transition: 'all 0.3s ease', // Smooth hover transition
  '&:hover': {
    transform: 'translateY(-5px)', // Slight hover effect for better interaction
    boxShadow: '0 8px 12px rgba(0,0,0,0.2)', // Enhanced shadow on hover
  },
  [theme.breakpoints.down('sm')]: {
    padding: '1em', // Reduced padding for smaller screens
  },
}));

// Title styling with responsive typography
const Title = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: '0.5em',
  fontSize: '1.5rem',
  [theme.breakpoints.up('sm')]: {
    fontSize: '2rem',
  },
}));

// Amount styling with bold and responsive font size
const Amount = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 'bold',
  textAlign: 'center',
  marginBottom: '0.5em',
  [theme.breakpoints.up('sm')]: {
    fontSize: '2rem',
  },
}));

const getNextDrawDate = (name) => {
  const now = new Date();
  let drawDate;

  if (name === 'Daily') {
    drawDate = new Date(now);
    drawDate.setHours(24, 0, 0, 0); // Next midnight
  } else if (name === 'Weekly') {
    drawDate = new Date(now);
    const dayOfWeek = now.getDay();
    const daysUntilThursday = (4 - dayOfWeek + 7) % 7; // Thursday = 4
    drawDate.setDate(now.getDate() + daysUntilThursday);
    drawDate.setHours(24, 0, 0, 0); // Midnight
  } else if (name === 'Monthly') {
    drawDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of the current month
    drawDate.setHours(24, 0, 0, 0); // Midnight
  } else if (name === 'Annual') {
    drawDate = new Date(now.getFullYear(), 11, 31); // December 31
    if (now > drawDate) {
      drawDate.setFullYear(now.getFullYear() + 1); // Move to next year
    }
    drawDate.setHours(24, 0, 0, 0); // Midnight
  } else {
    return 'Invalid draw name';
  }

  // Calculate the countdown
  const diff = drawDate - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return days <= 0 ? `${hours} hrs ${minutes} min` : `${days} Days`;
};

const JackpotCard = ({ name }) => {
  const _id = session.user.id;
  const [jackpots, setJackpots] = useState({
    Daily: 'loading...',
    Weekly: 'loading...',
    Monthly: 'loading...',
    Annual: 'loading...',
    Welcome: 'loading...',
  });

  const [jackpotEntries, setJackpotEntries] = useState({
    Daily: 'loading...',
    Weekly: 'loading...',
    Monthly: 'loading...',
    Annual: 'loading...',
  });

  useEffect(() => {
    fetch('/api/jackpotTotals')
      .then((response) => response.json())
      .then((data) => {
        setJackpots({
          Daily: data.dailyTotal,
          Weekly: data.weeklyTotal,
          Monthly: data.monthlyTotal,
          Annual: data.annualTotal,
          Welcome: data.joinersTotal,
        });
      });
  }, []);

  useEffect(() => {
    try {
      const fetchUserNetwork = async () => {
        const response = await axios.post('/api/getJackpotEntries', { _id });
        setJackpotEntries({
          Daily: data.dailyEntries,
          Weekly: data.weeklyEntries,
          Monthly: data.monthlyEntries,
          Annual: data.annualEntries,
        });
        return response.data;
      };

      fetchUserNetwork();
    } catch (error) {
      console.error('Error fetching invitee stats:', error);
      throw error;
    }
  }, [_id]);

  let drawName = name;
  switch (drawName) {
    case 'Today!':
      drawName = 'Daily';
      break;
    case 'This Week':
      drawName = 'Weekly';
      break;
    case 'End Month':
      drawName = 'Monthly';
      break;
    case 'End of Year':
      drawName = 'Annual';
      break;
    default:
      return <div>Invalid Jackpot name</div>;
  }
  // const displayAmount = amount;
  const drawDate = getNextDrawDate(drawName);

  return (
    <StyledCard>
      <CardContent>
        <Title variant="h4">{name}</Title>
        <Amount>
          <span className="text-sm">KES.</span>
          {jackpots[drawName]}
        </Amount>
        <Typography align="center">
          Your Entries: {jackpotEntries[drawName]}
        </Typography>
        <Typography align="center" color="textSecondary">
          Next Draw in:
        </Typography>
        <Typography align="center" sx={{ color: 'primary.main' }}>
          {drawDate}
        </Typography>
        {/* <JoinButton variant="contained">Join</JoinButton> */}

        <Box sx={{ textAlign: 'center' }}>
          <JackpotButton name={name} />
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default JackpotCard;
