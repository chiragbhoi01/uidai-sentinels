import React from 'react';

const getRiskInfo = (score) => {
    if (score > 90) {
      return { level: 'CRITICAL', classes: 'bg-red-100 text-red-700 font-bold' };
    }
    if (score > 70) {
      return { level: 'HIGH', classes: 'bg-orange-100 text-orange-700 font-bold' };
    }
    if (score > 40) {
      return { level: 'MEDIUM', classes: 'bg-yellow-100 text-yellow-700 font-semibold' };
    }
    if (score > 0) {
        return { level: 'LOW', classes: 'bg-green-100 text-green-700 font-semibold' };
    }
    return { level: 'NOMINAL', classes: 'bg-gray-100 text-gray-700' };
};

const RiskBadge = ({ score }) => {
  const { level, classes } = getRiskInfo(score);
  return (
    <span
      className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${classes}`}
    >
      {level}
    </span>
  );
};

export default RiskBadge;
