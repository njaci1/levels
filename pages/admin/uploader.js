import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import {
  getCloudinarySignature,
  uploadFileToCloudinary,
  saveAdToDatabase,
} from '../../lib/uploaderService';
import calculatePrice from '../../lib/priceCalculator';
import AdminLayout from '../../components/AdminLayout';
import { set } from 'mongoose';

const Uploader = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [agent, setAgent] = useState('');
  const [type, setType] = useState('video');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [phone, setPhone] = useState('');
  const [duration, setDuration] = useState('1 week');
  const [priority, setPriority] = useState('high');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const { data: session, status } = useSession();
  const { cta, setCTA } = useState('');

  useEffect(() => {
    if (status === 'loading') return; // Do nothing while loading
    if (!session.user.role === 'admin') {
      router.push('/access-denied');
    }
  }, [session, status, router]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.size > 10000000) {
      setErrorMessage('Video size exceeds the limit of 10MB');
    } else {
      event.preventDefault();
      setSelectedFile(file);
      setErrorMessage('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile || !title || !description) {
      setErrorMessage('Please fill in all the required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      // Get signature from the service
      const { signature, timestamp } = await getCloudinarySignature();

      const amountPaid = calculatePrice(priority, duration);

      // Confirm with the user
      if (!confirm(`Total price: ${amountPaid}. Proceed with upload?`)) {
        setIsSubmitting(false);
        return;
      }

      // Upload file to Cloudinary
      const cloudinaryData = await uploadFileToCloudinary(
        selectedFile,
        signature,
        timestamp
      );

      // Save the ad data to the database
      await saveAdToDatabase({
        title,
        description,
        brand,
        agent,
        link,
        phone,
        duration,
        cta,
        priority,
        amountPaid,
        type,
        secure_url: cloudinaryData.secure_url,
        public_id: cloudinaryData.public_id,
      });

      alert('Ad uploaded successfully!');
      setTitle('');
      setDescription('');
      setLink('');
      setPhone('');
      setBrand('');
      setAgent('');
      setDuration('1 week');
      setPriority('high');
      setType('video');
      setSelectedFile(null);
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      setErrorMessage(error.message);
    }
  };

  return (
    <AdminLayout title={'Create New Ad'}>
      <div className="container mx-auto p-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="type"
            >
              Type
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => {
                setType(e.target.value);
              }}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="video">Video</option>
              <option value="banner">Banner</option>
              <option value="survey">Survey</option>
              <option value="trivia">Trivia</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="title"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="title"
            >
              Brand
            </label>
            <input
              id="brand"
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="title"
            >
              Agent
            </label>
            <input
              id="agent"
              type="text"
              value={agent}
              onChange={(e) => setAgent(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="link"
            >
              Link
            </label>
            <textarea
              id="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="cta"
            >
              CTA Message
            </label>
            <select
              id="cta"
              value={cta}
              onChange={(e) => {
                setCTA(e.target.value);
              }}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="Shop Now">Shop Now</option>
              <option value="Grab Offer">Grab Offer</option>
              <option value="More Details">More Details</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="phone"
            >
              Phone Number
            </label>
            <textarea
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="duration"
            >
              Duration
            </label>
            <select
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="1 week">1 week</option>
              <option value="2 weeks">2 weeks</option>
              <option value="1 month">1 month</option>
            </select>
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="priority"
            >
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
              <option value="free">Free</option>
            </select>
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="file"
            >
              File
            </label>
            <input
              id="file"
              type="file"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          {errorMessage && (
            <p className="text-red-500 text-xs italic text-center">
              {errorMessage}
            </p>
          )}

          <div className="flex items-center justify-center mt-4">
            <button
              type="submit"
              disabled={isSubmitting || !selectedFile || !title || !description}
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                isSubmitting || !selectedFile || !title || !description
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
            >
              {isSubmitting ? <div className="loader"></div> : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default Uploader;
