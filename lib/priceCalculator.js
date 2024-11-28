const WEEKLY_PRICES = {
  high: 10000,
  medium: 7000,
  low: 5000,
};

const DURATION_IN_WEEKS = {
  '1 week': 1,
  '2 weeks': 2,
  '1 month': 4,
};

function calculatePrice(priority, durationInWeeks) {
  const weeklyPrice = WEEKLY_PRICES[priority.toLowerCase()];
  const duration = DURATION_IN_WEEKS[durationInWeeks.toLowerCase()];

  if (!weeklyPrice) {
    throw new Error('Invalid priority');
  }

  return weeklyPrice * duration;
}

export default calculatePrice;
