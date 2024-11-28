import db from './db';
import revenueTotal from '../models/revenueTotal';
import prizeTotals from '../models/prizeTotals';

export default async function calculateAndAllocateFunds(adRevenue) {
  const operationalShare = adRevenue * 0.15;
  const jackpotShare = adRevenue * 0.85;

  const allocations = {
    operational: operationalShare,
    daily: jackpotShare * 0.2,
    weekly: jackpotShare * 0.15,
    monthly: jackpotShare * 0.3,
    joiners: jackpotShare * 0.1,
    platform: jackpotShare * 0.15,
    annual: jackpotShare * 0.1,
  };

  try {
    await db.connect();

    // Update Total Revenue
    await revenueTotal.updateOne(
      {},
      { $inc: { totalRevenue: adRevenue } },
      { upsert: true } // Ensure document exists
    );

    // Update Jackpot Categories
    for (const [category, amount] of Object.entries(allocations)) {
      await prizeTotals.updateOne(
        { name: category },
        { $inc: { currentAmount: amount } },
        { upsert: true } // Create document if it doesn't exist
      );
    }

    console.log('Revenue allocated successfully');
  } catch (error) {
    console.error('An error occurred while allocating revenue:', error);
  } finally {
    await db.disconnect();
  }
}
