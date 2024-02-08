import exp from 'constants';
import db from '../lib/db';
import ads from '../models/AdsCollection';

const sampleAds = [
  {
    title: 'Summer Sale Banner',
    description: 'Get up to 50% off on summer essentials!',
    type: 'banner',
    priority: 5,
    imageUrl: 'https://example.com/summer-sale-banner.jpg',
  },
  {
    title: 'New Arrivals Video Ad',
    description: 'Discover our latest collection now!',
    type: 'video',
    priority: 7,
    videoUrl: 'https://example.com/new-arrivals-video.mp4',
  },
  {
    title: 'Limited Time Offer Banner',
    description: 'Hurry! Limited time offer. Shop now!',
    type: 'banner',
    priority: 6,
    imageUrl: 'https://example.com/limited-time-offer-banner.jpg',
  },
  {
    title: 'Flash Sale Video Ad',
    description: "Don't miss out on our exclusive flash sale!",
    type: 'video',
    priority: 8,
    videoUrl: 'https://example.com/flash-sale-video.mp4',
  },
  {
    title: 'Special Discount Banner',
    description: 'Get an extra 10% off with code SPECIAL10',
    type: 'banner',
    priority: 4,
    imageUrl: 'https://example.com/special-discount-banner.jpg',
  },
  {
    title: 'Product Showcase Video Ad',
    description: 'Explore our top products in this exclusive video!',
    type: 'video',
    priority: 7,
    videoUrl: 'https://example.com/product-showcase-video.mp4',
  },
  {
    title: 'Winter Collection Banner',
    description: 'Stay cozy with our winter collection!',
    type: 'banner',
    priority: 5,
    imageUrl: 'https://example.com/winter-collection-banner.jpg',
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
