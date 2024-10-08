import React, { useState, useEffect } from 'react';
import { fetchAdsForReview, reviewAd } from '../../lib/reviewAds';
import { Button, Typography, CircularProgress, Box } from '@mui/material';

const ReviewPage = () => {
  const [ads, setAds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const ads = await fetchAdsForReview();
        setAds(ads);
      } catch (error) {
        setError('Failed to load ads for review.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAds();
  }, []);

  const handleAction = async (action, id) => {
    try {
      await reviewAd(id, action);
      // Optimistically update UI by removing reviewed ad
      const updatedAds = ads.filter((ad) => ad._id !== id);
      setAds(updatedAds);
    } catch (error) {
      setError(`Failed to ${action} ad. Please try again.`);
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      {ads.length === 0 ? (
        <Box textAlign="center">
          <Typography variant="h6">No pending items</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
        </Box>
      ) : (
        ads.map((ad) => (
          <Box
            key={ad._id}
            mb={3}
            p={2}
            border="1px solid #ccc"
            borderRadius={2}
          >
            <Typography variant="h6">{ad.title}</Typography>
            <Typography>ID: {ad._id}</Typography>
            <Box mt={2}>
              <Button
                variant="contained"
                color="success"
                onClick={() => handleAction('approve', ad._id)}
                sx={{ mr: 2 }}
              >
                Approve
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleAction('reject', ad._id)}
              >
                Reject
              </Button>
            </Box>
          </Box>
        ))
      )}
    </Box>
  );
};

export default ReviewPage;
