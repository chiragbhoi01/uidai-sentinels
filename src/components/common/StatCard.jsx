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

const StatCard = ({ icon: Icon, title, value, description }) => {
    return (
        <motion.div
            variants={itemVariants}
            className="bg-white shadow-sm rounded-lg p-5 border-l-4 border-blue-500"
        >
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <Icon className="h-8 w-8 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                    <dd className="flex items-baseline">
                        <p className="text-2xl font-semibold text-gray-900">{value}</p>
                    </dd>
                </div>
            </div>
            {description && (
                <div className="mt-4 text-xs text-gray-500">
                    {description}
                </div>
            )}
        </motion.div>
    );
};

export default StatCard;
