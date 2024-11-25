import React, { useState } from 'react';
import { Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
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
    <div className="flex min-h-screen">
      {/* Coluna Esquerda */}
      <div className="hidden w-2/3 flex-col bg-emerald-700 text-white lg:flex">
        <div className="flex flex-grow flex-col items-center justify-center px-20 text-center">
          <img
            src="src\public\image\logo.png"
            alt="Logo Sportify"
            className="mb-8 w-48 h-auto"
          />
          <h1 className="mb-4 text-5xl font-bold">Bem-vindo ao Sportify!</h1>
          <p className="mb-8 text-xl">
            O melhor aplicativo para agendamento de quadras esportivas.
          </p>

          {/* Lista de benefícios */}
          <ul className="space-y-4 text-left">
            <li className="flex items-center">
              <CheckCircle className="mr-2 h-6 w-6 text-white" />
              <span className="text-lg">Agende quadras de forma rápida e fácil</span>
            </li>
            <li className="flex items-center">
              <CheckCircle className="mr-2 h-6 w-6 text-white" />
              <span className="text-lg">Encontre jogadores para completar seu time</span>
            </li>
            <li className="flex items-center">
              <CheckCircle className="mr-2 h-6 w-6 text-white" />
              <span className="text-lg">Participe de reservas públicas</span>
            </li>
          </ul>
        </div>
        <div className="p-6 text-center">
          <p className="text-sm">&copy; 2023 Sportify. Todos os direitos reservados.</p>
        </div>
      </div>

      {/* Coluna Direita */}
      <div className="flex w-full items-center justify-center bg-gray-100 px-6 lg:w-1/3">
        <div className="w-full max-w-md">
          <h1 className="mb-6 text-center text-3xl font-bold text-gray-900">
            Entre na sua conta
          </h1>

          <form onSubmit={handleSubmit} className="rounded-xl bg-white p-8 shadow-lg">
            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                <AlertCircle className="h-5 w-5" />
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
                    className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500"
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
                    className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500"
                    placeholder="Digite sua senha"
                    required
                  />
                </div>
                <div className="mt-2 text-right">
                  <button className="text-sm text-emerald-600 hover:underline">
                    Esqueci minha senha
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Ainda não possui uma conta?{' '}
                <button
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="font-medium text-emerald-600 hover:text-emerald-500"
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
