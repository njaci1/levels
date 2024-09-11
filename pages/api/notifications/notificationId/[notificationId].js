import db from '../../../../lib/db';
import Notification from '../../../../models/Notifications';

export default async function handler(req, res) {
  const {
    method,
    query: { notificationId },
  } = req;

  await db.connect();

  try {
    switch (method) {
      case 'GET':
        await Notification.findOneAndUpdate(
          { _id: notificationId },
          { read: true }
        );
        res.status(200).json({ success: true });
        break;
      default:
        res.status(405).json({ success: false, message: 'Method not allowed' });
        break;
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  } finally {
    await db.disconnect();
  }
}
