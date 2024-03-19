import { data } from 'autoprefixer';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReviewPage = () => {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await axios.post('/api/ads/ads');
        const ads = response.data;

        if (ads) {
          setAds(ads);
        }
      } catch (error) {
        console.error('Error fetching ads:', error);
      }
    };
    fetchAds();
  }, []);

  const handleAction = (action, id) => {
    fetch('/api/ads/[adId]/review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        adId: id,
        action: action,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Update the ads list with the updated ad
        console.log(data);
        const updatedAds = ads.map((ad) => {
          if (ad._id === adId) {
            return { ...ad, approvalStatus: 'rejected' };
          }
          return ad;
        });
        setAds(updatedAds);
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      {ads.length === 0 ? (
        <div>
          <p>No pending items</p>
          <button onClick={() => window.location.reload()}>Refresh</button>
        </div>
      ) : (
        ads.map((ad) => (
          <div key={ad._id}>
            <h3>{ad.title}</h3>
            <p>ID: {ad._id}</p>
            <button onClick={() => handleAction('approve', ad._id)}>
              Approve
            </button>
            <button onClick={() => handleAction('reject', ad._id)}>
              Reject
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewPage;
