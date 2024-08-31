import db from '../../../lib/db';
import Notification from '../../../models/Notifications';

export default async function handler(req, res) {
  const {
    method,
    query: { userId },
  } = req;

  await db.connect();

  switch (method) {
    case 'GET':
      try {
        const notifications = await Notification.find({ userId, read: false });
        res.status(200).json({ success: true, data: notifications });
        await db.disconnect();
      } catch (error) {
        res.status(400).json({ success: false });
        await db.disconnect();
      }
      break;
    default:
      res.status(400).json({ success: false });
      await db.disconnect();
      break;
  }
}
