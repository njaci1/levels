import { getToken } from 'next-auth/jwt';
import User from '../../../models/User';
import distributeCommission from '../../../lib/distributeCommission';

export default async function handler(req, res) {
  try {
    // Get session from request
    const session = await getToken({ req });

    // If no session found, user is not authenticated
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { amount: transactionAmount, userId } = req.body;

    // Validate input
    if (!transactionAmount || !userId) {
      return res
        .status(400)
        .json({ error: 'Transaction amount and user ID are required' });
    }

    const result = await distributeCommission(transactionAmount, userId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error distributing commission:', error);
    res.status(500).json({ error: 'Server Error' });
  }
}
