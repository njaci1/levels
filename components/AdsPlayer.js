import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

function AdsPlayer() {
  const [adsQueue, setAdsQueue] = useState(null);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [showButtons, setShowButtons] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbsUp, setThumbsUp] = useState(false);
  const [thumbsDown, setThumbsDown] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await axios.get('/api/ads');
        const ads = response.data;

        if (ads && ads.length > 0) {
          setAdsQueue(ads);
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
      //   setCurrentAdIndex((prevIndex) =>
      //     prevIndex + 1 < adsQueue.length ? prevIndex + 1 : 0
      //   );
    };

    video.addEventListener('ended', handleVideoEnd);

    return () => {
      video.removeEventListener('ended', handleVideoEnd);
    };
  }, [adsQueue, currentAdIndex]);

  useEffect(() => {
    setThumbsUp(false);
    setThumbsDown(false);
    setShowButtons(false);
  }, [currentAdIndex]);

  //   useEffect(() => {
  //     if (adsQueue && adsQueue.length > 0) {
  //       setShowButtons(false);
  //       setIsPlaying(false);
  //       setCurrentAdIndex(0);

  //       const video = videoRef.current;

  //       if (!video) return;

  //       const handleVideoEnd = () => {
  //         setShowButtons(true);
  //         setIsPlaying(false);
  //         setCurrentAdIndex((prevIndex) =>
  //           prevIndex + 1 < adsQueue.length ? prevIndex + 1 : 0
  //         );
  //       };

  //       video.addEventListener('ended', handleVideoEnd);

  //       return () => {
  //         video.removeEventListener('ended', handleVideoEnd);
  //       };
  //     }
  //   }, [adsQueue]);

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
      return newIndex;
    });
  };

  const handleThumbsUp = () => {
    setThumbsUp(true);
    setThumbsDown(false);
  };

  const handleThumbsDown = () => {
    setThumbsDown(true);
    setThumbsUp(false);
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
              onClick={handleThumbsUp}
              style={{ color: thumbsUp ? 'green' : 'blue', padding: '10px' }}
            >
              Thumbs Up
            </button>
            <button
              onClick={handleThumbsDown}
              style={{ color: thumbsDown ? 'red' : 'blue', padding: '10px' }}
            >
              Thumbs Down
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
