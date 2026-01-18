import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import './App.css';

function App() {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;