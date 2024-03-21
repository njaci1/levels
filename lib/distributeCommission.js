import User from '../models/User';
import db from './db';
async function distributeCommission(transactionAmount, userId) {
  // console.log(userId);
  const commissionRate = 0.03; // 3%
  const commissionAmount = transactionAmount * commissionRate;

  const level1Rate = 0.5; // 50%
  const level2Rate = 0.3; // 30%
  const level3Rate = 0.2; // 20%

  try {
    await db.connect();
    const seedInviter = await User.findOne({ username: 'seedUser@test.com' });

    // Get the inviter to the user who made the transaction
    const inviter = await User.findById(userId).populate({
      path: 'inviter',
      populate: { path: 'inviter', populate: { path: 'inviter' } },
    });
    var level1Inviter, level2Inviter, level3Inviter;
    // Level 1 inviter

    if (inviter) {
      level1Inviter = inviter.inviter._id;
      console.log(
        `level1 : ${inviter.inviter.firstName} ${inviter.inviter.balance}`
      );
      inviter.inviter.balance += commissionAmount * level1Rate;
      inviter.inviter.earningsLevel1 += commissionAmount * level1Rate;
      await inviter.inviter.save();
    } else {
      seedInviter.balance += commissionAmount * level1Rate;
      seedInviter.earningsLevel1 += commissionAmount * level1Rate;
      await seedInviter.save();
    }

    // Level 2 inviter

    if (inviter.inviter?.inviter) {
      level2Inviter = inviter.inviter.inviter._id;
      console.log(
        `level2: ${inviter.inviter?.inviter?.firstName} ${inviter.inviter?.inviter?.balance}`
      );
      inviter.inviter.inviter.balance += commissionAmount * level2Rate;
      inviter.inviter.inviter.earningsLevel2 += commissionAmount * level2Rate;
      await inviter.inviter.inviter.save();
    } else {
      console.log('level2: is seed user');
      seedInviter.balance += commissionAmount * level2Rate;
      seedInviter.earningsLevel2 += commissionAmount * level2Rate;
      await seedInviter.save();
    }

    // Level 3 inviter

    if (inviter.inviter?.inviter?.inviter) {
      level3Inviter = inviter.inviter.inviter.inviter._id;
      console.log(
        `level3: ${inviter.inviter?.inviter?.inviter?.firstName} ${inviter.inviter?.inviter?.inviter?.balance}`
      );
      inviter.inviter.inviter.inviter.balance += commissionAmount * level3Rate;
      inviter.inviter.inviter.inviter.earningsLevel3 +=
        commissionAmount * level3Rate;
      await inviter.inviter.inviter.inviter.save();
    } else {
      console.log('level3: is seed user');
      seedInviter.balance += commissionAmount * level3Rate;
      seedInviter.earningsLevel3 += commissionAmount * level3Rate;
      await seedInviter.save();
    }
    console.log('commission distributed');
    return { level1Inviter, level2Inviter, level3Inviter };
  } catch (error) {
    console.log(error);
    return 'Commission distribution failed';
  } finally {
    await db.disconnect();
  }
}

export default distributeCommission;
