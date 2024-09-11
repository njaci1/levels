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
import { useSession } from 'next-auth/react';

import axios from 'axios';

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

export default function NetworkCard({ networkSize }) {
  const { data: session } = useSession();
  const handleInviteFriend = () => {
    const inviteLink = `http://localhost:3000/register?inviteCode=${session.user.inviteCode}&redirect=/`;
    let whatsappMessage = `Hey, I would like to invite you to join this cool platform. Please use the following link to register:${inviteLink}`;
    let whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      whatsappMessage
    )}`;
    window.open(whatsappUrl);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        maxWidth: '30vw', // Adjust the table size to occupy 40% of the window width
        margin: 'auto',
      }}
    >
      {/* Table heading with invite button */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Typography variant="h6">Expand your network</Typography>
        <Button
          variant="contained"
          onClick={handleInviteFriend}
          sx={{ padding: '3px 8px', fontSize: '0.525rem' }}
        >
          Invite Friend
        </Button>
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Network Level</strong>
              </TableCell>
              <TableCell align="right">
                <strong>No. Invited</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[1, 2, 3].map((level) => (
              <TableRow key={level}>
                <TableCell component="th" scope="row">
                  Level {level}
                </TableCell>
                <TableCell align="right">{networkSize[level - 1]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
