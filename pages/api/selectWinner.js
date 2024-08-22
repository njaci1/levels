import runJackpot from '../../lib/runJackpot';

export default async function handler(req, res) {
  const winner = runJackpot('monthly');

  res.status(200).json(winner);
}
