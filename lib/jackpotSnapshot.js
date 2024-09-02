import db from './db';
import { JackpotTotals } from '../models/Jackpots';
import cron from 'node-cron';

let jackpots = {
  joinersTotal: 50000,
  weeklyTotal: 75000,
  monthlyTotal: 150000,
  annualTotal: 1000000,
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
    joinersTotal: formatter.format(fetchedJackpots.joinersTotal * 0.5), // multiply by 0.5 to show 50% of the total since the other half will be distributed to winners network
    weeklyTotal: formatter.format(fetchedJackpots.weeklyTotal * 0.5),
    monthlyTotal: formatter.format(fetchedJackpots.monthlyTotal * 0.5),
    annualTotal: formatter.format(fetchedJackpots.annualTotal * 0.5),
  };
}

// Run fetchJackpotTotalsFromDB immediately when the module is imported
fetchJackpotTotalsFromDB();
// Schedule the fetchJackpotTotalsFromDB function to run every 2 minutes
cron.schedule('*/45 * * * *', fetchJackpotTotalsFromDB);

// Export a function that returns the jackpots object
export { jackpots };
