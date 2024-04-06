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
import { styled } from '@mui/system';

const StyledCard = styled(Card)({
  margin: '1em',
  padding: '1em',
  backgroundColor: '#f5f5f5',
  borderRadius: '15px',
  boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
});

const Title = styled(Typography)({
  textAlign: 'center',
  marginBottom: '1em',
});

const JoinButton = styled(Button)({
  marginTop: '1em',
  backgroundColor: '#3f51b5',
  color: 'white',
  '&:hover': {
    backgroundColor: '#303f9f',
  },
});

const Amount = styled(Typography)({
  fontSize: '1.5em',
  fontWeight: 'bold',
});

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

  // Calculate the difference between now and the draw date
  const diff = drawDate - now;
  // Convert the difference into days, hours, and minutes
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (days === 0) {
    return `${hours} hrs ${minutes} min`;
  } else {
    return `${days} Days`;
  }
};

const JackpotCard = ({ name, amount, entries }) => {
  const drawDate = getNextDrawDate(name);
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  return (
    <StyledCard>
      <CardContent>
        <Title variant="h4">{name}</Title>
        <Amount>{amount}</Amount>
        <Typography variant="body1">Your Entries: {entries}</Typography>
        <Typography variant="body1">Next Draw in:</Typography>
        <Typography variant="body1">{drawDate}</Typography>
        <JackpotButton name={name} />
      </CardContent>
    </StyledCard>
  );
};

export default JackpotCard;
