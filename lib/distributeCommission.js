import User from '../models/User';
import db from './db';
async function distributeCommission(transactionAmount, userId) {
  console.log(userId);
  const commissionRate = 0.03; // 3%
  const commissionAmount = transactionAmount * commissionRate;

  const level1Rate = 0.5; // 50% of 3%
  const level2Rate = 0.33; // 33.33% of 3%
  const level3Rate = 0.17; // 16.67% of 3%

  try {
    await db.connect();
    const seedInviter = await User.findOne({ username: 'seedUser@test.com' });

    // Get the inviter to the user who made the transaction
    const inviter = await User.findById(userId).populate({
      path: 'inviter',
      populate: { path: 'inviter', populate: { path: 'inviter' } },
    });

    // Level 1 inviter

    if (inviter) {
      console.log(
        `level1 : ${inviter.inviter.firstName} ${inviter.inviter.balance}`
      );
      inviter.inviter.balance += commissionAmount * level1Rate;
      await inviter.inviter.save();
    } else {
      seedInviter.balance += commissionAmount * level1Rate;
      await seedInviter.save();
    }

    // Level 2 inviter

    if (inviter.inviter?.inviter) {
      console.log(
        `level2: ${inviter.inviter?.inviter?.firstName} ${inviter.inviter?.inviter?.balance}`
      );
      inviter.inviter.inviter.balance += commissionAmount * level2Rate;
      await inviter.inviter.inviter.save();
    } else {
      console.log('level2: is seed user');
      seedInviter.balance += commissionAmount * level2Rate;
      await seedInviter.save();
    }

    // Level 3 inviter

    if (inviter.inviter?.inviter?.inviter) {
      console.log(
        `level3: ${inviter.inviter?.inviter?.inviter?.firstName} ${inviter.inviter?.inviter?.inviter?.balance}`
      );
      inviter.inviter.inviter.inviter.balance += commissionAmount * level3Rate;
      await inviter.inviter.inviter.inviter.save();
    } else {
      console.log('level3: is seed user');
      seedInviter.balance += commissionAmount * level3Rate;
      await seedInviter.save();
    }

    return 'Commission distributed successfully';
  } catch (error) {
    console.log(error);
    return 'Commission distribution failed';
  } finally {
    await db.disconnect();
  }
}

export default distributeCommission;
