import exp from 'constants';
import db from '../lib/db';
import ads from '../models/AdsCollection';

const path = require('path');
const baseAdsDirectory = path.join(__dirname, 'utils', 'sampleAds');

const sampleAds = [
  {
    title: 'Banner4',
    description: 'Get up to 50% off on summer essentials!',
    type: 'banner',
    priority: 5,
    imageUrl: path.join(baseAdsDirectory, 'banner-4.jpg'),
  },
  {
    title: 'cocacola',
    description: 'Discover our latest collection now!',
    type: 'video',
    priority: 7,
    videoUrl: path.join(baseAdsDirectory, 'cocacola.mp4'),
  },
  {
    title: 'Banner-05',
    description: 'Hurry! Limited time offer. Shop now!',
    type: 'banner',
    priority: 6,
    imageUrl: path.join(baseAdsDirectory, 'banner-05.jpg'),
  },
  {
    title: 'Coffee Ad',
    description: "Don't miss out on our exclusive flash sale!",
    type: 'video',
    priority: 8,
    videoUrl: path.join(baseAdsDirectory, 'coffee.mp4'),
  },
  {
    title: 'Banner-06',
    description: 'Get an extra 10% off with code SPECIAL10',
    type: 'banner',
    priority: 4,
    imageUrl: path.join(baseAdsDirectory, 'banner-06.jpg'),
  },
  {
    title: 'cookie Video Ad',
    description: 'Explore our top products in this exclusive video!',
    type: 'video',
    priority: 7,
    videoUrl: path.join(baseAdsDirectory, 'cookie.mp4'),
  },
];

export default async function sampleDatabase(req, res) {
  db.connect();
  try {
    // Remove existing ads
    await ads.deleteMany({});

    // Insert sample ads
    await ads.insertMany(sampleAds);

    console.log('Sample ads seeded successfully!');
  } catch (error) {
    console.error('Error seeding sample ads:', error);
  }
}
