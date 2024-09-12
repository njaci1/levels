import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdsPlayer() {
  const [adsQueue, setAdsQueue] = useState(null);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [showButtons, setShowButtons] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [doubleLiked, setDoubleLiked] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  // const [canProceed, setCanProceed] = useState(false); // Disable next ad until rated
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const observerRef = useRef(null); // Reference to IntersectionObserver
  const videoRef = useRef(null);
  const { data: session } = useSession();
  const [adsWatched, setAdsWatched] = useState(0);
  const userId = session.user._id;
  const [registrationStatus, setRegistrationStatus] = useState(
    session.user.registrationStatus
  );

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await axios.get('/api/ads/ads');
        const ads = response.data;

        if (ads && ads.length > 0) {
          setAdsQueue(ads);
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

  const fetchInteractionData = async (adId) => {
    try {
      const response = await fetch(
        `/api/getInteraction?adId=${adId}&userId=${userId}`
      );
      const data = await response.json();
      if (response.status === 200) {
        setDoubleLiked(data.doubleLiked);
        setLiked(data.liked);
        setDisliked(data.disliked);
      } else {
        setDoubleLiked(false);
        setLiked(false);
        setDisliked(false);
      }
    } catch (error) {
      console.error('Error fetching interaction data:', error);
    }
  };

  // Lazy loading: IntersectionObserver to detect if video is in the viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsVideoVisible(entry.isIntersecting);
      },
      { threshold: 0.5 } // Trigger when 50% of the video is visible
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Play or pause video based on visibility
  useEffect(() => {
    if (isVideoVisible && videoRef.current) {
      videoRef.current.play();
    } else if (!isVideoVisible && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isVideoVisible]);

  useEffect(() => {
    if (registrationStatus === 'pending' && adsWatched >= 3) {
      const completeRegistration = async () => {
        try {
          await axios.put(`/api/user/${session.user._id}/completeRegistration`);
          setRegistrationStatus('complete');
          showToast(
            'success',
            "Your registration is complete! You've been entered into this month's joiners jackpot!"
          );
        } catch (error) {
          console.error('Error completing registration:', error);
          showToast(
            'error',
            'Failed to complete registration. Please try again.'
          );
        }
      };

      completeRegistration();
    }
  }, [adsWatched, registrationStatus, session.user._id]);

  const handleVideoEnd = () => {
    setShowButtons(true);
    setIsPlaying(false);
    // setCanProceed(false); // Require rating before allowing to proceed
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

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
    // setCanProceed(false); // Reset the ability to proceed to next ad
  }, [currentAdIndex]);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      isPlaying ? video.pause() : video.play();
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
          video.muted = true;
          video.play().catch((error) => {
            console.error('Autoplay failed:', error);
          });
        };
      }
      return newIndex;
    });
  };
  const handleNext = () => {
    // if (!canProceed) return; // Prevent skipping if no interaction
    setShowButtons(false);
    setCurrentAdIndex((prevIndex) => {
      const newIndex = prevIndex + 1 < adsQueue.length ? prevIndex + 1 : 0;
      const video = videoRef.current;
      if (video) {
        video.onloadeddata = () => {
          video.muted = true;
          video.play(); // Autoplay the next video
        };
      }
      fetchInteractionData(adsQueue[newIndex]._id);
      updateViews(prevIndex);
      return newIndex;
    });
  };

  const updateViews = async (prevIndex) => {
    try {
      await fetch('/api/updateViews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adId: adsQueue[prevIndex]._id, userId }),
      });
    } catch (error) {
      console.error('Error updating views:', error);
    }
  };

  const handleInteraction = async (interactionType) => {
    const body = {
      adId: adsQueue[currentAdIndex]._id,
      userId,
      doubleLiked: interactionType === 'doubleLike',
      liked: interactionType === 'like',
      disliked: interactionType === 'dislike',
      adsWatched: adsWatched + 1,
    };

    try {
      await fetch('/api/updateInteractions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      setAdsWatched((prev) => prev + 1);
      handleJackpotEntry(userId, adsQueue[currentAdIndex]._id);

      if (interactionType === 'doubleLike') {
        setDoubleLiked(true);
        setLiked(false);
        setDisliked(false);
      } else if (interactionType === 'like') {
        setLiked(true);
        setDoubleLiked(false);
        setDisliked(false);
      } else {
        setDisliked(true);
        setLiked(false);
        setDoubleLiked(false);
      }

      // setCanProceed(true); // Enable next ad after rating
    } catch (error) {
      console.error('Error handling interaction:', error);
    }
  };

  const handleJackpotEntry = async (userId, adId) => {
    try {
      const response = await fetch('/api/enterJackpot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, adId }),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error entering jackpot:', error);
    }
  };

  const showToast = (type, message) => {
    if (type === 'success') {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  return (
    <div>
      <ToastContainer autoClose={5000} />
      {adsQueue ? (
        adsQueue.length > 0 ? (
          <div style={{ position: 'relative' }}>
            <video
              ref={videoRef}
              id="ad-video"
              src={adsQueue[currentAdIndex]?.videoUrl}
              controls
              preload="none"
              poster="/images/placeholder.jpeg"
              onClick={handlePlayPause} // makes clicking in the video to pause/resume
              style={{ cursor: 'pointer' }} // Show pointer to indicate interaction
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <button style={{ margin: '10px' }} onClick={handlePrevious}>
                  <i className="fas fa-step-backward"></i>{' '}
                </button>
                <button style={{ margin: '10px' }} onClick={handleSkip}>
                  <i className="fas fa-step-forward"></i>{' '}
                </button>
              </div>
              {showButtons && (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={handleReplay}
                    style={{ color: 'black', padding: '10px' }}
                  >
                    <i className="fas fa-redo"></i>
                  </button>
                  {/* <button
                    onClick={() => handleInteraction('doubleLike')}
                    style={{ color: doubleLiked ? 'green' : 'black' }}
                    disabled={liked || disliked}
                  >
                    <i className="fas fa-thumbs-up"></i> Double Like
                  </button> */}
                  <button
                    onClick={() => handleInteraction('like')}
                    style={{
                      color: liked ? 'green' : 'black',
                      padding: '10px',
                    }}
                    disabled={liked || disliked}
                  >
                    <i className="fas fa-thumbs-up"></i>
                  </button>
                  <button
                    onClick={() => handleInteraction('dislike')}
                    style={{
                      color: disliked ? 'red' : 'black',
                      padding: '10px',
                    }}
                    disabled={liked || disliked}
                  >
                    <i className="fas fa-thumbs-down"></i>
                  </button>
                  <button onClick={handleNext} style={{ padding: '10px' }}>
                    Next <i className="fas fa-step-forward"></i>
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
      )}
    </div>
  );
}

export default AdsPlayer;
