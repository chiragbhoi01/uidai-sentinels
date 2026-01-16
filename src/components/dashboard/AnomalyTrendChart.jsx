import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const AnomalyTrendChart = ({ data }) => {

    const formatXAxis = (tickItem) => {
        const date = new Date(tickItem);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
            className="bg-white shadow-sm rounded-lg p-6"
        >
            <h3 className="text-lg font-medium text-gray-900 mb-1">Daily Anomaly Trend</h3>
            <p className="text-sm text-gray-500 mb-6">Anomalies detected over the last 30 days.</p>
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
                            tick={{ fill: '#4B5563', fontSize: 12 }} 
                            label={{ value: 'Anomalies', angle: -90, position: 'insideLeft', fill: '#374151', dx: -10 }} 
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                border: '1px solid #E5E7EB',
                                borderRadius: '0.5rem',
                            }}
                            labelStyle={{ fontWeight: 'bold' }}
                            formatter={(value) => [value, 'Anomalies']}
                        />
                        <Legend verticalAlign="top" height={36}/>
                        <Line type="monotone" dataKey="count" name="Detected Anomalies" stroke="#DC2626" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default AnomalyTrendChart;
