import React, { useState } from 'react';
import calculatePrice from '../lib/priceCalculator';

const Uploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('1 week');
  const [priority, setPriority] = useState('high');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.size > 10000000) {
      setErrorMessage('Video size exceeds the limit of 10MB');
    } else {
      setSelectedFile(file);
      setErrorMessage('');
    }
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedFile && title && description) {
      // Get signature from server
      const signatureResponse = await fetch('/api/admin/cloudinary-sign');
      const { signature, timestamp } = await signatureResponse.json();
      const amountPaid = calculatePrice(priority, duration);

      // Show price confirmation to the advertiser
      if (!confirm(`Total price: ${amountPaid}. Proceed with upload?`)) {
        return; // User cancelled
      }

      const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);
      formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);

      fetch(url, {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.secure_url) {
            // File uploaded successfully

            // Send the data to the server to save it in the database
            fetch('/api/uploadToCloud', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                title,
                description,
                duration,
                priority,
                amountPaid,
                secure_url: data.secure_url,
                public_id: data.public_id,
              }),
            })
              .then((response) => response.json())
              .then((data) => {
                console.log(data);
                if (data.message === 'ad uploaded to db successfully') {
                  console.log('Ad uploaded successfully');
                } else {
                  throw new Error('Failed to upload file');
                }
              })
              .catch((error) => {
                // Handle error
                console.error(error);
              });
          } else {
            throw new Error('Failed to upload file');
          }
        })
        .catch((error) => {
          // Handle error
          console.error(error);
        });
    } else {
      setErrorMessage('Please fill in all the required fields');
    }
  };

  return (
    <div>
      <h1>Ad Uploader</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="file">Video File:</label>
          <input
            type="file"
            id="file"
            accept="video/*"
            onChange={handleFileChange}
          />
        </div>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={handleDescriptionChange}
          />
        </div>

        <div>
          <label htmlFor="duration">Duration:</label>
          <select
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          >
            <option value="1 week">1 week</option>
            <option value="2 weeks">2 weeks</option>
            <option value="1 month">1 month</option>
          </select>
        </div>
        <div>
          <label htmlFor="priority">Priority:</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {errorMessage && <p>{errorMessage}</p>}
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default Uploader;
