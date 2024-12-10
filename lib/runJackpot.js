import JackpotEntry from '../models/JackpotEntry';
import JackpotBackup from '../models/JackpotBackupEntry';
import cron from 'node-cron';
import prizeTotals from '../models/prizeTotals';
import Winner from '../models/Winners';
import distributeCommission from './distributeCommission';
import Notification from '../models/Notifications';
import User from '../models/User';
import db from './db';
import payoutsTotal from '../models/payoutsTotal';

// Function to select a random winner from an array of entries
const selectRandomWinner = (entries) => {
  const randomIndex = Math.floor(Math.random() * entries.length);
  return entries[randomIndex];
};

// Function to get entries and amount based on jackpot type
const getEntriesAndAmount = async (jackpotType, currentDate) => {
  const timeRanges = {
    daily: { $gte: new Date(currentDate.setDate(currentDate.getDate() - 1)) },
    weekly: { $gte: new Date(currentDate.setDate(currentDate.getDate() - 7)) },
    monthly: {
      $gte: new Date(currentDate.setMonth(currentDate.getMonth() - 1)),
    },
    annual: {
      $gte: new Date(currentDate.setFullYear(currentDate.getFullYear() - 1)),
    },
    welcome: { $gte: new Date(currentDate.setDate(currentDate.getDate() - 7)) },
  };

  const entries = await JackpotEntry.find({
    jackpotType: jackpotType,
    timestamp: timeRanges[jackpotType],
  });

  const jackpotTotal = await prizeTotals.findOne({ name: jackpotType });
  const amount = Math.floor(jackpotTotal.currentAmount * 0.5);

  const timeRange = timeRanges[jackpotType];

  return { entries, amount, timeRange };
};

const backupAndDeleteEntries = async (jackpotType, timeRange, entries) => {
  if (entries.length > 0) {
    // Group entries by userId for backup
    const backupData = entries.reduce((acc, entry) => {
      const userBackup = acc.find((item) => item.userId.equals(entry.userId));
      if (userBackup) {
        userBackup.entries.push({ _id: entry._id, timestamp: entry.timestamp });
      } else {
        acc.push({
          userId: entry.userId,
          jackpotType,
          entries: [{ _id: entry._id, timestamp: entry.timestamp }],
        });
      }
      return acc;
    }, []);

    // Save to the JackpotBackup collection
    await JackpotBackup.insertMany(
      backupData.map((data) => ({ ...data, backupDate: new Date() }))
    );

    // Delete backed-up entries
    await JackpotEntry.deleteMany({
      jackpotType: jackpotType,
      timestamp: timeRange,
    });

    console.log(
      `Backed up and deleted ${entries.length} entries for ${jackpotType} jackpot.`
    );
  } else {
    console.log(`No entries to backup for ${jackpotType} jackpot.`);
  }
};

// Function to select winners for a given jackpot type
export default async function selectWinners(jackpotType) {
  const currentDate = new Date();
  console.log(
    `${currentDate} Starting to select winners for ${jackpotType} jackpot`
  );

  try {
    await db.connect();

    const { entries, amount, timeRange } = await getEntriesAndAmount(
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
      message: `Woow!! You are the ${jackpotType} Prize winner of Ksh.${amount}!`,
      win: 'jackpot',
    });
    await notification.save();

    // Update Total Payouts
    await payoutsTotal.updateOne(
      {},
      { $inc: { totalPayouts: amount * 2 } }, // Increment total payouts by 2x the amount won since the amount at this point is 50% of the total amount
      { upsert: true }
    );

    // Backup and Delete all entries for the jackpot type

    backupAndDeleteEntries(jackpotType, timeRange, entries);

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
