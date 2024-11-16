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
          variant="h8"
          component="span"
          sx={{
            fontSize: { xs: '1.1rem', sm: '1.3rem' },
            fontWeight: 'bold',
            color: '#333',
          }}
        >
          Grow your network:&nbsp;
        </Typography>
        <button
          class="bg-customPurple hover:bg-customPurple-dark text-white py-1 px-2 sm:py-1.5 sm:px-3 text-xs sm:text-sm rounded"
          onClick={handleInviteFriend}
        >
          Invite a Friend
        </button>
      </Box>

      <TableContainer>
        <Table size="small" sx={{ width: '100%' }}>
          {/* <TableHead>
            <TableRow>
              <TableCell>
                <strong>Network Level</strong>
              </TableCell>
              <TableCell align="center">
                <strong>No. Invited</strong>
              </TableCell>
            </TableRow>
          </TableHead> */}
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
