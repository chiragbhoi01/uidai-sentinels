import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import OperatorList from '../pages/OperatorList';
import OperatorDetail from '../pages/OperatorDetail';
import Dashboard from '../pages/Dashboard';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate replace to="/dashboard" />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/operators" element={<OperatorList />} />
      <Route path="/operator/:operatorId" element={<OperatorDetail />} />
    </Routes>
  );
};

export default AppRoutes;
