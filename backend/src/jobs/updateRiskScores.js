import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { updateAllOperatorRiskScores } from '../services/riskCalculation.service.js';

dotenv.config({ path: './.env' });

const runUpdate = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for risk score update job.');
    
    await updateAllOperatorRiskScores();

  } catch (error) {
    console.error('Error during risk score update job:', error);
  } finally {
    mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
};

runUpdate();
