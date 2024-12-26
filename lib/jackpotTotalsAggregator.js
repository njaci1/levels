import cron from 'node-cron';
import db from './db';
import { JackpotAllocation, JackpotTotals } from '../models/Jackpots';

export default async function calculateTotals() {
  await db.connect();

  try {
    const now = new Date();
    console.log(`${now} Calculating jackpot totals `);
    // Weekly Calculation
    const weeklyStart = calculateStartOfWeek(now);

    // Monthly Calculation
    const monthlyStart = calculateStartOfMonth(now);

    // Annual Calculation
    const annualStart = calculateStartOfYear(now);

    const aggregationPipeline = [
      {
        $match: {
          $or: [
            { timestamp: { $gte: weeklyStart } }, // Weekly
            { timestamp: { $gte: monthlyStart } }, // Monthly
            { timestamp: { $gte: annualStart } }, // Annual
          ],
        },
      },
      {
        $group: {
          _id: null, // Single document for all matching entries
          joinersTotal: { $sum: '$joinersJP' },
          weeklyTotal: { $sum: '$weeklyJP' },
          monthlyTotal: { $sum: '$monthlyJP' },
          annualTotal: { $sum: '$annualJP' },
          platformShare: { $sum: '$platformShare' },
        },
      },
    ];

    const result = await JackpotAllocation.aggregate(aggregationPipeline);

    // Create a new JackpotTotals record
    await JackpotTotals.create(result[0] || {});
    return 'Jackpot totals updated';
  } catch (error) {
    console.error('Error in jackpot total update job:', error);
  } finally {
    await db.disconnect();
  }
}

// Helper functions to calculate start dates
function calculateStartOfWeek(date) {
  const dayOfWeek = date.getDay() || 7; // 7 for Sunday
  const diff = date.getDate() - dayOfWeek + 1; // 1 for Monday
  return new Date(date.setDate(diff));
}

function calculateStartOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function calculateStartOfYear(date) {
  return new Date(date.getFullYear(), 0, 1);
}
// Run the function immediately
// calculateTotals();
// use setInterval to run the job every 2 minutes
// setInterval(calculateTotals, 120000);
// Run the function every day at 2:00 AM
// cron.schedule('*/30 * * * *', calculateTotals);
