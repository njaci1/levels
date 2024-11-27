import React from 'react';
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

  if (name === 'Weekly') {
    drawDate = new Date();
    drawDate.setDate(
      now.getDay() >= 5
        ? now.getDate() + 7 - now.getDay()
        : now.getDate() + 5 - now.getDay()
    );
    drawDate.setHours(20, 0, 0, 0);
  } else if (name === 'Joiners') {
    drawDate = new Date();
    drawDate.setDate(
      now.getDay() >= 5
        ? now.getDate() + 7 - now.getDay()
        : now.getDate() + 5 - now.getDay()
    );
    drawDate.setHours(19, 0, 0, 0);
  } else if (name === 'Monthly') {
    drawDate = new Date(
      now.getFullYear(),
      now.getMonth() + (now.getDate() > 1 ? 1 : 0),
      1,
      20,
      0,
      0
    );
  } else if (name === 'Annual') {
    drawDate = new Date(
      now.getFullYear() +
        (now.getMonth() > 11 || (now.getMonth() === 11 && now.getDate() > 12)
          ? 1
          : 0),
      11,
      12,
      20,
      0,
      0
    );
  }

  const diff = drawDate - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return days === 0 ? `${hours} hrs ${minutes} min` : `${days} Days`;
};

const JackpotCard = ({ name, amount, entries }) => {
  const displayAmount = amount.split('.')[0];
  const drawDate = getNextDrawDate(name);

  return (
    <StyledCard>
      <CardContent>
        <Title variant="h4">{name}</Title>
        <Amount>
          <span className="text-sm">KES.</span>
          {displayAmount}
        </Amount>
        <Typography align="center">Your Entries: {entries}</Typography>
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
