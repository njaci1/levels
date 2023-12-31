import createTransaction from '../../../lib/createTransaction';

export default async function handler(req, res) {
  // // Get session from request
  // const session = await getToken({ req });

  // // If no session found, user is not authenticated
  // if (!session) {
  //   return res.status(401).json({ error: 'Unauthorized' });
  // }

  const transactionAmount = req.body.amount;
  const userId = req.body.userId;
  const transType = req.body.transType;
  const phoneNumber = req.body.phoneNumber;

  try {
    const result = await createTransaction(
      transactionAmount,
      userId,
      transType,
      phoneNumber
    );
    if (result) {
      console.log(result);
      res.status(200).json(result);
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error creating transaction' });
  }
}
