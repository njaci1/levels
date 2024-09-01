import db from '../../lib/db';
import { getSession } from 'next-auth/react';
import moment from 'moment';
import {
  WeeklyJackpotEntry,
  MonthlyJackpotEntry,
  AnnualJackpotEntry,
} from '../../models/Jackpots';

export default async function handler(req, res) {
  // Get session from request
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  await db.connect();

  // Set Thursday as the start of the week
  moment.updateLocale('en', {
    week: {
      dow: 4,
    },
  });

  // Get the start and end of the current week
  const startOfWeek = moment().startOf('week').toDate();
  const endOfWeek = moment().endOf('week').toDate();

  // Get the start and end of the current month
  const startOfMonth = moment().startOf('month').toDate();
  const endOfMonth = moment().endOf('month').toDate();

  // Get the start and end of the current year
  const startOfYear = moment().startOf('year').toDate();
  const endOfYear = moment().endOf('year').toDate();

  // fetch and count jackpot entries per jackpot

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

  res.status(200).json({ weeklyEntries, monthlyEntries, annualEntries });
}
