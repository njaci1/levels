const cron = require('node-cron');
const mongoose = require('mongoose');
const { JackpotAllocation, JackpotTotals } = require('./models/Jackpots');
const { time } = require('console');

cron.schedule('0 2 * * *', async () => {
  await mongoose.connect();

  console.log('Running totals cron job');

  try {
    const now = new Date();

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
            { timestamp: { $gte: monthlyStart } }, // Platform share
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

    // Upsert into JackpotTotals
    await JackpotTotals.updateOne(
      {}, // Match first document or create if needed
      { $set: result[0] || {} },
      { upsert: true }
    );
  } catch (error) {
    console.error('Error in jackpot total update job:', error);
  } finally {
    await mongoose.disconnect();
  }
});

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
