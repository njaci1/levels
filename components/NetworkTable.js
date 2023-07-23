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
            <TableCell>Earnings</TableCell>
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
                    {networkData[`inviteesLevel${level}`].length}
                  </TableCell>
                  <TableCell>{networkData[`earningsLevel${level}`]}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={2}>Total Earnings</TableCell>
                <TableCell>{networkData.totalEarnings}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>Total Cash Out</TableCell>
                <TableCell>{networkData.withdrawals}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>Current Balance</TableCell>
                <TableCell>{networkData.balance}</TableCell>
              </TableRow>
            </>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
