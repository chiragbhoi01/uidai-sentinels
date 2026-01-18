import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; // Import Link
import { Users, ShieldAlert, ShieldX, BarChart3, AlertTriangle } from 'lucide-react';

import { getDashboardSummary, getAnomalyTrend } from '../api/operatorApi';
import StatCard from '../components/common/StatCard';
import AnomalyTrendChart from '../components/dashboard/AnomalyTrendChart';
import Loader from '../components/common/Loader';

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1, transition: { duration: 0.5 } },
  out: { opacity: 0, transition: { duration: 0.3 } }
};

const Dashboard = () => {
    const [summary, setSummary] = useState(null);
    const [trend, setTrend] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [summaryData, trendData] = await Promise.all([
                    getDashboardSummary(),
                    getAnomalyTrend()
                ]);
                setSummary(summaryData);
                setTrend(trendData);
                setError(null);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const renderContent = () => {
        if (loading) {
            return <Loader text="Loading Dashboard Data..." />;
        }
        if (error) {
            return (
                <div className="flex flex-col items-center justify-center h-full bg-red-50 text-red-700 rounded-lg p-6">
                    <AlertTriangle className="h-10 w-10" />
                    <span className="mt-4 font-medium text-lg">Error Fetching Dashboard Data</span>
                    <p className="mt-1 text-sm">{error.message}</p>
                </div>
            );
        }
        return (
            <motion.div
                className="space-y-8"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
                {/* KPI Cards */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <Link to="/operators">
                        <StatCard
                            icon={Users}
                            title="Total Operators"
                            value={summary?.totalOperators?.toLocaleString()}
                            color="text-blue-500"
                        />
                    </Link>
                    <StatCard
                        icon={ShieldAlert}
                        title="High-Risk Operators"
                        value={summary?.highRiskCount?.toLocaleString()}
                        color="text-orange-500"
                    />
                    <StatCard
                        icon={ShieldX}
                        title="Critical Operators"
                        value={summary?.criticalRiskCount?.toLocaleString()}
                        color="text-red-500"
                    />
                    <StatCard
                        icon={BarChart3}
                        title="Avg. Risk Score"
                        value={summary?.averageRiskScore?.toFixed(1)}
                        color="text-indigo-500"
                    />
                </div>

                {/* Anomaly Trend Chart */}
                <AnomalyTrendChart data={trend} />
            </motion.div>
        );
    };

    return (
        <motion.div
            className="p-4 sm:p-6 lg:p-8"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
        >
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Sentinel Dashboard
                            </h1>
                            <p className="text-sm text-gray-500">
                                Real-time overview of operator risk and system-wide anomaly trends.
                            </p>
                        </div>
                        {summary && (
                             <div className={`text-sm font-semibold p-2 rounded-lg ${summary.criticalRiskCount > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                {summary.criticalRiskCount > 0
                                    ? `${summary.criticalRiskCount} Critical Alerts Detected`
                                    : "System Operating Normally"}
                            </div>
                        )}
                    </div>
                </header>
                <main>
                    {renderContent()}
                </main>
            </div>
        </motion.div>
    );
};

const DashboardContent = ({ summary, trend }) => {
    return (
        <motion.div
            className="space-y-8"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
            {/* KPI Cards */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                <Link to="/operators" className="hover:scale-105 transition-transform">
                                    <StatCard
                                        icon={Users}
                                        title="Total Operators"
                                        value={summary?.totalOperators?.toLocaleString()}
                                        color="text-blue-500"
                                    />
                                </Link>
                                <StatCard
                                    icon={ShieldAlert}
                                    title="High-Risk Operators"
                                    value={summary?.highRiskCount?.toLocaleString()}
                                    color="text-orange-500"
                                />
                                <StatCard
                                    icon={ShieldX}
                                    title="Critical Operators"
                                    value={summary?.criticalRiskCount?.toLocaleString()}
                                    color="text-red-500"
                                />
                                <StatCard
                                    icon={BarChart3}
                                    title="Avg. Risk Score"
                                    value={summary?.averageRiskScore?.toFixed(1)}
                                    color="text-indigo-500"
                                />
                            </div>
            {/* Anomaly Trend Chart */}
            <AnomalyTrendChart data={trend} />
        </motion.div>
    );
};

export default Dashboard;


