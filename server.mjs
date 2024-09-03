import { createServer } from 'http';
import next from 'next';
import { schedule } from 'node-cron';
import initializeJackpots from './lib/initializeJackpots';
import { fetchJackpotTotalsFromDB } from './lib/jackpotSnapshot';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Call the initialization script before starting the server
  initializeJackpots()
    .then(() => {
      // Schedule the function to run every 45 minutes
      schedule('*/45 * * * *', fetchJackpotTotalsFromDB);

      createServer((req, res) => {
        handle(req, res);
      }).listen(3000, (err) => {
        if (err) throw err;
        console.log('> Ready on http://localhost:3000');
      });
    })
    .catch((err) => {
      console.error('Failed to initialize jackpots:', err);
      process.exit(1); // Exit the process with an error code
    });
});
