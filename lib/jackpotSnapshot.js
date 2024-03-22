import db from './db';
import { JackpotTotals } from '../models/Jackpots';
import cron from 'node-cron';

let jackpots = {};

async function fetchJackpotTotalsFromDB() {
  console.log('Fetching jackpot totals from the database');
  await db.connect();

  // Query the database for the jackpot totals by finding the latest record
  const fetchedJackpots = await JackpotTotals.findOne()
    .sort({ _id: -1 })
    .select('joinersTotal weeklyTotal monthlyTotal annualTotal -_id');

  // Update the jackpots variable
  jackpots = fetchedJackpots;
}

// Run fetchJackpotTotalsFromDB immediately when the module is imported
fetchJackpotTotalsFromDB();
// Schedule the fetchJackpotTotalsFromDB function to run every 2 minutes
cron.schedule('*/45 * * * *', fetchJackpotTotalsFromDB);

// Export a function that returns the jackpots object
export function getJackpots() {
  return jackpots;
}
