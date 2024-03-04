import React, { useState } from 'react';

const Uploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedFile) {
      // Perform upload logic here
      console.log('Uploading file:', selectedFile);
    } else {
      setErrorMessage('Please select a video file to upload');
    }
  };

  return (
    <div>
      <h1>Ad Uploader</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="video/*" onChange={handleFileChange} />
        {errorMessage && <p>{errorMessage}</p>}
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default Uploader;
