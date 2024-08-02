const {
  WeeklyJackpotEntry,
  MonthlyJackpotEntry,
  AnnualJackpotEntry,
  WelcomeJackpotEntry,
  Winner,
  JackpotTotals,
} = require('../models/Jackpots');

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
      entries = await WeeklyJackpotEntry.find({
        timestamp: {
          $gte: new Date(currentDate.setDate(currentDate.getDate() - 7)), // Entries from the last 7 days
        },
      });
      const result = await JackpotTotals.findOne()
        .sort({ _id: -1 })
        .select('weeklyTotal -_id');
      amount = result.weeklyTotal;
      break;
    case 'monthly':
      entries = await MonthlyJackpotEntry.find({
        timestamp: {
          $gte: new Date(currentDate.setMonth(currentDate.getMonth() - 1)), // Entries from the last month
        },
      });
      const result1 = await JackpotTotals.findOne()
        .sort({ _id: -1 })
        .select('monthlyTotal -_id');
      amount = result1.monthlyTotal;
      break;
    case 'annual':
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
      amount = result2.annualTotal;
      break;
    case 'welcome':
      entries = await WelcomeJackpotEntry.find({
        timestamp: {
          $gte: new Date(currentDate.setDate(currentDate.getDate() - 7)), // Entries from the last 7 days for new users
        },
      });
      const result3 = await JackpotTotals.findOne()
        .sort({ _id: -1 })
        .select('joinersTotal -_id');
      amount = result3.joinersTotal;
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
  const winner = new Winner({
    userId: winnerEntry.userId,
    jackpotType,
    amount,
    timestamp: new Date(),
  });

  await winner.save();
  console.log(`Winner selected for ${jackpotType} jackpot:`, winner);
}

// Example usage
// selectWinners('weekly').catch((err) => console.error(err));
// selectWinners('monthly').catch((err) => console.error(err));
// selectWinners('annual').catch((err) => console.error(err));
// selectWinners('welcome').catch((err) => console.error(err));
