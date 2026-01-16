import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const metricLabels = {
    avgEnrolmentTimeSec: "Avg. Enrolment Time (s)",
    biometricExceptionRate: "Biometric Exception Rate",
    rejectionRate310: "Rejection Rate (310)",
    activityHourVariance: "Activity Hour Variance",
};

const formatValue = (metric, value) => {
    if (metric.includes('Rate')) {
        return `${(value * 100).toFixed(1)}%`;
    }
    if (metric.includes('Time')) {
        return `${value.toFixed(0)}s`;
    }
    return value.toFixed(2);
};

const RiskScoreBreakdown = ({ breakdown }) => {
    const [isOpen, setIsOpen] = useState(true);

    const maxContribution = Math.max(...breakdown.factors.map(f => f.contribution));

    const contentVariants = {
        collapsed: { height: 0, opacity: 0, marginTop: 0 },
        open: { 
            height: 'auto', 
            opacity: 1,
            marginTop: '1rem',
            transition: { 
                duration: 0.4,
                ease: [0.04, 0.62, 0.23, 0.98]
            }
        }
    };

    return (
        <div className="bg-white shadow-sm rounded-lg">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left px-6 py-4"
                aria-expanded={isOpen}
            >
                <div className="flex items-center">
                    <HelpCircle className="h-6 w-6 text-blue-600 mr-3" />
                    <div>
                        <h2 className="text-lg font-medium text-gray-900">Risk Score Explainability</h2>
                        <p className="text-sm text-gray-500">Why is the score what it is?</p>
                    </div>
                </div>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                    <ChevronDown className="h-6 w-6 text-gray-500" />
                </motion.div>
            </button>
            
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="content"
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={contentVariants}
                        className="overflow-hidden"
                    >
                        <div className="px-6 pb-6">
                            <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md border border-blue-200">
                                The total risk score is a weighted sum of contributions from several behavioral factors. Each factor's contribution is determined by its Z-score, which measures how far the operator's behavior deviates from the district average (mean).
                            </p>
                            
                            <div className="mt-4 overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead className="text-left text-gray-500">
                                        <tr>
                                            <th className="py-2 pr-2 font-medium">Metric</th>
                                            <th className="py-2 px-2 font-medium text-right">Operator</th>
                                            <th className="py-2 px-2 font-medium text-right">District Avg</th>
                                            <th className="py-2 px-2 font-medium text-right">Z-Score</th>
                                            <th className="py-2 px-2 font-medium text-right">Weight</th>
                                            <th className="py-2 pl-2 font-medium">Risk Contribution ({breakdown.totalRiskScore.toFixed(1)})</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {breakdown.factors.map((factor) => (
                                            <tr key={factor.metric}>
                                                <td className="py-2 pr-2 font-medium text-gray-800">{metricLabels[factor.metric]}</td>
                                                <td className="py-2 px-2 text-right font-mono">{formatValue(factor.metric, factor.operatorValue)}</td>
                                                <td className="py-2 px-2 text-right font-mono">{formatValue(factor.metric, factor.districtMean)}</td>
                                                <td className={`py-2 px-2 text-right font-mono font-semibold ${Math.abs(factor.zScore) > 3 ? 'text-red-600' : 'text-gray-800'}`}>
                                                    {factor.zScore.toFixed(2)}
                                                </td>
                                                <td className="py-2 px-2 text-right font-mono">{`${(factor.weight * 100).toFixed(0)}%`}</td>
                                                <td className="py-2 pl-2">
                                                    <div className="flex items-center">
                                                        <span className="font-mono font-semibold text-gray-800 w-12 text-right mr-2">{factor.contribution.toFixed(1)}</span>
                                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                            <div 
                                                                className="bg-red-500 h-2.5 rounded-full" 
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
                )}
            </AnimatePresence>
        </div>
    );
};

export default RiskScoreBreakdown;
