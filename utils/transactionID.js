export default function generateTransactionId(length = 8) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let transactionId = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    transactionId += characters[randomIndex];
  }
  return transactionId;
}
