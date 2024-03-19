import { JackpotAllocation } from '../models/Jackpots';

export default async function calculateAndAllocateFunds(
  adId,
  amount,
  isNewAd = true
) {
  const allocationPercentages = {
    joinersJP: 0.2 * amount,
    weeklyJP: 0.25 * amount,
    monthlyJP: 0.3 * amount,
    annualJP: 0.1 * amount,
    platformShare: 0.15 * amount,
  };

  // Create JackpotAllocation entry if it's a new ad
  if (isNewAd) {
    await JackpotAllocation.create({
      adId: adId,
      ...allocationPercentages,
      isNewAd: isNewAd,
    });
  }

  // Background Job: Update jackpot totals based on timestamp
}
