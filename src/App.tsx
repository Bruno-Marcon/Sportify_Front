import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import JoinGame from './pages/JoinGame';
import Admin from './components/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute'; 
import ToastProvider from './components/ToastContainer'; 
import { AuthProvider } from './context/AuthContext';
import CourtList from './components/CourtList';
import PublicBookings from './components/PublicBookings';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <ToastProvider />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/join/:gameId" element={<JoinGame />} />
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <div className="flex w-full">
                  <Sidebar />
                  <div className="flex-1">
                    <Header />
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/court" element={<CourtList />} />                    
                      <Route
                        path="/admin"
                        element={
                          <AdminRoute>
                            <Admin />
                          </AdminRoute>
                        }
                      />
                      
                    </Routes>
                  </div>
                  <PublicBookings />
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
