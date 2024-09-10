import axios from 'axios';

// Fetch ads for review
export const fetchAdsForReview = async () => {
  try {
    const response = await axios.post('/api/ads/ads');
    return response.data;
  } catch (error) {
    console.error('Error fetching ads:', error);
    throw new Error('Failed to fetch ads');
  }
};

// approve or reject an ad
export const reviewAd = async (adId, action) => {
  try {
    const response = await fetch(`/api/ads/${adId}/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ adId, action }),
    });
    return response.json();
  } catch (error) {
    console.error(`Failed to ${action} ad:`, error);
    throw new Error(`Failed to ${action} ad`);
  }
};
