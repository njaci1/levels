const {
  WeeklyJackpotEntry,
  MonthlyJackpotEntry,
  AnnualJackpotEntry,
  WelcomeJackpotEntry,
  Winner,
  JackpotTotals,
} = require('../models/Jackpots');
import distributeCommission from './distributeCommission';
import Notification from '../models/Notifications';
const user = require('../models/User');
import db from './db';

// Function to select a random winner from an array of entries
const selectRandomWinner = (entries) => {
  const randomIndex = Math.floor(Math.random() * entries.length);
  return entries[randomIndex];
};

// Function to select winners for a given jackpot type
export default async function selectWinners(jackpotType) {
  let entries;
  let amount;

  const currentDate = new Date();

  switch (jackpotType) {
    case 'weekly':
      await db.connect();
      entries = await WeeklyJackpotEntry.find({
        timestamp: {
          $gte: new Date(currentDate.setDate(currentDate.getDate() - 7)), // Entries from the last 7 days
        },
      });
      const result = await JackpotTotals.findOne()
        .sort({ _id: -1 })
        .select('weeklyTotal -_id');
      amount = result.weeklyTotal * 0.5; // 50% of the total amount is distributed to the winners network
      await db.disconnect();
      break;
    case 'monthly':
      await db.connect();
      entries = await MonthlyJackpotEntry.find({
        timestamp: {
          $gte: new Date(currentDate.setMonth(currentDate.getMonth() - 1)), // Entries from the last month
        },
      });
      const result1 = await JackpotTotals.findOne()
        .sort({ _id: -1 })
        .select('monthlyTotal -_id');
      amount = result1.monthlyTotal * 0.5;
      await db.disconnect();
      break;
    case 'annual':
      await db.connect();
      entries = await AnnualJackpotEntry.find({
        timestamp: {
          $gte: new Date(
            currentDate.setFullYear(currentDate.getFullYear() - 1)
          ), // Entries from the last year
        },
      });
      const result2 = await JackpotTotals.findOne()
        .sort({ _id: -1 })
        .select('annualTotal -_id');
      amount = result2.annualTotal * 0.5;
      await db.disconnect();
      break;
    case 'welcome':
      await db.connect();
      entries = await WelcomeJackpotEntry.find({
        timestamp: {
          $gte: new Date(currentDate.setDate(currentDate.getDate() - 7)), // Entries from the last 7 days for new users
        },
      });
      const result3 = await JackpotTotals.findOne()
        .sort({ _id: -1 })
        .select('joinersTotal -_id');
      amount = result3.joinersTotal * 0.5;
      await db.disconnect();
      break;
    default:
      throw new Error('Invalid jackpot type');
  }

  if (entries.length === 0) {
    console.log('No entries found for the specified jackpot period.');
    return;
  }

  // Select a random winner from the entries
  const winnerEntry = selectRandomWinner(entries);

  // Record the winner in the Winners collection
  await db.connect();
  const winner = new Winner({
    userId: winnerEntry.userId,
    jackpotType,
    amount,
    timestamp: new Date(),
  });

  await winner.save(); // write the winner to the database
  console.log(`Winner selected for ${jackpotType} jackpot:`, winner);

  // increment the winner's balance by the amount won
  const winnerBalance = await user.findById(winner.userId);
  winnerBalance.balance += amount;
  winnerBalance.level0Earnings += amount;
  await winnerBalance.save();

  // write a notification for the winner in the db

  const notification = new Notification({
    userId: winner.userId,
    message: `Congratulation!! You are the ${jackpotType} jackpot winner of KSH ${amount}!`,
    win: 'jackpot',
  });
  // Save the Notification to the database
  await notification.save();

  await db.disconnect();

  // call distributeCommission function to distribute the winnings to the winners network
  try {
    await distributeCommission(amount, winner.userId);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// Example usage
// selectWinners('weekly').catch((err) => console.error(err));
// selectWinners('monthly').catch((err) => console.error(err));
// selectWinners('annual').catch((err) => console.error(err));
// selectWinners('welcome').catch((err) => console.error(err));
