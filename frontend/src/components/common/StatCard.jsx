import React from 'react';
import { motion } from 'framer-motion';

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

const StatCard = ({ icon: Icon, title, value, color = "text-gray-400" }) => {
    return (
        <motion.div
            variants={itemVariants}
            className="bg-white shadow-lg rounded-xl p-5"
        >
            <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 bg-gray-100 rounded-lg`}>
                    <Icon className={`h-6 w-6 ${color}`} aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                    <dd className="flex items-baseline">
                        <p className="text-2xl font-semibold text-gray-900">{value ?? 'N/A'}</p>
                    </dd>
                </div>
            </div>
        </motion.div>
    );
};

export default StatCard;
