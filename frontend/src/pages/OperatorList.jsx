import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import OperatorRiskTable from '../components/operators/OperatorRiskTable';
import { getOperators } from '../api/operatorApi';
import Loader from '../components/common/Loader';

const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    out: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const OperatorList = () => {
    const [operators, setOperators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await getOperators();
                setOperators(data);
                setError(null);
            } catch (err) {
                setError(err);
                setOperators([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleRowClick = (operatorId) => {
        navigate(`/operator/${operatorId}`);
    };

    const renderContent = () => {
        if (loading) {
            return <Loader text="Fetching Operator Data..." />;
        }
        if (error) {
            return (
                <div className="flex flex-col items-center justify-center h-64 bg-red-50 text-red-700 rounded-lg">
                    <AlertTriangle className="h-10 w-10" />
                    <span className="mt-4 font-medium text-lg">Error Fetching Operator Data</span>
                    <p className="mt-1 text-sm">{error.message}</p>
                </div>
            );
        }
        return (
            <OperatorRiskTable 
                operators={operators} 
                onRowClick={handleRowClick}
            />
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
                    <div className="flex items-center space-x-4">
                        <ShieldCheck className="h-10 w-10 text-blue-600" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Operator Watchlist
                            </h1>
                            <p className="text-sm text-gray-500">
                                Comprehensive risk analysis for all enrollment operators.
                            </p>
                        </div>
                    </div>
                </header>

                <main>
                    <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                            <h2 className="text-lg leading-6 font-medium text-gray-900">Live Risk Assessment</h2>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                Click on an operator to view a detailed risk profile.
                            </p>
                        </div>
                        <div className="p-4">
                            {renderContent()}
                        </div>
                    </div>
                </main>
            </div>
        </motion.div>
    );
};

export default OperatorList;
