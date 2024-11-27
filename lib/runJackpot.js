const {
  WeeklyJackpotEntry,
  MonthlyJackpotEntry,
  AnnualJackpotEntry,
  WelcomeJackpotEntry,
  JackpotTotals,
} = require('../models/Jackpots');
import Winner from '../models/Winners';
import distributeCommission from './distributeCommission';
import Notification from '../models/Notifications';
const User = require('../models/User');
import db from './db';

// Function to select a random winner from an array of entries
const selectRandomWinner = (entries) => {
  const randomIndex = Math.floor(Math.random() * entries.length);
  return entries[randomIndex];
};

// Function to get entries and amount based on jackpot type
const getEntriesAndAmount = async (jackpotType, currentDate) => {
  let entries;
  let amount;

  switch (jackpotType) {
    case 'weekly':
      entries = await WeeklyJackpotEntry.find({
        timestamp: {
          $gte: new Date(currentDate.setDate(currentDate.getDate() - 7)), // Entries from the last 7 days
        },
      });
      const weeklyResult = await JackpotTotals.findOne()
        .sort({ _id: -1 })
        .select('weeklyTotal -_id');
      amount = weeklyResult.weeklyTotal * 0.5; // 50% of the total amount is distributed to the winners network
      break;
    case 'monthly':
      entries = await MonthlyJackpotEntry.find({
        timestamp: {
          $gte: new Date(currentDate.setMonth(currentDate.getMonth() - 1)), // Entries from the last month
        },
      });
      const monthlyResult = await JackpotTotals.findOne()
        .sort({ _id: -1 })
        .select('monthlyTotal -_id');
      amount = monthlyResult.monthlyTotal * 0.5;
      break;
    case 'annual':
      entries = await AnnualJackpotEntry.find({
        timestamp: {
          $gte: new Date(
            currentDate.setFullYear(currentDate.getFullYear() - 1)
          ), // Entries from the last year
        },
      });
      const annualResult = await JackpotTotals.findOne()
        .sort({ _id: -1 })
        .select('annualTotal -_id');
      amount = annualResult.annualTotal * 0.5;
      break;
    case 'welcome':
      entries = await WelcomeJackpotEntry.find({
        timestamp: {
          $gte: new Date(currentDate.setDate(currentDate.getDate() - 7)), // Entries from the last 7 days for new users
        },
      });
      const welcomeResult = await JackpotTotals.findOne()
        .sort({ _id: -1 })
        .select('joinersTotal -_id');
      amount = welcomeResult.joinersTotal * 0.5;
      break;
    default:
      throw new Error('Invalid jackpot type');
  }

  return { entries, amount };
};

// Function to select winners for a given jackpot type
export default async function selectWinners(jackpotType) {
  console.log(`Starting to select winners for ${jackpotType} jackpot`);

  const currentDate = new Date();

  try {
    await db.connect();

    const { entries, amount } = await getEntriesAndAmount(
      jackpotType,
      currentDate
    );

    if (!entries || entries.length === 0) {
      console.log('No entries found for the specified jackpot period.');
      await db.disconnect();
      return;
    }

    // Select a random winner from the entries
    const winnerEntry = selectRandomWinner(entries);

    // Record the winner in the Winners collection
    const winner = new Winner({
      userId: winnerEntry.userId,
      jackpotType,
      amount,
      timestamp: new Date(),
    });

    await winner.save(); // Write the winner to the database
    console.log(`Winner selected for ${jackpotType} jackpot:`, winner);

    // Increment the winner's balance by the amount won
    const winnerBalance = await User.findById(winner.userId);
    winnerBalance.balance += amount;
    winnerBalance.level0Earnings += amount;
    await winnerBalance.save();

    // Write a notification for the winner in the db
    const notification = new Notification({
      userId: winner.userId,
      message: `Congratulations!! You are the ${jackpotType} jackpot winner of KSH ${amount}!`,
      win: 'jackpot',
    });
    await notification.save();

    await db.disconnect();

    // Call distributeCommission function to distribute the winnings to the winner's network
    try {
      await distributeCommission(amount, winner.userId);
    } catch (error) {
      console.error('An error occurred while distributing commission:', error);
    }

    console.log(`Finished selecting winners for ${jackpotType} jackpot`);
  } catch (error) {
    console.error('An error occurred while selecting winners:', error);
    await db.disconnect();
  }
}

// Example usage
// selectWinners('weekly').catch((err) => console.error(err));
// selectWinners('monthly').catch((err) => console.error(err));
// selectWinners('annual').catch((err) => console.error(err));
// selectWinners('welcome').catch((err) => console.error(err));
