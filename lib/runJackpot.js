const {
  WeeklyJackpotEntry,
  MonthlyJackpotEntry,
  AnnualJackpotEntry,
  WelcomeJackpotEntry,
  DailyJackpotEntry,
} = require('../models/Jackpots');
import cron from 'node-cron';
import prizeTotals from '../models/prizeTotals';
import Winner from '../models/Winners';
import distributeCommission from './distributeCommission';
import Notification from '../models/Notifications';
const User = require('../models/User');
import db from './db';
import payoutsTotal from '../models/payoutsTotal';

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
    case 'daily':
      entries = await DailyJackpotEntry.find({
        timestamp: {
          $gte: new Date(currentDate.setDate(currentDate.getDate() - 1)), // Entries from the last 1 day
        },
      });
      const dailyTotal = await prizeTotals.findOne({ name: 'daily' });
      amount = dailyTotal.currentAmount * 0.5; // 50% of the total amount is distributed to the winners network

      break;
    case 'weekly':
      entries = await WeeklyJackpotEntry.find({
        timestamp: {
          $gte: new Date(currentDate.setDate(currentDate.getDate() - 7)), // Entries from the last 7 days
        },
      });
      const weeklyTotal = await prizeTotals.findOne({ name: 'weekly' });
      amount = weeklyTotal.currentAmount * 0.5; // 50% of the total amount is distributed to the winners network

      break;
    case 'monthly':
      entries = await MonthlyJackpotEntry.find({
        timestamp: {
          $gte: new Date(currentDate.setMonth(currentDate.getMonth() - 1)), // Entries from the last month
        },
      });
      const monthlyTotal = await prizeTotals.findOne({ name: 'monthly' });
      amount = monthlyTotal.currentAmount * 0.5;
      break;
    case 'annual':
      entries = await AnnualJackpotEntry.find({
        timestamp: {
          $gte: new Date(
            currentDate.setFullYear(currentDate.getFullYear() - 1)
          ), // Entries from the last year
        },
      });
      const annualTotal = await prizeTotals.findOne({ name: 'annual' });
      amount = annualTotal.currentAmount * 0.5;
      break;
    case 'welcome':
      entries = await WelcomeJackpotEntry.find({
        timestamp: {
          $gte: new Date(currentDate.setDate(currentDate.getDate() - 7)), // Entries from the last 7 days for new users
        },
      });
      const welcomeTotal = await prizeTotals.findOne({ name: 'welcome' });
      amount = welcomeTotal.currentAmount * 0.5;
      break;
    default:
      throw new Error('Invalid jackpot type');
  }
  amount = Math.floor(amount);
  return { entries, amount };
};

// Function to select winners for a given jackpot type
export default async function selectWinners(jackpotType) {
  const currentDate = new Date();
  console.log(
    `${currentDate} Starting to select winners for ${jackpotType} jackpot`
  );

  try {
    await db.connect();

    const { entries, amount } = await getEntriesAndAmount(
      jackpotType,
      currentDate
    );

    if (!entries || entries.length === 0) {
      console.log(
        `${currentDate} No entries found for the specified jackpot period.`
      );

      return null;
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
    console.log(`${currentDate} Winner selected for ${jackpotType} jackpot:`);

    // Increment the winner's balance by the amount won
    const winnerBalance = await User.findById(winner.userId);
    Math.floor((winnerBalance.balance += amount));
    Math.floor((winnerBalance.level0Earnings += amount));
    await winnerBalance.save();

    // Write a notification for the winner in the db
    const notification = new Notification({
      userId: winner.userId,
      message: `Congratulations!! You are the ${jackpotType} jackpot winner of Ksh.${amount}!`,
      win: 'jackpot',
    });
    await notification.save();

    // Update Total Payouts
    await payoutsTotal.updateOne(
      {},
      { $inc: { totalPayouts: amount * 2 } }, // Increment total payouts by 2x the amount won since the amount at this point is 50% of the total amount
      { upsert: true }
    );

    // Remove all entries for the jackpot type

    // subtract the amount won from the total prize for that jackpot

    await prizeTotals.updateOne(
      { name: jackpotType },
      { $inc: { currentAmount: -amount } },
      { upsert: true } // Create document if it doesn't exist
    );

    // Call distributeCommission function to distribute the winnings to the winner's network
    try {
      await distributeCommission(amount, winner.userId);
    } catch (error) {
      console.error('An error occurred while distributing commission:', error);
    }

    console.log(
      `${currentDate} Finished selecting winners for ${jackpotType} jackpot`
    );
    return winner;
  } catch (error) {
    console.error(
      `${currentDate} An error occurred while selecting winners:`,
      error
    );
  } finally {
    await db.disconnect();
  }
}

// Schedule cron jobs

cron.schedule('0 2 * * *', () => {
  selectWinners('daily').catch((err) => console.error(err));
});

cron.schedule('30 10 * * 5', () => {
  selectWinners('weekly').catch((err) => console.error(err));
});

cron.schedule('30 12 * * 5', () => {
  selectWinners('welcome').catch((err) => console.error(err));
});

cron.schedule('0 6 1 * *', () => {
  selectWinners('monthly').catch((err) => console.error(err));
});

cron.schedule('0 12 12 12 *', () => {
  selectWinners('annual').catch((err) => console.error(err));
});
