import { getToken } from 'next-auth/jwt';
import User from '../../../models/User';
import distributeCommission from '../../../lib/distributeCommission';

export default async function handler(req, res) {
  // // Get session from request
  // const session = await getToken({ req });

  // // If no session found, user is not authenticated
  // if (!session) {
  //   return res.status(401).json({ error: 'Unauthorized' });
  // }

  const transactionAmount = req.body.amount;
  const userId = req.body.userId;

  const result = await distributeCommission(transactionAmount, userId);
  console.log(result);
  res.status(200).json(result);
}
