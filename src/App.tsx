// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
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

const Layout: React.FC = () => (
  <div className="flex flex-col lg:flex-row w-full min-h-screen overflow-hidden">
    {/* Sidebar Responsivo */}
    <Sidebar />

    {/* Conteúdo Principal */}
    <div className="flex-1 flex flex-col">
      {/* Header Responsivo */}
      <Header />

      {/* Rotas Internas */}
      <div className="flex-1 p-4 sm:p-6 bg-gray-50 overflow-auto">
        <Outlet />
      </div>
    </div>

    {/* Reservas Públicas (Sidebar Direita Responsiva) */}
    <div className="lg:w-80 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 overflow-hidden">
      <PublicBookings />
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <ToastProvider />
        <Routes>
          {/* Rota de Login */}
          <Route path="/login" element={<Login />} />

          {/* Rota para Participar de um Jogo */}
          <Route path="/join/:gameId" element={<JoinGame />} />

          {/* Rotas Protegidas */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* Página Inicial */}
            <Route index element={<HomePage />} />

            {/* Lista de Quadras */}
            <Route path="court" element={<CourtList />} />

            {/* Rota Administrativa */}
            <Route
              path="admin"
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              }
            />
            {/* Adicione outras rotas protegidas aqui */}
          </Route>

          {/* Rota Padrão para Páginas Não Encontradas */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
