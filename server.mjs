import { createServer } from 'http';
import next from 'next';
import cron from 'node-cron';
import initializeJackpots from './lib/initializeJackpots.js';
import { fetchJackpotTotalsFromDB } from './lib/jackpotSnapshot.js';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

async function startServer() {
  try {
    await app.prepare();
    await initializeJackpots();

    // Schedule the function to run every 45 minutes
    cron.schedule('*/45 * * * *', fetchJackpotTotalsFromDB);

    createServer((req, res) => {
      handle(req, res);
    }).listen(3000, (err) => {
      if (err) throw err;
      console.log('> Ready on http://localhost:3000');
    });
  } catch (err) {
    console.error('Failed to initialize jackpots:', err);
    process.exit(1); // Exit the process with an error code
  }
}

startServer();
