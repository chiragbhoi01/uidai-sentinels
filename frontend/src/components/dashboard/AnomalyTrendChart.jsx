import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';       
import { motion } from 'framer-motion';

const AnomalyTrendChart = ({ data }) => {
    const formatXAxis = (tickItem) => {
        try {
            const date = new Date(tickItem);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        } catch (e) {
            return tickItem;
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                delay: 0.2
            },
        },
    };

    return (
        <motion.div
            variants={itemVariants}
            className="bg-white shadow-lg rounded-xl p-6"
        >
            <h3 className="text-lg font-medium text-gray-900 mb-1">System Risk Trend</h3>
            <p className="text-sm text-gray-500 mb-6">Daily average risk score and critical anomalies over the past week.</p>
            <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                    <LineChart
                        data={data}
                        margin={{
                            top: 5, right: 30, left: 20, bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis
                            dataKey="date"
                            tickFormatter={formatXAxis}
                            tick={{ fill: '#4B5563', fontSize: 12 }}
                            padding={{ left: 20, right: 20 }}
                        />
                        <YAxis
                            yAxisId="left"
                            tick={{ fill: '#4B5563', fontSize: 12 }}
                            label={{ value: 'Anomalies', angle: -90, position: 'insideLeft', fill: '#374151', dx: -10 }}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            tick={{ fill: '#4B5563', fontSize: 12 }}
                            label={{ value: 'Avg. Risk', angle: 90, position: 'insideRight', fill: '#374151', dx: 10 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                border: '1px solid #E5E7EB',
                                borderRadius: '0.5rem',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            }}
                            labelStyle={{ fontWeight: 'bold' }}
                        />
                        <Legend verticalAlign="top" height={36}/>
                        <Line yAxisId="left" type="monotone" dataKey="anomalies" name="Critical Anomalies" stroke="#DC2626" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                        <Line yAxisId="right" type="monotone" dataKey="riskLevel" name="Average Risk Score" stroke="#4F46E5" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default AnomalyTrendChart;
