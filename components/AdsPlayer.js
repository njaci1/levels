import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests

const AdPlayer = () => {
  const [currentAd, setCurrentAd] = useState(null);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        // Fetch ads from the backend
        const response = await axios.get('/api/ads');

        // Randomly select an ad from the fetched ads
        const ads = response.data;
        const randomAd = ads[Math.floor(Math.random() * ads.length)];

        setCurrentAd(randomAd);
      } catch (error) {
        console.error('Error fetching ads:', error);
      }
    };

    // Fetch ads initially and then every 10 seconds
    fetchAds();
    const interval = setInterval(fetchAds, 10000);

    // Cleanup function to clear interval
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {currentAd && currentAd.type === 'video' && (
        <video
          src={currentAd.videoUrl}
          autoPlay
          muted
          controls
          width="640"
          height="360"
        >
          Your browser does not support the video tag.
        </video>
      )}
      {currentAd && currentAd.type === 'banner' && (
        <img
          src={currentAd.imageUrl}
          alt={currentAd.title}
          width="640"
          height="360"
        />
      )}
    </div>
  );
};

export default AdPlayer;
