import React, { useState } from 'react';

const Uploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedFile && title && description) {
      // call uploadToCloud API
      fetch('api/uploadToCloud', {
        method: 'POST',
        body: JSON.stringify({
          file: selectedFile,
          title: title,
          description: description,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (response.ok) {
            console.log(response);
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
        {errorMessage && <p>{errorMessage}</p>}
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default Uploader;
