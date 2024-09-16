import React from 'react';
import {
  Card,
  Typography,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useSession } from 'next-auth/react';

export default function NetworkCard({ networkSize }) {
  const { data: session } = useSession();

  const handleInviteFriend = () => {
    const inviteLink = `${process.env.NEXT_PUBLIC_BASE_URL}/register?inviteCode=${session?.user?.inviteCode}&redirect=/`;
    const whatsappMessage = `Hey, I would like to invite you to join this cool platform. Please use the following link to register: ${inviteLink}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
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
        width: { xs: '90vw', sm: '60vw', md: '40vw' }, // Adjust the width for different screen sizes
        margin: 'auto',
      }}
    >
      {/* Table heading with invite button */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          gap: 1,
          flexWrap: 'wrap', // To handle small screens better
        }}
      >
        <Typography
          variant="h5"
          component="span"
          sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
        >
          Grow your network:&nbsp;
        </Typography>
        <Button
          variant="contained"
          onClick={handleInviteFriend}
          sx={{
            padding: { xs: '3px 6px', sm: '4px 8px' },
            fontSize: { xs: '0.7rem', sm: '0.8rem' },
            minWidth: 'auto',
            backgroundColor: '#5D3FD3',
          }}
        >
          Invite a Friend
        </Button>
      </Box>

      <TableContainer>
        <Table size="small" sx={{ width: '100%' }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Network Level</strong>
              </TableCell>
              <TableCell align="center">
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
                <TableCell align="center">{networkSize[level - 1]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
