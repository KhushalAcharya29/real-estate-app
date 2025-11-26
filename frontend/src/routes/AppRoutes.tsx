import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';
import PropertyListPage from '../features/properties/PropertyListPage';
import PropertyDetailPage from '../features/properties/PropertyDetailPage';
import MyInterestsPage from '../features/client/MyInterestsPage';
import MyPropertiesPage from '../features/agent/MyPropertiesPage';
import Navbar from '../components/Navbar';
import ProtectedRoute from '../components/ProtectedRoute';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<PropertyListPage />} />
        <Route path="/property/:id" element={<PropertyDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Client routes */}
        <Route
          path="/my-interests"
          element={
            <ProtectedRoute role="client">
              <MyInterestsPage />
            </ProtectedRoute>
          }
        />

        {/* Agent routes */}
        <Route
          path="/my-properties"
          element={
            <ProtectedRoute role="agent">
              <MyPropertiesPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
