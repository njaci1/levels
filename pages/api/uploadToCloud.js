import db from '../../lib/db';
import Ad from '../../models/AdsCollection';
import axios from 'axios';
import { v2 as cloudinary } from 'cloudinary';
import { useForm, useFieldArray } from 'react-hook-form';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`;

      const timestamp = Math.round(new Date().getTime() / 1000);
      const signature = cloudinary.utils.api_sign_request(
        { timestamp: timestamp },
        process.env.CLOUDINARY_SECRET
      );

      const file = req.file;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
      const { data } = await axios.post(url, formData);

      // Create an entry in the database
      await db.connect();
      const newAd = new Ad({
        title: req.body.title,
        description: req.body.description,
        type: 'video',
        videoUrl: data.secure_url,
        cloudinaryId: data.public_id,
      });
      await newAd.save();
      // await db.disconnect();

      // Return the response
      res.status(200).json({ message: 'Video ad uploaded successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to upload video ad' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
