import React from 'react';

const JackpotCard = ({ name, amount, entries, drawDate }) => {
  return (
    <div className="jackpot-card">
      <h2>{name}</h2>
      <p>Amount: {amount}</p>
      <p>Entries: {entries}</p>
      <p>Draw Date: {drawDate}</p>
    </div>
  );
};

export default JackpotCard;
