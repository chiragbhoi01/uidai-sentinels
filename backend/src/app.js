import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// --- MANUAL CORS MIDDLEWARE (DEFINITIVE FIX) ---
app.use((req, res, next) => {
    const origin = process.env.CORS_ORIGIN || 'http://localhost:5173';
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
    
    next();
});
// --- End CORS Configuration ---

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes import
import riskRouter from './routes/risk.routes.js';

// routes declaration
app.use("/api/v1/risk", riskRouter);

export { app };