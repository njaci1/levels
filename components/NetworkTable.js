import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

export default function NetworkTable({ networkData }) {
  return (
    <TableContainer component={Paper} sx={{ minWidth: 650 }}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Level</TableCell>
            <TableCell>Invitees</TableCell>
            <TableCell>Points</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {networkData && (
            <>
              {[1, 2, 3].map((level) => (
                <TableRow key={level}>
                  <TableCell component="th" scope="row">
                    {level}
                  </TableCell>
                  <TableCell>
                    {networkData[`inviteesLevel${level}Count`]}
                  </TableCell>
                  <TableCell>
                    {Math.floor(networkData[`earningsLevel${level}`])}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={2}>myPoints</TableCell>
                <TableCell>{networkData.earningsLevel0}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>Points to Date</TableCell>
                <TableCell>{networkData.totalEarnings}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>Redeemed Points</TableCell>
                <TableCell>{networkData.withdrawals}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>Points Balance</TableCell>
                <TableCell>{Math.floor(networkData.balance)}</TableCell>
              </TableRow>
            </>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
