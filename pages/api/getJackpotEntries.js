import db from '../../lib/db';
import { getSession } from 'next-auth/react';
import moment from 'moment';
import JackpotEntry from '../../models/JackpotEntry';

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await db.connect();

  try {
    const now = moment();
    const dateRanges = {
      daily: {
        start: now.startOf('day').toDate(),
        end: now.endOf('day').toDate(),
      },
      weekly: {
        start: now.startOf('week').toDate(),
        end: now.endOf('week').toDate(),
      },
      monthly: {
        start: now.startOf('month').toDate(),
        end: now.endOf('month').toDate(),
      },
      annual: {
        start: now.startOf('year').toDate(),
        end: now.endOf('year').toDate(),
      },
    };

    const results = {};
    for (const [jackpotType, { start, end }] of Object.entries(dateRanges)) {
      results[`${jackpotType}Entries`] = await JackpotEntry.countDocuments({
        userId: session.user._id,
        jackpotType,
        timestamp: { $gte: start, $lte: end },
      });
    }

    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching jackpot entries:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await db.disconnect();
  }
}
