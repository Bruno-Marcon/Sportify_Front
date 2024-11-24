import React, { useState } from 'react';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import RegisterModal from '../components/RegisterModal';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../connection/apiConnection';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

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
    <div className="flex min-h-screen bg-gray-100">
      {/* Coluna Esquerda */}
      <div className="hidden lg:flex w-2/3 bg-gray-900 text-white items-center justify-center">
        <div className="px-20 text-center">
          <h1 className="text-5xl font-bold mb-6 text-green-500">Seja bem-vindo!</h1>
          <p className="text-lg leading-7">
            Seu melhor aplicativo de Agendamento de Quadras
          </p>
        </div>
      </div>

      {/* Coluna Direita */}
      <div className="flex w-full lg:w-1/3 items-center justify-center px-6">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Entre na sua conta</h1>

          <form onSubmit={handleSubmit} className="rounded-xl bg-white p-8 shadow-lg">
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
                  Seu e-mail
                </label>
                <div className="relative mt-1">
                  <Mail className="absolute inset-y-0 left-0 ml-3 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-green-500"
                    placeholder="Digite seu e-mail"
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
                    className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-green-500"
                    placeholder="Digite sua senha"
                    required
                  />
                </div>
                <div className="mt-2 text-right">
                  <button className="text-sm text-green-600 hover:underline">Esqueci minha senha</button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Ainda não possui uma conta?{' '}
                <button
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="font-medium text-green-600 hover:text-green-500"
                >
                  Criar conta
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Modal de Registro */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </div>
  );
};

export default Login;
