import db from './db';
import { JackpotTotals } from '../models/Jackpots.js';
import { jackpots } from './jackpotSnapshot.js';

async function initializeJackpots() {
  console.log('Initializing jackpot totals from the database');
  await db.connect();

  // Query the database for the jackpot totals by finding the latest record
  const fetchedJackpots = await JackpotTotals.findOne()
    .sort({ _id: -1 })
    .select('joinersTotal weeklyTotal monthlyTotal annualTotal -_id');

  // Create a new instance of Intl.NumberFormat
  const formatter = new Intl.NumberFormat('en-US');

  // Update the jackpots variable
  jackpots.joinersTotal = formatter.format(fetchedJackpots.joinersTotal * 0.5); // multiply by 0.5 to show 50% of the total since the other half will be distributed to winners network
  jackpots.weeklyTotal = formatter.format(fetchedJackpots.weeklyTotal * 0.5);
  jackpots.monthlyTotal = formatter.format(fetchedJackpots.monthlyTotal * 0.5);
  jackpots.annualTotal = formatter.format(fetchedJackpots.annualTotal * 0.5);

  console.log('Initialized jackpots:', jackpots);
}

export default initializeJackpots;
