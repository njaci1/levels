import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { fetchAdsForReview, reviewAd } from '../../lib/reviewAds';

const ReviewPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [ads, setAds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'loading') return; // Do nothing while loading
    if (!session.user.role === 'admin') {
      console.log('Session:', session);
      router.push('/access-denied');
      return;
    }
    const fetchAds = async () => {
      try {
        const ads = await fetchAdsForReview();
        setAds(ads);
        setIsLoading(false);
      } catch (error) {
        setError('Failed to load ads for review.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAds();
  }, [session, status, router]);

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
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Pending Ads</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => router.push('/admin/uploader')}
        >
          Create New
        </button>
      </div>
      {ads.length === 0 ? (
        <div className="text-center">
          <p className="text-lg">No pending items</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ads.map((ad) => (
            <div key={ad._id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{ad.title}</h2>
              <p>{ad.description}</p>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={() => handleAction('approve', ad._id)}
                >
                  Approve
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => handleAction('reject', ad._id)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewPage;
