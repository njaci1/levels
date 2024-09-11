import db from '../../../lib/db';
import Notification from '../../../models/Notifications';

export default async function handler(req, res) {
  const {
    method,
    query: { userId },
  } = req;

  await db.connect();

  try {
    switch (method) {
      case 'GET':
        const notifications = await Notification.find({ userId, read: false });
        res.status(200).json({ success: true, data: notifications });
        break;
      default:
        res.status(405).json({ success: false, message: 'Method Not Allowed' });
        break;
    }
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  } finally {
    await db.disconnect();
  }
}
