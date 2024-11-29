import db from './db';
import prizeTotals from '../models/prizeTotals.js';

export default async function fetchJackpotTotalsFromDB() {
  const formatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });

  try {
    await db.connect();

    const fetchedTotals = await prizeTotals
      .find({}, { name: 1, currentAmount: 1, _id: 0 })
      .lean();

    // Map results into the jackpot object with specific keys e.g weekly to 'weeklyTotal'
    const jackpots = fetchedTotals.reduce((acc, doc) => {
      const key = `${doc.name}Total`; // Create keys like weekly to 'weeklyTotal'
      acc[key] = formatter.format(doc.currentAmount * 0.5); // multiply by half since the end user only wins half the amount and the other half is distributed to the other winners
      return acc;
    }, {});

    return jackpots;
  } catch (error) {
    console.error('Error fetching jackpots:', error);
    return {};
  } finally {
    await db.disconnect();
  }
}
