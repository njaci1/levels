import { JackpotAllocation } from '../models/Jackpots';
import db from './db';

export default async function calculateAndAllocateFunds(
  adId,
  amount,
  isNewAd = true
) {
  // reserve 15% for platform upfront
  amount = amount * 0.85;
  const allocationPercentages = {
    joinersJP: 0.2 * amount,
    weeklyJP: 0.35 * amount,
    monthlyJP: 0.2 * amount,
    annualJP: 0.1 * amount,
    platformShare: 0.15 * amount,
  };

  // Create JackpotAllocation entry if it's a new ad
  if (isNewAd) {
    try {
      await db.connect();
      await JackpotAllocation.create({
        adId: adId,
        ...allocationPercentages,
        isNewAd: isNewAd,
      });
      console.log('JackpotAllocation created successfully');
      return success;
    } catch (error) {
      console.error('Error creating JackpotAllocation:', error);
      throw new Error('Failed to create JackpotAllocation');
    } finally {
      await db.close();
    }
  }

  // Background Job: Update jackpot totals based on timestamp
}
