const WEEKLY_PRICES = {
  high: 100000,
  medium: 70000,
  low: 50000,
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
