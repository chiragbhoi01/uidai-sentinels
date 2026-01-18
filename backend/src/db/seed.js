import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';

import { Operator } from '../models/operator.model.js';
import { Transaction } from '../models/transaction.model.js';

dotenv.config({ path: './.env' });

const DISTRICTS = ['North', 'South', 'East', 'West', 'Central'];
const STATES = ['Delhi', 'Mumbai', 'Bangalore', 'Kolkata', 'Chennai'];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding!');
  } catch (error) {
    console.error('MongoDB connection FAILED:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  await connectDB();

  try {
    console.log('Clearing existing data...');
    await Operator.deleteMany({});
    await Transaction.deleteMany({});

    console.log('Generating operators...');
    const operators = [];
    const numOperators = 75; // Total operators

    // Designate 5 operators as high-risk
    const highRiskIndices = new Set();
    while(highRiskIndices.size < 5) {
        highRiskIndices.add(Math.floor(Math.random() * numOperators));
    }

    for (let i = 0; i < numOperators; i++) {
      const isHighRisk = highRiskIndices.has(i);
      const operator = new Operator({
        name: faker.person.fullName(),
        operatorId: `OP_${faker.string.alphanumeric(4).toUpperCase()}`,
        stationId: `STN_${faker.string.alphanumeric(3).toUpperCase()}`,
        district: faker.helpers.arrayElement(DISTRICTS),
        state: faker.helpers.arrayElement(STATES),
        isHighRisk: isHighRisk // Custom property for seeding logic
      });
      operators.push(operator);
    }
    
    await Operator.insertMany(operators);
    console.log(`${operators.length} operators created.`);

    console.log('Generating transactions...');
    const transactions = [];
    for (const operator of operators) {
      const numTransactions = faker.number.int({ min: 100, max: 500 });

      for (let j = 0; j < numTransactions; j++) {
        const timestamp = faker.date.recent({ days: 14 });
        let anomalyType = 'None';
        let status = 'Success';

        if (operator.isHighRisk) {
            // High-risk operators get more anomalies
            if (faker.number.float({ max: 1 }) < 0.25) anomalyType = 'Biometric';
            if (faker.number.float({ max: 1 }) < 0.30) status = 'Rejected';
            if (faker.number.float({ max: 1 }) < 0.40) timestamp.setHours(timestamp.getHours() - 10); // Odd hours
        } else {
            // Normal operators get fewer anomalies
            if (faker.number.float({ max: 1 }) < 0.02) anomalyType = 'Biometric';
            if (faker.number.float({ max: 1 }) < 0.05) status = 'Rejected';
        }

        transactions.push(new Transaction({
          packetId: faker.string.uuid(),
          operatorId: operator._id,
          timestamp,
          type: faker.helpers.arrayElement(['New', 'Update']),
          status,
          anomalyType,
        }));
      }
    }
    await Transaction.insertMany(transactions);
    console.log(`${transactions.length} transactions created.`);

    console.log('Data seeding complete!');
  } catch (error) {
    console.error('Error during data seeding:', error);
  } finally {
    mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
};

seedData();