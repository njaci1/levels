import db from './db';
import { JackpotTotals } from '../models/Jackpots';
import cron from 'node-cron';

let jackpots = {
  joinersTotal: 44100,
  weeklyTotal: 56000,
  monthlyTotal: 58400,
  annualTotal: 20800,
};

async function fetchJackpotTotalsFromDB() {
  console.log('Fetching jackpot totals from the database');
  await db.connect();

  // Query the database for the jackpot totals by finding the latest record
  const fetchedJackpots = await JackpotTotals.findOne()
    .sort({ _id: -1 })
    .select('joinersTotal weeklyTotal monthlyTotal annualTotal -_id');

  // Create a new instance of Intl.NumberFormat
  const formatter = new Intl.NumberFormat('en-US');

  // Update the jackpots variable
  jackpots = {
    joinersTotal: formatter.format(fetchedJackpots.joinersTotal * 0.7 * 1000),
    weeklyTotal: formatter.format(fetchedJackpots.weeklyTotal * 0.7 * 1000),
    monthlyTotal: formatter.format(fetchedJackpots.monthlyTotal * 0.7 * 1000),
    annualTotal: formatter.format(fetchedJackpots.annualTotal * 0.7 * 1000),
  };
}

// Run fetchJackpotTotalsFromDB immediately when the module is imported
fetchJackpotTotalsFromDB();
// Schedule the fetchJackpotTotalsFromDB function to run every 2 minutes
cron.schedule('*/45 * * * *', fetchJackpotTotalsFromDB);

// Export a function that returns the jackpots object
export function getJackpots() {
  return jackpots;
}
