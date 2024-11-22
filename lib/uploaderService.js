// lib/uploaderService.js
export const getCloudinarySignature = async () => {
  const response = await fetch('/api/admin/cloudinary-sign');
  if (!response.ok) throw new Error('Failed to fetch Cloudinary signature');
  return response.json();
};

export const uploadFileToCloudinary = async (
  selectedFile,
  signature,
  timestamp
) => {
  const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;

  const formData = new FormData();
  formData.append('file', selectedFile);
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);
  formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  if (!data.secure_url) throw new Error('File upload to Cloudinary failed');
  return data;
};

export const saveAdToDatabase = async (adData) => {
  const response = await fetch('/api/uploadToCloud', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(adData),
  });

  const data = await response.json();

  if (data.message != 'success') {
    throw new Error('Failed to save ad to database');
  }
  return data;
};
