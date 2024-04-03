import db from '../../lib/db';
import { getSession } from 'next-auth/react';
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

  // fetch and count jackpot entries per jackpot

  const weeklyEntries = await WeeklyJackpotEntry.countDocuments({
    userId: session.user._id,
  });
  const monthlyEntries = await MonthlyJackpotEntry.countDocuments({
    userId: session.user._id,
  });
  const annualEntries = await AnnualJackpotEntry.countDocuments({
    userId: session.user._id,
  });

  res.status(200).json({ weeklyEntries, monthlyEntries, annualEntries });
}
