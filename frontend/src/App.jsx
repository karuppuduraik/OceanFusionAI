import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { NotificationProvider } from './context/NotificationContext';
import { OceanDataProvider } from './context/OceanDataContext';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <LanguageProvider>
            <NotificationProvider>
              <OceanDataProvider>
                <AppRoutes />
              </OceanDataProvider>
            </NotificationProvider>
          </LanguageProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
