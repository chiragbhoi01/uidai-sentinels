import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUp, ArrowDown, Eye, AlertTriangle } from 'lucide-react';
import RiskBadge from './RiskBadge';
import Loader from '../common/Loader';

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

const OperatorRiskTable = ({ operators, isLoading, error }) => {
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

  const formatDate = (isoString) => new Date(isoString).toLocaleString();

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

  if (isLoading) {
    return <Loader text="Loading Operator Data..." />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 bg-red-50 text-red-700 rounded-lg p-4">
        <AlertTriangle className="h-6 w-6" />
        <span className="ml-3 font-medium">Error: {error.message}</span>
      </div>
    );
  }

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
            <SortableHeader sortKey="district" sortConfig={sortConfig} setSortConfig={setSortConfig}>District</SortableHeader>
            <SortableHeader sortKey="riskScore" sortConfig={sortConfig} setSortConfig={setSortConfig}>Risk Score</SortableHeader>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
            <SortableHeader sortKey="lastUpdated" sortConfig={sortConfig} setSortConfig={setSortConfig}>Last Updated</SortableHeader>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedOperators.map((operator, index) => (
            <motion.tr
              key={operator.operatorId}
              custom={index}
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700">{operator.operatorId}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{operator.district}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{operator.riskScore.toFixed(1)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm"><RiskBadge level={operator.riskLevel} /></td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">{formatDate(operator.lastUpdated)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <Link
                  to={`/operator/${operator.operatorId}`}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-5 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Link>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OperatorRiskTable;
