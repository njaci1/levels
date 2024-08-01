import runJackpot from '../../lib/runJackpot';

export default async function handler(req, res) {
  const winner = runJackpot(weekly);

  res.status(200).json(winner);
}
