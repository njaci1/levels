import db from '../../../../lib/db';
import Notification from '../../../../models/Notifications';

export default async function handler(req, res) {
  const {
    method,
    query: { notificationId },
  } = req;

  await db.connect();

  switch (method) {
    case 'GET':
      try {
        // find notification using notificationId and update read to true

        await Notification.findOneAndUpdate(
          { _id: notificationId }, // find a document with this filter
          { read: true } // update read to true
        );
        res.status(200).json({ success: true });
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
