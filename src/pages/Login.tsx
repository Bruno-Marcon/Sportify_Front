import React, { useState } from 'react';
import { Mail, Lock, Calendar, AlertCircle } from 'lucide-react';
import RegisterModal from '../components/RegisterModal'; // Certifique-se de importar o RegisterModal
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../connection/apiConnection';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false); // Estado para controlar o modal

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await loginUser(email, password);

      console.log('Login bem-sucedido:', response);

      localStorage.setItem('token', response.token);

      navigate('/');
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      setError('Email ou senha inválidos. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-6 flex items-center justify-center">
          <Calendar className="h-10 w-10 text-emerald-600" />
          <h1 className="ml-2 text-3xl font-bold text-gray-900">Sportify</h1>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="rounded-xl bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">Faça login</h2>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Campo de Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative mt-1">
                <Mail className="absolute inset-y-0 left-0 ml-3 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder="email@exemplo.com"
                  required
                />
              </div>
            </div>

            {/* Campo de Senha */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="relative mt-1">
                <Lock className="absolute inset-y-0 left-0 ml-3 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {/* Link de Registro */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Não tem uma conta?{' '}
            <button
              onClick={() => setIsRegisterModalOpen(true)} // Abre o modal
              className="font-medium text-emerald-600 hover:text-emerald-500"
            >
              Registre-se
            </button>
          </p>
        </div>
      </div>

      {/* Modal de Registro */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)} // Fecha o modal
      />
    </div>
  );
};

export default Login;
