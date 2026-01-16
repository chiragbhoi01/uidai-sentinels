import React, { useState, useEffect } from 'react';
import OperatorRiskTable from '../components/operators/OperatorRiskTable';
import { getOperatorRiskData } from '../api/operatorApi';
import { ShieldCheck } from 'lucide-react';

const OperatorList = () => {
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getOperatorRiskData();
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

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <header className="mb-8 max-w-7xl mx-auto">
        <div className="flex items-center">
          <ShieldCheck className="h-10 w-10 text-blue-600" />
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Sentinels of Integrity
            </h1>
            <p className="text-sm text-gray-500">
              Operator Behavioral Anomaly Detection System
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h2 className="text-lg leading-6 font-medium text-gray-900">Operator Risk Overview</h2>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Live risk scores for all monitored enrollment operators.</p>
            </div>
            <OperatorRiskTable operators={operators} isLoading={loading} error={error} />
        </div>
      </main>
    </div>
  );
};

export default OperatorList;
