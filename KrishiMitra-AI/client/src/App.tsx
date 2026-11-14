
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { RootLayout } from './layouts/RootLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { AssistantPage } from './pages/AssistantPage';
import { PlantDoctorPage } from './pages/PlantDoctorPage';
import { CropAdvisorPage } from './pages/CropAdvisorPage';
import { WeatherPage } from './pages/WeatherPage';
import { SoilAdvisorPage } from './pages/SoilAdvisorPage';
import { IrrigationPage } from './pages/IrrigationPage';
import { FarmPlannerPage } from './pages/FarmPlannerPage';
import { HistoryPage } from './pages/HistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

// New hackathon features
import { MarketPricesPage } from './pages/MarketPricesPage';
import { GovernmentSchemesPage } from './pages/GovernmentSchemesPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Root Layout */}
          <Route element={<RootLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Protected Farmer Portal Layout */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route
              path="/dashboard"
              element={<DashboardPage />}
            />

            <Route
              path="/assistant"
              element={<AssistantPage />}
            />

            <Route
              path="/plant-doctor"
              element={<PlantDoctorPage />}
            />

            <Route
              path="/crop-advisor"
              element={<CropAdvisorPage />}
            />

            <Route
              path="/weather"
              element={<WeatherPage />}
            />

            <Route
              path="/soil-advisor"
              element={<SoilAdvisorPage />}
            />

            <Route
              path="/irrigation"
              element={<IrrigationPage />}
            />

            <Route
              path="/farm-planner"
              element={<FarmPlannerPage />}
            />

            <Route
              path="/history"
              element={<HistoryPage />}
            />

            <Route
              path="/profile"
              element={<ProfilePage />}
            />

            <Route
              path="/settings"
              element={<SettingsPage />}
            />

            {/* New Feature 1: Mandi Market Prices */}
            <Route
              path="/market-prices"
              element={<MarketPricesPage />}
            />

            {/* New Feature 2: Government Schemes */}
            <Route
              path="/government-schemes"
              element={<GovernmentSchemesPage />}
            />
          </Route>

          {/* Catch-all redirect */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
