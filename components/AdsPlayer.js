import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

function AdsPlayer() {
  const [adsQueue, setAdsQueue] = useState(null);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [showButtons, setShowButtons] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const videoRef = useRef(null);
  const { data: session } = useSession();
  const userId = session.user._id;

  const fetchInteractionData = async (adId) => {
    // Fetch the interaction data for the current ad and user
    const response = await fetch(
      `/api/getInteraction?adId=${adId}&userId=${userId}`
    );
    const data = await response.json();
    // console.log(data);

    // Initialize the liked and disliked states based on the interaction data
    setLiked(data.liked);
    setDisliked(data.disliked);
    // console.log(adId, '|', userId, '|', liked, '|', disliked);
  };

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await axios.get('/api/ads');
        const ads = response.data;

        if (ads && ads.length > 0) {
          setAdsQueue(ads);
          // Fetch the interaction data for the first ad
          fetchInteractionData(ads[0]._id);
        } else {
          setAdsQueue([]);
        }
      } catch (error) {
        console.error('Error fetching ads:', error);
      }
    };

    fetchAds();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoEnd = () => {
      setShowButtons(true);
      setIsPlaying(false);
    };

    video.addEventListener('ended', handleVideoEnd);

    return () => {
      video.removeEventListener('ended', handleVideoEnd);
    };
  }, [adsQueue, currentAdIndex]);

  useEffect(() => {
    setLiked(false);
    setDisliked(false);
    setShowButtons(false);
  }, [currentAdIndex]);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSkip = () => {
    setCurrentAdIndex((prevIndex) =>
      prevIndex + 1 < adsQueue.length ? prevIndex + 1 : 0
    );
  };

  const handleNext = () => {
    setShowButtons(false);
    setCurrentAdIndex((prevIndex) => {
      const newIndex = prevIndex + 1 < adsQueue.length ? prevIndex + 1 : 0;
      const video = videoRef.current;
      if (video) {
        video.onloadeddata = () => {
          video.play(); // Autoplay the next video
        };
      }

      // Fetch the interaction data for the new ad
      fetchInteractionData(adsQueue[newIndex]._id);

      // Update the interaction record for the current ad
      fetch('/api/updateViews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adId: adsQueue[prevIndex]._id, userId: userId }),
      });

      return newIndex;
    });
  };

  const handleLike = async () => {
    setLiked(true);
    setDisliked(false);
    const response = await fetch('/api/interactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        adId: adsQueue[currentAdIndex]._id,
        userId,
        liked: true,
        disliked: false,
      }),
    });
    const data = await response.json();
    // Handle the response data...
  };

  const handleDislike = async () => {
    setLiked(false);
    setDisliked(true);
    const response = await fetch('/api/interactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        adId: adsQueue[currentAdIndex]._id,
        userId,
        liked: false,
        disliked: true,
      }),
    });
    const data = await response.json();
    // Handle the response data...
  };

  return adsQueue ? (
    adsQueue.length > 0 ? (
      <div style={{ position: 'relative' }}>
        <video
          ref={videoRef}
          id="ad-video"
          src={adsQueue[currentAdIndex]?.videoUrl}
          controls
        />
        {showButtons && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              right: '10px',
              transform: 'translateY(-50%)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <button
              onClick={handlePlayPause}
              style={{ color: 'blue', padding: '10px' }}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button
              onClick={handleSkip}
              style={{ color: 'blue', padding: '10px' }}
            >
              Skip
            </button>
            <button
              onClick={handleNext}
              style={{ color: 'blue', padding: '10px' }}
            >
              Next
            </button>
            <button
              onClick={handleLike}
              style={{ color: liked ? 'green' : 'blue', padding: '10px' }}
            >
              Like
            </button>
            <button
              onClick={handleDislike}
              style={{ color: disliked ? 'red' : 'blue', padding: '10px' }}
            >
              Dislike
            </button>
          </div>
        )}
      </div>
    ) : (
      <p>No ads available.</p>
    )
  ) : (
    <p>Loading...</p>
  );
}

export default AdsPlayer;
