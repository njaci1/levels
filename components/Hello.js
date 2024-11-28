import Layout from './Layout';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Typography, Button, Box, Grid, Paper } from '@mui/material';

export default function Hello() {
  const router = useRouter();
  const { redirect } = router.query;

  const [jackpots, setJackpots] = useState({
    joinersTotal: 0,
    weeklyTotal: 0,
    monthlyTotal: 0,
    annualTotal: 0,
  });

  useEffect(() => {
    fetch('/api/jackpotTotals')
      .then((response) => response.json())
      .then((data) => {
        setJackpots({
          joinersTotal: data.joinersTotal,
          weeklyTotal: data.weeklyTotal,
          monthlyTotal: data.monthlyTotal,
          annualTotal: data.annualTotal,
        });
      });
  }, []);

  return (
    <Layout title="Hello Page">
      {/* Main Container */}
      <Box sx={{ minHeight: '100vh', py: 4, textAlign: 'center' }}>
        <Box
          sx={{ backgroundColor: '#f5f5f5', p: 3, borderRadius: '8px', mb: 4 }}
        >
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Watch Ads, Stand a Chance to Win Cash Prizes!
          </Typography>
          <Typography variant="h6">
            Watch and rate ads for a chance to win up to{' '}
            <strong
              style={{
                color: '#f2b41e',
                fontSize: '1.2rem', // Slightly larger font size
                fontWeight: 'bold',
              }}
            >
              <span className="text-sm">KSh.</span>
              {jackpots.weeklyTotal}
            </strong>
          </Typography>
          <Button
            href={`/register?inviteCode=&redirect=${redirect || '/'}`}
            sx={{
              mt: 2,
              px: 4,
              py: 1.5,
              backgroundColor: '#22c55e', // Custom green color
              color: 'white',
              '&:hover': {
                backgroundColor: '#16a34a', // Darker green on hover
              },
            }}
          >
            Join Now!
          </Button>
        </Box>

        {/* Jackpot Cards Section */}
        <Box sx={{ px: 3 }}>
          <Grid container spacing={3} justifyContent="center">
            {['Joiners', 'Weekly', 'Monthly', 'Annual'].map((jackpot) => (
              <Grid item xs={12} sm={6} md={3} key={jackpot}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    {jackpot} Prize
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="primary">
                    <span className="text-sm">KSh.</span>
                    {jackpots[`${jackpot.toLowerCase()}Total`]}
                  </Typography>
                  <Button
                    href={`/register?inviteCode=&redirect=${redirect || '/'}`}
                    sx={{
                      mt: 2,
                      px: 3,
                      py: 1,
                      backgroundColor: '#22c55e', // Custom green color
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#16a34a', // Darker green on hover
                      },
                    }}
                  >
                    Join Now!
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Layout>
  );
}
