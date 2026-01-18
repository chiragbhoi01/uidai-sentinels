import { Operator } from '../models/operator.model.js';
import { Transaction } from '../models/transaction.model.js';

const calculateRiskScore = async (operator) => {
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const transactions = await Transaction.find({
        operatorId: operator._id,
        timestamp: { $gte: fourteenDaysAgo },
    }).lean(); // Use .lean() for performance when not modifying

    let score = 0;
    const flags = [];
    const riskFactors = {}; // To store breakdown for demo

    const totalTransactions = transactions.length;

    // Default values if no transactions
    if (totalTransactions === 0) {
        operator.riskScore = 0;
        await operator.save();
        return { finalScore: 0, flags: [], riskFactors: {} };
    }

    // 1. Velocity Anomaly (Max 35 points)
    // Thresholds: > 250 avg/day = critical, > 150 avg/day = high
    const avgTransactionsPerDay = totalTransactions / 14;
    let velocityScore = 0;
    if (avgTransactionsPerDay > 250) {
        velocityScore = 35;
        flags.push({ description: `High velocity: ${avgTransactionsPerDay.toFixed(1)} avg transactions/day`, weight: 35 });
    } else if (avgTransactionsPerDay > 150) {
        velocityScore = 15;
        flags.push({ description: `Moderate velocity: ${avgTransactionsPerDay.toFixed(1)} avg transactions/day`, weight: 15 });
    }
    score += velocityScore;
    riskFactors.velocity = { description: 'Transaction Velocity', value: avgTransactionsPerDay, contribution: velocityScore };


    // 2. Biometric Exception Abuse (Max 25 points)
    // Thresholds: > 5% = critical, > 2% = high
    const biometricAnomalies = transactions.filter(t => t.anomalyType === 'Biometric').length;
    const biometricRate = (biometricAnomalies / totalTransactions) * 100;
    let biometricScore = 0;
    if (biometricRate > 5) {
        biometricScore = 25;
        flags.push({ description: `High biometric exception rate: ${biometricRate.toFixed(1)}%`, weight: 25 });
    } else if (biometricRate > 2) {
        biometricScore = 10;
        flags.push({ description: `Moderate biometric exception rate: ${biometricRate.toFixed(1)}%`, weight: 10 });
    }
    score += biometricScore;
    riskFactors.biometric = { description: 'Biometric Exception Rate', value: biometricRate, contribution: biometricScore };


    // 3. Rejection Rate (e.g., Error-code Repetition / 310 duplication) (Max 20 points)
    // Thresholds: > 10% = critical, > 5% = high
    const rejectedTransactions = transactions.filter(t => t.status === 'Rejected').length;
    const rejectionRate = (rejectedTransactions / totalTransactions) * 100;
    let rejectionScore = 0;
    if (rejectionRate > 10) {
        rejectionScore = 20;
        flags.push({ description: `High transaction rejection rate: ${rejectionRate.toFixed(1)}%`, weight: 20 });
    } else if (rejectionRate > 5) {
        rejectionScore = 10;
        flags.push({ description: `Moderate transaction rejection rate: ${rejectionRate.toFixed(1)}%`, weight: 10 });
    }
    score += rejectionScore;
    riskFactors.rejection = { description: 'Transaction Rejection Rate', value: rejectionRate, contribution: rejectionScore };


    // 4. Odd-hour Activity (Max 20 points)
    // Thresholds: > 10% = critical, > 5% = high (e.g., before 6 AM or after 10 PM IST)
    const oddHourTransactions = transactions.filter(t => {
        const hour = new Date(t.timestamp).getHours(); // Local hour
        return hour < 6 || hour > 22; // Before 6 AM or after 10 PM
    }).length;
    const oddHourRate = (oddHourTransactions / totalTransactions) * 100;
    let oddHourScore = 0;
    if (oddHourRate > 10) {
        oddHourScore = 20;
        flags.push({ description: `Significant odd-hour activity: ${oddHourRate.toFixed(1)}%`, weight: 20 });
    } else if (oddHourRate > 5) {
        oddHourScore = 10;
        flags.push({ description: `Moderate odd-hour activity: ${oddHourRate.toFixed(1)}%`, weight: 10 });
    }
    score += oddHourScore;
    riskFactors.oddHours = { description: 'Odd-Hour Activity Rate', value: oddHourRate, contribution: oddHourScore };


    // Normalize score to 0-100
    const finalScore = Math.min(Math.max(Math.round(score), 0), 100);

    // Update the operator document
    operator.riskScore = finalScore;
    await operator.save();

    return { finalScore, flags, riskFactors };
};

const updateAllOperatorRiskScores = async () => {
    const operators = await Operator.find({});
    console.log(`Updating risk scores for ${operators.length} operators...`);
    for (const operator of operators) {
        await calculateRiskScore(operator);
    }
    console.log('All operator risk scores updated.');
};


export { calculateRiskScore, updateAllOperatorRiskScores };
