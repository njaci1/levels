import { JackpotAllocation } from '../models/Jackpots';
import jackpotTotalsAggregator from './jackpotTotalsAggregator';
import db from './db';

export default async function calculateAndAllocateFunds(
  adId,
  amount,
  isNewAd = true
) {
  // reserve 15% for platform upfront
  amount = amount * 0.85;
  const allocationPercentages = {
    joinersJP: Math.floor(0.2 * amount),
    weeklyJP: Math.floor(0.35 * amount),
    monthlyJP: Math.floor(0.2 * amount),
    annualJP: Math.floor(0.1 * amount),
    platformShare: Math.floor(0.15 * amount),
  };
  jackpotTotalsAggregator();
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
      return 'success';
    } catch (error) {
      console.error('Error creating JackpotAllocation:', error);
      throw new Error('Failed to create JackpotAllocation');
    } finally {
      await db.disconnect();
    }
  }

  // Background Job: Update jackpot totals based on timestamp
}
