import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const dataKeyToLabel = {
    avgEnrolmentTime: "Avg. Enrolment Time (s)",
    biometricExceptionRate: "Biometric Exception Rate (%)",
    errorRate: "Error Rate (%)",
    demographicChangeRate: "Demographic Change Rate (%)",
    oddHourActivityRate: "Odd Hour Activity (%)"
};

const OperatorMetricsRadar = ({ operatorMetrics, districtAverage }) => {

    // Ensure metrics objects exist
    const opMetrics = operatorMetrics || {};
    const distAvg = districtAverage || {};

    const chartData = Object.keys(dataKeyToLabel).map(key => ({
        metric: dataKeyToLabel[key] || key,
        Operator: opMetrics[key] || 0,
        'District Average': distAvg[key] || 0,
    }));

    return (
        <ResponsiveContainer width="100%" height={400}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" tick={{ fill: '#4B5563', fontSize: 13 }} />
                <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fill: '#6B7280' }} />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid #E5E7EB',
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                    labelStyle={{ fontWeight: 'bold', color: '#1F2937' }}
                    formatter={(value, name) => [value.toFixed(2), name]}
                />
                <Legend iconSize={10} />
                <Radar name="Operator" dataKey="Operator" stroke="#DC2626" fill="#DC2626" fillOpacity={0.2} />       
                <Radar name="District Average" dataKey="District Average" stroke="#2563EB" fill="#2563EB" fillOpacity={0.5} />  
            </RadarChart>
        </ResponsiveContainer>
    );
};

export default OperatorMetricsRadar;
