import React from 'react';

/**
 * Maps risk score to corresponding Tailwind CSS classes for styling.
 * @param {string} riskLevel - The risk level string (e.g., "CRITICAL", "HIGH").
 * @returns {string} Tailwind classes for background and text color.
 */
const getRiskBadgeClasses = (riskLevel) => {
  switch (riskLevel) {
    case 'CRITICAL':
      return 'bg-red-100 text-red-800';
    case 'HIGH':
      return 'bg-orange-100 text-orange-800';
    case 'MEDIUM':
      return 'bg-yellow-100 text-yellow-800';
    case 'LOW':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const RiskBadge = ({ level }) => {
  return (
    <span
      className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskBadgeClasses(level)}`}
    >
      {level}
    </span>
  );
};

export default RiskBadge;
