import cron from 'node-cron';
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

    let jackpots = {
      dailyTotal: '3,000',
      weeklyTotal: '2,000',
      monthlyTotal: '8,000',
      welcomeTotal: '2,000',
      annualTotal: '9,000',
    };
    // Map results into the jackpot object with specific keys e.g weekly to 'weeklyTotal'
    jackpots = fetchedTotals.reduce((acc, doc) => {
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
fetchJackpotTotalsFromDB();
cron.schedule('*/30 * * * *', fetchJackpotTotalsFromDB);
