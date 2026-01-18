# Sentinels of Integrity - UIDAI Hackathon 2026

**A Real-Time Operator Risk & Anomaly Detection Dashboard for the Aadhaar Ecosystem.**

---

## 1. Problem Statement

The Aadhaar ecosystem, which underpins India's digital identity, processes millions of enrollment and update transactions daily. This massive scale creates opportunities for fraud, errors, and operational negligence by enrollment operators. Our project, **"Sentinels of Integrity"**, is a real-time risk assessment dashboard that provides UIDAI with an eagle-eye view of the entire ecosystem. It uses behavioral analysis to flag high-risk operators and anomalous activities, enabling proactive intervention and preserving the integrity of the Aadhaar database.

## 2. Key Features

- **Real-Time Sentinel Dashboard:** A high-level overview of the entire ecosystem's health, including total operator counts, a breakdown of operators by risk level (Critical, High, Medium, Low), and a system health indicator.
- **Anomaly & Risk Trend Analysis:** A dynamic chart that visualizes system-wide anomalies and the average risk score trend over the last 14 days, helping to identify emerging patterns.
- **Operator Watchlist:** A comprehensive, sortable table of all operators, color-coded by their calculated risk score, allowing analysts to immediately identify the most high-risk individuals.
- **Detailed Operator Profile:** A drill-down view for each operator that provides a complete root cause analysis, including:
    - **Risk Reasoning:** An "explainability" panel that details exactly *why* an operator was flagged (e.g., high rejection rate, odd-hour activity).
    - **Suggested Action:** A decision-support box that recommends the next steps for an analyst (e.g., "Recommend field verification").
    - **Behavioral Metrics:** A radar chart that visually compares the operator's key metrics against the district average.
- **Dynamic Risk Scoring Engine:** A backend service that analyzes operator transactions based on four key vectors: transaction velocity, biometric exception rates, error/rejection rates, and odd-hour activity.

## 3. Tech Stack

This project is a modern MERN stack monorepo, designed for performance, scalability, and a great developer experience.

- **Backend:**
    - **Runtime:** Node.js
    - **Framework:** Express.js
    - **Database:** MongoDB with Mongoose ODM
    - **API:** RESTful API with custom `ApiResponse` and `ApiError` handlers.
- **Frontend:**
    - **Framework:** React (with Vite for a fast development experience)
    - **Routing:** React Router
    - **Styling:** Tailwind CSS
    - **Data Visualization:** Recharts
    - **UI/UX:** Framer Motion (for animations), Lucide React (for icons)
    - **API Client:** Axios

## 4. Project Structure

The project uses a clean monorepo structure to keep the frontend and backend codebases separate and self-contained.

```
/
├── backend/        # Contains the Node.js/Express backend server
│   ├── src/
│   ├── .env.example
│   └── package.json
│
├── frontend/       # Contains the React/Vite frontend application
│   ├── src/
│   ├── .env
│   └── package.json
│
└── README.md
```

## 5. Getting Started: Local Setup Guide

Follow these steps to get the project running locally for a demo.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [MongoDB](https://www.mongodb.com/try/download/community) instance (local or a cloud instance like MongoDB Atlas)

### Step 1: Clone the Repository

```sh
git clone <repository-url>
cd uidai-sentinels
```

### Step 2: Configure the Backend

1.  **Navigate to the backend directory:**
    ```sh
    cd backend
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Create the environment file:**
    Copy the example file and then edit it.
    ```sh
    # For Windows
    copy .env.example .env
    
    # For macOS/Linux
    cp .env.example .env
    ```

4.  **Edit `.env`:**
    Open the newly created `.env` file and replace the placeholder with your actual MongoDB connection string.
    ```env
    PORT=8000
    MONGODB_URI="your_mongodb_connection_string_here"
    CORS_ORIGIN=http://localhost:5173
    ```

5.  **Seed the Database:**
    Run the seeder script to populate the database with realistic demo data.
    ```sh
    npm run seed
    ```

6.  **Calculate Initial Risk Scores:**
    Run the one-off job to calculate the risk scores for the seeded data.
    ```sh
    npm run update-risk
    ```

7.  **Start the Backend Server:**
    ```sh
    npm run dev
    ```
    The backend server should now be running on **http://localhost:8000**.

### Step 3: Configure the Frontend

1.  **Open a new terminal window.**

2.  **Navigate to the frontend directory:**
    ```sh
    cd frontend
    ```

3.  **Install dependencies:**
    ```sh
    npm install
    ```
    > **Note:** If you encounter a peer dependency error with React, run `npm install --legacy-peer-deps`.

4.  **Verify the environment file:**
    The `frontend/.env` file should already exist and contain:
    ```env
    VITE_API_BASE_URL=http://localhost:8000/api/v1
    ```

5.  **Start the Frontend Server:**
    ```sh
    npm run dev
    ```
    The frontend application will automatically open in your browser, or you can navigate to **http://localhost:5173**.

## 6. Team

- **Chirag:** Backend & Integration Lead
- **Mohit:** Frontend & UI Lead
