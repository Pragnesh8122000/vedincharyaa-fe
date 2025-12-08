import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ShlokListPage from './pages/ShlokListPage'
import ShlokDetailPage from './pages/ShlokDetailPage'
import FavoritesPage from './pages/FavoritesPage'
import SettingsPage from './pages/SettingsPage'

import HistoryPage from './pages/HistoryPage'
import MemorizationPage from './pages/MemorizationPage'

import { AuthProvider } from './context/AuthContext';
import SignupPage from './pages/SignupPage';
import VerifyOtpPage from './pages/VerifyOtpPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage'; // Imported 404 Page
import { ToastProvider } from './providers/ToastProvider';
import AxiosInterceptor from './components/common/AxiosInterceptor';
import ProtectedRoute from './components/common/ProtectedRoute'; // Imported ProtectedRoute

function App() {
  return (
    <ToastProvider>
      <AxiosInterceptor />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* Public Auth Routes */}
              <Route path="signup" element={<SignupPage />} />
              <Route path="verify-otp" element={<VerifyOtpPage />} />
              <Route path="login" element={<LoginPage />} />

              {/* Protected Routes */}
              <Route index element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
              <Route path="browse" element={<ProtectedRoute><ShlokListPage /></ProtectedRoute>} />
              <Route path="shlok/:chapter/:verse" element={<ProtectedRoute><ShlokDetailPage /></ProtectedRoute>} />
              <Route path="favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
              <Route path="history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
              <Route path="memorize" element={<ProtectedRoute><MemorizationPage /></ProtectedRoute>} />
              <Route path="settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

              {/* Catch all - 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App
