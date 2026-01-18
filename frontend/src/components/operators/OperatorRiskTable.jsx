import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, Eye, AlertTriangle } from 'lucide-react';
import RiskBadge from './RiskBadge';

const SortableHeader = ({ children, sortKey, sortConfig, setSortConfig }) => {
  const isActive = sortConfig.key === sortKey;
  const isAsc = sortConfig.direction === 'ascending';

  const handleClick = () => {
    const direction = isActive && isAsc ? 'descending' : 'ascending';
    setSortConfig({ key: sortKey, direction });
  };

  return (
    <th
      scope="col"
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
      onClick={handleClick}
    >
      <div className="flex items-center">
        {children}
        <span className="ml-2">
            {isActive && (isAsc ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
        </span>
      </div>
    </th>
  );
};

const OperatorRiskTable = ({ operators, onRowClick }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'riskScore', direction: 'descending' });

  const sortedOperators = useMemo(() => {
    let sortableItems = [...operators];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [operators, sortConfig]);

  const formatDate = (isoString) => new Date(isoString).toLocaleDateString();

  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.03,
        duration: 0.3,
        ease: "easeOut"
      },
    }),
  };

  if (sortedOperators.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-lg font-medium text-gray-900">No Operators Found</h3>
        <p className="mt-1 text-sm text-gray-500">There is currently no operator risk data to display.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <SortableHeader sortKey="operatorId" sortConfig={sortConfig} setSortConfig={setSortConfig}>Operator ID</SortableHeader>
            <SortableHeader sortKey="agency" sortConfig={sortConfig} setSortConfig={setSortConfig}>Agency</SortableHeader>
            <SortableHeader sortKey="district" sortConfig={sortConfig} setSortConfig={setSortConfig}>District</SortableHeader>
            <SortableHeader sortKey="riskScore" sortConfig={sortConfig} setSortConfig={setSortConfig}>Risk Score</SortableHeader>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
            <SortableHeader sortKey="updatedAt" sortConfig={sortConfig} setSortConfig={setSortConfig}>Last Assessed</SortableHeader>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedOperators.map((operator, index) => (
            <motion.tr
              key={operator._id}
              custom={index}
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              className="hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => onRowClick(operator.operatorId)}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700">{operator.operatorId}</td> 
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{operator.agency}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{operator.district}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{operator.riskScore.toFixed(1)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm"><RiskBadge score={operator.riskScore} /></td>      
              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">{formatDate(operator.updatedAt)}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OperatorRiskTable;
