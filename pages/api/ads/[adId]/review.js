import db from '../../../lib/db';
import { Ad } from '../../../models/AdsCollection';
import { calculateAndAllocateFunds } from '../../../lib/adRevenueAllocation';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    await db.connect();

    try {
      const { adId } = req.query;
      const action = req.body.action; // 'approve' or 'reject'

      const targetAd = await Ad.findOneAndUpdate(
        { _id: adId },
        {
          $set: {
            approvalStatus: action === 'approve' ? 'approved' : 'rejected',
            expiryDate:
              action === 'approve'
                ? calculateExpiryDate(targetAd.duration)
                : null,
          },
        },
        { new: true } // Return the updated document
      );

      if (!targetAd) {
        res.status(404).json({ error: 'Ad not found' });
        return;
      }

      // If approved, trigger allocation
      if (action === 'approve') {
        // const totalPaid = calculatePrice(targetAd.priority, targetAd.duration);
        await calculateAndAllocateFunds(targetAd._id, targetAd.amountPaid);
      }

      // (Future) - Trigger email notification
      if (action === 'approve') {
        // console.log('Send approval email to advertiser');
      } else {
        // console.log('Send rejection email to advertiser');
      }

      res.status(200).json({ message: 'Ad status updated' });
    } catch (error) {
      // ... error handling ...
    } finally {
      await db.disconnect();
    }
  } else {
    // ... handle other methods ...
  }
}

function calculateExpiryDate(durationInWeeks) {
  const DURATION_IN_WEEKS = {
    '1 week': 1,
    '2 weeks': 2,
    '1 month': 4,
  };
  const now = new Date();
  const duration = DURATION_IN_WEEKS[durationInWeeks.toLowerCase()];
  now.setDate(now.getDate() + duration * 7);
  return now;
}
