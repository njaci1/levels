import db from '../../lib/db';
import { getSession } from 'next-auth/react';
import moment from 'moment';
import {
  WeeklyJackpotEntry,
  MonthlyJackpotEntry,
  AnnualJackpotEntry,
  DailyJackpotEntry,
} from '../../models/Jackpots';

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await db.connect();

  try {
    moment.updateLocale('en', { week: { dow: 4 } });

    const startOfDay = moment().startOf('day').toDate(); // Beginning of today
    const endOfDay = moment().endOf('day').toDate(); // End of today

    const startOfWeek = moment().startOf('week').toDate();
    const endOfWeek = moment().endOf('week').toDate();

    const startOfMonth = moment().startOf('month').toDate();
    const endOfMonth = moment().endOf('month').toDate();

    const startOfYear = moment().startOf('year').toDate();
    const endOfYear = moment().endOf('year').toDate();

    const dailyEntries = await DailyJackpotEntry.countDocuments({
      userId: session.user._id, // Replace with the correct user ID
      timestamp: { $gte: startOfDay, $lte: endOfDay },
    });

    const weeklyEntries = await WeeklyJackpotEntry.countDocuments({
      userId: session.user._id,
      timestamp: { $gte: startOfWeek, $lte: endOfWeek },
    });

    const monthlyEntries = await MonthlyJackpotEntry.countDocuments({
      userId: session.user._id,
      timestamp: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const annualEntries = await AnnualJackpotEntry.countDocuments({
      userId: session.user._id,
      timestamp: { $gte: startOfYear, $lte: endOfYear },
    });

    res
      .status(200)
      .json({ dailyEntries, weeklyEntries, monthlyEntries, annualEntries });
  } catch (error) {
    console.error('Error fetching jackpot entries:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await db.disconnect();
  }
}
