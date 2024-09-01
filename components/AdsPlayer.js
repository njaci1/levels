import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { set } from 'mongoose';

function AdsPlayer() {
  const [adsQueue, setAdsQueue] = useState(null);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [showButtons, setShowButtons] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [doubleLiked, setDoubleLiked] = useState(false);
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

    if (response.status === 200) {
      // Initialize the liked and disliked states based on the interaction data
      setDoubleLiked(data.doubleLiked);
      setLiked(data.liked);
      setDisliked(data.disliked);
    } else {
      setDoubleLiked(false);
      setLiked(false);
      setDisliked(false);
    }
  };

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await axios.get('/api/ads/ads');
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
    setDoubleLiked(false);
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

  const handleReplay = () => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      video.play();
    }
  };

  const handlePrevious = () => {
    setCurrentAdIndex((prevIndex) => {
      const newIndex = prevIndex - 1 >= 0 ? prevIndex - 1 : adsQueue.length - 1;
      return newIndex;
    });
  };

  const handleSkip = () => {
    setCurrentAdIndex((prevIndex) => {
      const newIndex = prevIndex + 1 < adsQueue.length ? prevIndex + 1 : 0;
      const video = videoRef.current;
      if (video) {
        video.onloadeddata = () => {
          video.play(); // Autoplay the next video
        };
      }
      return newIndex;
    });
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
  // records the engagement with the ad and keeps count of the number of times the user has rated an ad
  const handleJackpotEntry = async (userId, adId) => {
    try {
      const response = await fetch('/api/enterJackpot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, adId }),
      });
      const data = await response.json();
      // Handle the response data...
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDoubleLike = async () => {
    setDoubleLiked(true);
    setLiked(false);
    setDisliked(false);
    const response = await fetch('/api/updateInteractions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        adId: adsQueue[currentAdIndex]._id,
        userId,
        doubleLiked: true,
        liked: false,
        disliked: false,
      }),
    });
    const data = await response.json();
    handleJackpotEntry(userId, adsQueue[currentAdIndex]._id);
    // Handle the response data...
  };

  const handleLike = async () => {
    handleJackpotEntry(userId, adsQueue[currentAdIndex]._id); // records the engagement with the ad and keeps count of the number of times the user has rated an ad

    setDoubleLiked(false);
    setLiked(true);
    setDisliked(false);
    const response = await fetch('/api/updateInteractions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        adId: adsQueue[currentAdIndex]._id,
        userId,
        doubleLiked: false,
        liked: true,
        disliked: false,
      }),
    });
    const data = await response.json();

    // Handle the response data...
  };

  const handleDislike = async () => {
    handleJackpotEntry(userId, adsQueue[currentAdIndex]._id); // records the engagement with the ad and keeps count of the number of times the user has rated an ad
    setDoubleLiked(false);
    setLiked(false);
    setDisliked(true);
    const response = await fetch('/api/updateInteractions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        adId: adsQueue[currentAdIndex]._id,
        userId,
        doubleLiked: false,
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
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <button style={{ margin: '10px' }} onClick={handlePrevious}>
              <i class="fas fa-step-backward"></i> Previous
            </button>
            <button style={{ margin: '10px' }} onClick={handleSkip}>
              <i class="fas fa-step-forward"></i> Skip
            </button>
          </div>
          {showButtons && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleReplay}
                style={{ color: 'black', padding: '10px' }}
              >
                <i class="fas fa-redo"></i>
              </button>
              <button
                onClick={handleLike}
                style={{ color: liked ? 'green' : 'black', padding: '10px' }}
                disabled={liked || disliked}
              >
                <i class="fas fa-thumbs-up"></i>
              </button>
              <button
                onClick={handleDislike}
                style={{ color: disliked ? 'red' : 'black', padding: '10px' }}
                disabled={liked || disliked}
              >
                <i class="fas fa-thumbs-down"></i>
              </button>
              <button
                onClick={handleNext}
                style={{ color: 'black', padding: '10px' }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    ) : (
      <p>No ads available.</p>
    )
  ) : (
    <p>Loading...</p>
  );
}

export default AdsPlayer;
