import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
                // NOTE: In a real app, you might want separate API endpoints.
                // For the hackathon, we can derive the trend from a different call or use a dedicated one.
                // Assuming getDashboardSummary also returns what's needed for the trend for now.
                const summaryData = await getDashboardSummary();
                setSummary(summaryData);
                // Mocking trend data based on summary as getAnomalyTrend might not exist on backend yet
                const trendData = [
                    { date: '2026-01-11', anomalies: summaryData.totalOperators - 20, riskLevel: 30 },
                    { date: '2026-01-12', anomalies: summaryData.totalOperators - 15, riskLevel: 45 },
                    { date: '2026-01-13', anomalies: summaryData.totalOperators - 18, riskLevel: 40 },
                    { date: '2026-01-14', anomalies: summaryData.criticalOperators + 5, riskLevel: 60 },
                    { date: '2026-01-15', anomalies: summaryData.criticalOperators + 12, riskLevel: 75 },
                    { date: '2026-01-16', anomalies: summaryData.criticalOperators + 8, riskLevel: 65 },
                    { date: '2026-01-17', anomalies: summaryData.criticalOperators, riskLevel: 80 },
                ];

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
                    <StatCard
                        icon={Users}
                        title="Total Operators"
                        value={summary?.totalOperators?.toLocaleString()}
                        color="text-blue-500"
                    />
                    <StatCard
                        icon={ShieldAlert}
                        title="High-Risk Operators"
                        value={summary?.highRiskCount?.toLocaleString()}
                        color="text-yellow-500"
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
                    <h1 className="text-3xl font-bold text-gray-900">
                        Sentinel Dashboard
                    </h1>
                    <p className="text-sm text-gray-500">
                        Real-time overview of operator risk and system-wide anomaly trends.
                    </p>
                </header>
                <main>
                    {renderContent()}
                </main>
            </div>
        </motion.div>
    );
};

export default Dashboard;
