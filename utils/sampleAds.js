import exp from 'constants';
import db from '../lib/db';
import ads from '../models/AdsCollection';

const path = require('path');
const baseAdsDirectory = path.join(process.cwd(), 'utils');

const sampleAds = [
  {
    title: 'cocacola',
    description: 'Discover our latest collection now!',
    type: 'video',
    priority: 7,
    videoUrl: '/sampleAds/cocacola.mp4',
  },
  {
    title: 'Coffee Ad',
    description: "Don't miss out on our exclusive flash sale!",
    type: 'video',
    priority: 8,
    videoUrl: '/sampleAds/coffee.mp4',
  },
  {
    title: 'cookie Video Ad',
    description: 'Explore our top products in this exclusive video!',
    type: 'video',
    priority: 7,
    videoUrl: '/sampleAds/cookie.mp4',
  },
  {
    title: 'doritos Video Ad',
    description: 'Explore our top products in this exclusive video!',
    type: 'video',
    priority: 7,
    videoUrl: '/sampleAds/doritos.mp4',
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
