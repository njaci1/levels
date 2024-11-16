import React, { useState } from 'react';
import {
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Box,
  Typography,
} from '@mui/material';
import {
  getCloudinarySignature,
  uploadFileToCloudinary,
  saveAdToDatabase,
  calculatePrice,
} from '../../lib/uploaderService';

const Uploader = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        duration,
        priority,
        amountPaid,
        secure_url: cloudinaryData.secure_url,
        public_id: cloudinaryData.public_id,
      });

      alert('Ad uploaded successfully!');
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      setErrorMessage(error.message);
      console.error(error);
    }
  };

  return (
    <Box sx={{ maxWidth: '600px', margin: '0 auto', mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Ad Uploader
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <Typography variant="subtitle1">Video File:</Typography>
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            disabled={isSubmitting}
          />
          {selectedFile && (
            <Typography variant="body2">
              Selected File: {selectedFile.name}
            </Typography>
          )}
        </FormControl>

        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
          disabled={isSubmitting}
          required
        />

        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={3}
          disabled={isSubmitting}
          required
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Duration</InputLabel>
          <Select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            disabled={isSubmitting}
          >
            <MenuItem value="1 week">1 week</MenuItem>
            <MenuItem value="2 weeks">2 weeks</MenuItem>
            <MenuItem value="1 month">1 month</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Priority</InputLabel>
          <Select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            disabled={isSubmitting}
          >
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="low">Low</MenuItem>
          </Select>
        </FormControl>

        {errorMessage && (
          <Typography variant="body2" color="error" align="center">
            {errorMessage}
          </Typography>
        )}

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button
            type="submit"
            disabled={isSubmitting || !selectedFile || !title || !description}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Upload'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default Uploader;
