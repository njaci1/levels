import createTransaction from '../../../lib/createTransaction';

export default async function handler(req, res) {
  const {
    amount: transactionAmount,
    userId,
    transType,
    phoneNumber,
  } = req.body;

  // Validate input
  if (!transactionAmount || !userId || !transType || !phoneNumber) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await createTransaction(
      transactionAmount,
      userId,
      transType,
      phoneNumber
    );
    if (result) {
      console.log(result);
      return res.status(200).json(result);
    }
    res.status(400).json({ error: 'Transaction creation failed' });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Server Error' });
  }
}
