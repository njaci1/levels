const cloudinary = require('cloudinary').v2;
import multer from 'multer';
import db from '../../lib/db';
import Ad from '../../models/AdsCollection';
import nextConnect from 'next-connect';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// Create Multer upload instance
const upload = multer({ storage });

export default async function handler(req, res) {
  if (req.method === 'POST') {
    upload.single('file')(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!req.file) {
        return res.status(400).json({ message: 'No file attached' });
      } else {
        console.log('file attached');
      }
      try {
        await db.connect();
        const result = await cloudinary.uploader.upload(req.file.path, {
          resource_type: 'video',
        });

        // Create an entry in the database

        const newAd = new Ad({
          title: req.body.title,
          description: req.body.description,
          type: 'video',
          videoUrl: result.secure_url,
          cloudinaryId: result.public_id,
        });
        await newAd.save();
        // await db.disconnect();

        // Return the response
        res.status(200).json({ message: 'Video ad uploaded successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to upload video ad' });
      }
    });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
