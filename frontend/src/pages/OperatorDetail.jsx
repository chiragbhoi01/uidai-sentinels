import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

import { getOperatorById } from '../api/operatorApi';
import OperatorMetricsRadar from '../components/operators/OperatorMetricsRadar';
import RiskBadge from '../components/operators/RiskBadge';
import Loader from '../components/common/Loader';
import RiskScoreBreakdown from '../components/operators/RiskScoreBreakdown';

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1, transition: { duration: 0.5 } },
  out: { opacity: 0, transition: { duration: 0.3 } }
};

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

const OperatorDetail = () => {
    const { operatorId } = useParams();
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!operatorId) return;
            try {
                setLoading(true);
                const detailsData = await getOperatorById(operatorId);
                setDetails(detailsData);
                setError(null);
            } catch (err) {
                setError(err);
                setDetails(null);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [operatorId]);

    const renderContent = () => {
        if (loading) {
            return <Loader text={`Loading profile for operator ${operatorId}...`} />;
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center h-full bg-red-50 text-red-700 rounded-lg p-6">
                    <AlertTriangle className="h-10 w-10" />
                    <span className="mt-4 font-medium text-lg">Error Fetching Operator Data</span>
                    <p className="mt-1 text-sm">{error.message}</p>
                </div>
            );
        }

        if (!details) {
            return <div className="text-center py-16">No details found for this operator.</div>;
        }

        return (
            <div className="space-y-8">
                {/* Header Section */}
                <motion.div variants={itemVariants} className="bg-white shadow-lg rounded-xl p-6">
                    <div className="flex flex-wrap justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Operator ID</p>
                            <h1 className="text-3xl font-bold font-mono text-gray-900">{details.operatorId}</h1>     
                            <p className="mt-1 text-gray-600">{details.agency} - {details.district}, {details.state}</p>
                        </div>
                        <div className="text-right mt-4 sm:mt-0">
                            <p className="text-sm font-medium text-gray-500">Overall Risk Score</p>
                            <div className="flex items-center gap-x-3">
                                <h2 className="text-5xl font-bold text-gray-900">{details.riskScore.toFixed(1)}</h2> 
                                <RiskBadge score={details.riskScore} />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">Last Assessed: {new Date(details.updatedAt).toLocaleString()}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Suggested Action Section */}
                <motion.div variants={itemVariants} className="bg-white shadow-lg rounded-xl p-6 border-l-4 border-indigo-500">
                    <h3 className="text-lg font-medium text-gray-900">Suggested Action</h3>
                    <p className="mt-2 text-gray-700">
                        {(() => {
                            const score = details.riskScore;
                            if (score > 90) return "Immediate suspension and field audit recommended.";
                            if (score > 70) return "High priority for field verification and close monitoring.";
                            if (score > 40) return "Place on watchlist for periodic review.";
                            return "Continue standard monitoring. No immediate action required.";
                        })()}
                    </p>
                </motion.div>

                {/* Risk Score Breakdown */}
                {details.riskFactors && (
                    <motion.div variants={itemVariants}>
                        <RiskScoreBreakdown breakdown={details.riskFactors} />
                    </motion.div>
                )}

                {/* Metrics Radar Chart */}
                <motion.div variants={itemVariants} className="bg-white shadow-lg rounded-xl p-6">
                    <h2 className="text-lg font-medium text-gray-900">Behavioral Metrics</h2>  
                    <p className="text-sm text-gray-500 mb-4">A comparison of key performance indicators against the district average.</p>        
                    <OperatorMetricsRadar operatorMetrics={details.metrics} districtAverage={details.districtAverages} />
                </motion.div>

                {/* Anomaly Flags (Risk Reasoning) */}
                <motion.div variants={itemVariants} className="bg-white shadow-lg rounded-xl">
                    <div className="px-6 py-4 border-b">
                        <h2 className="text-lg font-medium text-gray-900">Why is this operator flagged?</h2>
                        <p className="text-sm text-gray-500">System-identified behavioral patterns indicating potential risk.</p>
                    </div>
                    <ul className="divide-y divide-gray-200">
                        {details.flags.length > 0 ? details.flags.map((flag, index) => (
                            <li key={index} className="px-6 py-4 flex items-start">
                                <div className="flex-shrink-0 pt-0.5">
                                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-semibold text-gray-800">{flag.description}</p>
                                    <p className="text-xs text-gray-600">Contribution: +{flag.weight.toFixed(1)} points</p>
                                </div>
                            </li>
                        )) : (
                            <li className="px-6 py-4 text-sm text-gray-500">No abnormal patterns detected.</li>
                        )}
                    </ul>
                </motion.div>
            </div>
        );
    };


    return (
        <motion.div
            className="p-4 sm:p-6 lg:p-8 min-h-screen"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
        >
            <div className="max-w-4xl mx-auto">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0, transition:{ delay: 0.2 } }}>
                    <Link
                        to="/operators"
                        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 mb-6 group"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />       
                        Back to Operator Watchlist
                    </Link>
                </motion.div>

                <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
                    {renderContent()}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default OperatorDetail;
