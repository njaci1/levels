async function calculateAndAllocateFunds(adId, isNewAd = true) {
  const allocationPercentages = {
    joinersJP: 0.25,
    weeklyJP: 0.25,
    monthlyJP: 0.3,
    annualJP: 0.1,
    platformShare: 0.15,
  };

  // Create JackpotAllocation entry if it's a new ad
  if (isNewAd) {
    await JackpotAllocation.create({
      adId: adId,
      ...allocationPercentages,
      isNewAd: isNewAd,
    });
  }

  // Background Job: Update jackpot totals based on timestamp
}
