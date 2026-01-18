import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';

const RiskScoreBreakdown = ({ breakdown }) => {

    const maxContribution = Math.max(...Object.values(breakdown).map(f => f.contribution), 0);

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
          },
        },
    };

    return (
        <motion.div variants={itemVariants} className="bg-white shadow-lg rounded-xl">
            <div className="px-6 py-4 border-b">
                <div className="flex items-center">
                    <HelpCircle className="h-6 w-6 text-blue-600 mr-3" />
                    <div>
                        <h2 className="text-lg font-medium text-gray-900">Risk Score Contribution</h2>
                        <p className="text-sm text-gray-500">Factors contributing to the overall risk score.</p>
                    </div>
                </div>
            </div>
            
            <div className="px-6 pb-6 pt-4">
                <div className="mt-4 overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="text-left text-gray-500">
                            <tr>
                                <th className="py-2 pr-2 font-medium">Factor</th>
                                <th className="py-2 px-2 font-medium text-right">Value</th>
                                <th className="py-2 pl-2 font-medium">Risk Contribution</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {Object.entries(breakdown).map(([key, factor]) => (
                                <tr key={key}>
                                    <td className="py-3 pr-2 font-medium text-gray-800">{factor.description}</td>
                                    <td className="py-3 px-2 text-right font-mono">{factor.value.toFixed(2)}</td>
                                    <td className="py-3 pl-2">
                                        <div className="flex items-center">
                                            <span className="font-mono font-semibold text-gray-800 w-12 text-right mr-2">
                                                +{factor.contribution.toFixed(1)}
                                            </span>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">      
                                                <div
                                                    className="bg-gradient-to-r from-yellow-400 to-red-500 h-2.5 rounded-full"
                                                    style={{ width: `${(factor.contribution / maxContribution) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default RiskScoreBreakdown;
