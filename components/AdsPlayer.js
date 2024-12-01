import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSwipeable } from 'react-swipeable';
import Image from 'next/image';

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
  const [muteState, setMuteState] = useState(false); // Track mute state across videos
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
          fetchInteractionData(ads[currentAdIndex]._id);
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
    if (videoRef.current) {
      videoRef.current.muted = muteState;
      videoRef.current.play();
    }
  }, [currentAdIndex, muteState]);

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
      fetchInteractionData(adsQueue[newIndex]._id);
      return newIndex;
    });
  };
  const handleSkip = () => {
    setCurrentAdIndex((prevIndex) => {
      const newIndex = prevIndex + 1 < adsQueue.length ? prevIndex + 1 : 0;
      const video = videoRef.current;
      if (video) {
        video.onloadeddata = () => {
          video.muted = muteState; // Use mute state across videos
          video.play();
        };
      }
      fetchInteractionData(adsQueue[newIndex]._id);
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
          video.muted = muteState; // Use mute state across videos
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
      // handleJackpotEntry(userId, adsQueue[currentAdIndex]._id);

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

  const toggleMute = () => {
    setMuteState((prevState) => !prevState);
  };
  const swipeHandlers = useSwipeable({
    onSwipedUp: () => handleSkip(),
    onSwipedDown: () => handlePrevious(),
    delta: 50, // Min distance in px before a swipe is detected
    preventDefaultTouchmoveEvent: true,
    trackTouch: true,
  });

  return (
    <div
      {...swipeHandlers} // Add swipe handlers here
      className="relative w-full h-screen overflow-hidden flex flex-col"
    >
      <ToastContainer autoClose={5000} />
      {adsQueue ? (
        adsQueue.length > 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              height: '100vh',
              position: 'relative',
            }}
          >
            {adsQueue[currentAdIndex]?.type === 'video' && (
              <div className="w-full h-full flex items-center justify-center">
                <video
                  ref={videoRef}
                  id="ad-video"
                  src={adsQueue[currentAdIndex].videoUrl}
                  muted={muteState}
                  controls
                  autoPlay
                  preload="none"
                  poster="/images/placeholder.jpeg"
                  onClick={handlePlayPause} // makes clicking in the video to pause/resume
                  className="w-full h-full max-w-screen-lg object-contain"
                  playsInline
                />
              </div>
            )}
            {adsQueue[currentAdIndex]?.type === 'banner' && (
              <div className="flex justify-center w-full h-full">
                <Image
                  src={adsQueue[currentAdIndex].videoUrl}
                  alt="Banner Ad"
                  priority
                  onLoad={() => setShowButtons(true)}
                  className="w-full h-full max-w-screen-lg object-contain"
                  fill
                />
              </div>
            )}
            {adsQueue[currentAdIndex]?.type === 'survey' && (
              <iframe
                src={adsQueue[0].url}
                className="h-full w-auto"
                title="Survey"
                style={{ height: 'calc(100vh - 2.5rem)' }}
              />
            )}
            <div className="absolute bottom-14 right-4">
              <button
                className="rounded-circle w-btn-mobile h-btn-mobile sm:w-btn-size sm:h-btn-size flex items-center justify-center text-white bg-black/50 border border-white shadow-icon-light hover:shadow-icon-dark focus:outline-none"
                onClick={toggleMute}
              >
                {muteState ? (
                  <i className="fas fa-volume-up"></i>
                ) : (
                  <i className="fas fa-volume-mute"></i>
                )}
              </button>
            </div>

            <div className="absolute top-1/2 right-2 transform -translate-y-1/2 flex flex-col gap-3 sm:gap-4 sm:right-5">
              <button
                className="hidden md:flex rounded-circle w-btn-mobile h-btn-mobile sm:w-btn-size sm:h-btn-size items-center justify-center text-white bg-black/50 border border-white shadow-icon-light hover:shadow-icon-dark focus:outline-none"
                onClick={handlePrevious}
              >
                <i className="fas fa-step-backward"></i>
              </button>
              <button
                className="hidden md:flex rounded-circle w-btn-mobile h-btn-mobile sm:w-btn-size sm:h-btn-size items-center justify-center text-white bg-black/50 border border-white shadow-icon-light hover:shadow-icon-dark focus:outline-none"
                onClick={handleSkip}
              >
                <i className="fas fa-step-forward"></i>
              </button>
              {showButtons && (
                <>
                  <button
                    className="rounded-circle w-btn-mobile h-btn-mobile sm:w-btn-size sm:h-btn-size flex items-center justify-center text-white bg-black/50 border border-white shadow-icon-light hover:shadow-icon-dark focus:outline-none"
                    onClick={handleReplay}
                  >
                    <i className="fas fa-redo"></i>
                  </button>
                  <button
                    className={`rounded-circle w-btn-mobile h-btn-mobile sm:w-btn-size sm:h-btn-size flex items-center justify-center bg-black/50 border border-white shadow-icon-light hover:shadow-icon-dark focus:outline-none ${
                      liked ? 'text-green-500' : 'text-white'
                    }`}
                    onClick={() => handleInteraction('like')}
                    disabled={liked}
                  >
                    <i className="fas fa-thumbs-up"></i>
                  </button>
                  <button
                    className={`rounded-circle w-btn-mobile h-btn-mobile sm:w-btn-size sm:h-btn-size flex items-center justify-center bg-black/50 border border-white shadow-icon-light hover:shadow-icon-dark focus:outline-none ${
                      doubleLiked ? 'text-yellow-500' : 'text-white'
                    }`}
                    onClick={() => handleInteraction('doubleLike')}
                    disabled={doubleLiked}
                  >
                    <i class="fas fa-heart"></i>
                  </button>
                  <button
                    className={`rounded-circle w-btn-mobile h-btn-mobile sm:w-btn-size sm:h-btn-size flex items-center justify-center bg-black/50 border border-white shadow-icon-light hover:shadow-icon-dark focus:outline-none ${
                      disliked ? 'text-red-500' : 'text-white'
                    }`}
                    onClick={() => handleInteraction('dislike')}
                    disabled={disliked}
                  >
                    <i className="fas fa-thumbs-down"></i>
                  </button>
                </>
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
