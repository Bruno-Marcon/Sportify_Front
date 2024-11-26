import React, { useState, useContext } from 'react';
import { Mail, Lock, CheckCircle, ArrowRight } from 'lucide-react';
import RegisterModal from '../components/RegisterModal';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../connection/apiConnection';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await loginUser(email, password);
      login(response);
      toast.success('Login realizado com sucesso!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });

      if (response.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      toast.error('Email ou senha inválidos. Tente novamente.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Hero Section */}
      <div className="hidden w-2/3 bg-gradient-to-br from-emerald-600 to-emerald-800 lg:block">
        <div className="relative h-full w-full">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative flex h-full flex-col items-center justify-center px-12 text-white">
            <img
              src="src/public/image/logo.png"
              alt="Logo Sportify"
              className="mb-12 h-80 w-auto"
            />
            <h1 className="mb-6 text-center text-5xl font-bold leading-tight">
              Transforme sua paixão por esportes em momentos incríveis
            </h1>
            <p className="mb-12 text-center text-xl text-emerald-100">
              Agende quadras, encontre parceiros e viva experiências esportivas únicas
            </p>
            
            <div className="grid grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 rounded-lg bg-white/10 p-4 backdrop-blur-sm"
                >
                  <CheckCircle className="h-6 w-6 flex-shrink-0 text-emerald-300" />
                  <p className="text-sm text-emerald-50">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full flex-col justify-center bg-white px-8 lg:w-1/3">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Seja bem-vindo!</h2>
            <p className="mt-2 text-gray-600">Entre para continuar sua jornada esportiva</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border-0 bg-gray-50 py-4 pl-12 pr-4 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-500"
                  placeholder="Digite seu e-mail"
                  required
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border-0 bg-gray-50 py-4 pl-12 pr-4 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-500"
                  placeholder="Digite sua senha"
                  required
                />
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">
                    Lembrar-me
                  </label>
                </div>
                <button type="button" className="text-sm text-emerald-600 hover:text-emerald-500">
                  Esqueceu a senha?
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full overflow-hidden rounded-xl bg-emerald-600 px-4 py-4 text-sm font-semibold text-white transition-all hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50"
            >
              <span className="relative flex items-center justify-center">
                {isLoading ? (
                  'Entrando...'
                ) : (
                  <>
                    Entrar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </span>
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500">ou</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsRegisterModalOpen(true)}
              className="w-full rounded-xl border-2 border-emerald-600 bg-transparent px-4 py-4 text-sm font-semibold text-emerald-600 transition-colors hover:bg-emerald-50"
            >
              Criar nova conta
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Ao continuar, você concorda com nossos{' '}
            <a href="#" className="text-emerald-600 hover:text-emerald-500">
              Termos de Serviço
            </a>{' '}
            e{' '}
            <a href="#" className="text-emerald-600 hover:text-emerald-500">
              Política de Privacidade
            </a>
          </p>
        </div>
      </div>

      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </div>
  );
};

const features = [
  'Agende quadras em poucos cliques',
  'Encontre parceiros para jogar',
  'Organize campeonatos e torneios',
  'Acompanhe suas estatísticas'
];

export default Login;