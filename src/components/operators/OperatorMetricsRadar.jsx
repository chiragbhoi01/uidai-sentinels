import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const dataKeyToLabel = {
    avgEnrolmentTimeSec: "Avg. Enrolment Time (s)",
    biometricExceptionRate: "Biometric Exception Rate (%)",
    rejectionRate310: "Rejection Rate (310) (%)",
    activityHourVariance: "Activity Hour Variance",
};

const OperatorMetricsRadar = ({ operatorMetrics, districtAverage }) => {

    const chartData = Object.keys(operatorMetrics).map(key => ({
        metric: dataKeyToLabel[key] || key,
        operator: key.includes('Rate') ? operatorMetrics[key] * 100 : operatorMetrics[key],
        district: key.includes('Rate') ? districtAverage[key] * 100 : districtAverage[key],
    }));

    return (
        <ResponsiveContainer width="100%" height={400}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" tick={{ fill: '#4B5563', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fill: '#6B7280' }} />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid #E5E7EB',
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                    }}
                    labelStyle={{ fontWeight: 'bold', color: '#1F2937' }}
                    formatter={(value, name) => [`${value.toFixed(2)}`, name.charAt(0).toUpperCase() + name.slice(1)]}
                />
                <Legend iconSize={10} />
                <Radar name="Operator" dataKey="operator" stroke="#EF4444" fill="#EF4444" fillOpacity={0.2} />
                <Radar name="District Avg." dataKey="district" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.5} />
            </RadarChart>
        </ResponsiveContainer>
    );
};

export default OperatorMetricsRadar;
