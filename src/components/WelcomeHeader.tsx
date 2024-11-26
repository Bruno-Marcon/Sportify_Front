import { useState, useEffect } from 'react';
import { Bell, Calendar, Clock } from 'lucide-react';
import { getCourts } from '../connection/apiConnection';
import { getUserInfo } from '../connection/apiConnection'; // Função para obter dados do usuário
import { Court } from '../types/index';
import { UserAttributes } from '../types/index';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules'; // Importa o Autoplay do Swiper
import BookingModal from './BookingModal';
import ShareModal from './ShareModal';
import 'swiper/swiper-bundle.css';

export default function WelcomeHeader() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [user, setUser] = useState<UserAttributes | null>(null); // Estado para o usuário logado

  const limit = 3; // Exibir 3 quadras por slide

  useEffect(() => {
    // Carregar informações das quadras
    const fetchCourts = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const data = await getCourts(1, 15);
        setCourts(data.courts);
      } catch (error) {
        console.error('Erro ao carregar quadras:', error);
        setErrorMessage('Erro ao carregar quadras. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    // Carregar informações do usuário
    const fetchUser = async () => {
      try {
        const userData = await getUserInfo();
        setUser(userData.data.attributes);
      } catch (error) {
        console.error('Erro ao carregar informações do usuário:', error);
      }
    };

    fetchCourts();
    fetchUser();
  }, []);

  const stats = [
    {
      id: 1,
      label: 'Próximo Jogo',
      value: 'Hoje, 19h',
      info: 'Quadra Society 2',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      id: 2,
      label: 'Tempo em Quadra',
      value: '24h',
      info: 'Este mês',
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  const openBookingModal = (court: Court) => {
    setSelectedCourt(court);
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setSelectedCourt(null);
    setIsBookingModalOpen(false);
  };

  const handleBookingComplete = (shareableLink: string) => {
    setIsBookingModalOpen(false);
    setShareLink(shareableLink);
    setIsShareModalOpen(true);
  };

  const closeShareModal = () => {
    setShareLink(null);
    setIsShareModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-lg p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">
              {user ? `Olá, ${user.name}! 👋` : 'Olá! 👋'}
            </h1>
            <p className="mt-2 text-green-100">
              Pronto para mais um jogo? Confira as quadras disponíveis agora
            </p>
          </div>
          <button className="relative p-2 text-white hover:bg-green-500 rounded-full transition-colors">
            <Bell className="h-6 w-6" />
            <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full border-2 border-green-600">
              3
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.id} className={`${stat.bgColor} rounded-xl p-4 border border-gray-100`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`${stat.color} ${stat.bgColor} p-2 rounded-lg`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="mt-1 text-xl font-semibold text-gray-900">{stat.value}</p>
                <p className="mt-1 text-sm text-gray-500">{stat.info}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Quadras em Destaque</h2>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-500">Carregando quadras em destaque...</p>
        ) : errorMessage ? (
          <p className="text-center text-red-500">{errorMessage}</p>
        ) : (
          <Swiper
            spaceBetween={20}
            slidesPerView={1}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            modules={[Autoplay]}
          >
            {Array.from({ length: Math.ceil(courts.length / limit) }, (_, index) => {
              const courtSlice = courts.slice(index * limit, index * limit + limit);
              return (
                <SwiperSlide key={index}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {courtSlice.map((court) => (
                      <div
                        key={court.id}
                        className="group relative rounded-lg overflow-hidden cursor-pointer"
                        onClick={() => openBookingModal(court)}
                      >
                        <img
                          src={'src/public/image/logo.png'}
                          alt={court.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-white font-semibold">{court.name}</h3>
                          <p className="text-green-100 text-sm">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            }).format(court.price)}
                          </p>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                          <p className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                            Reservar Agora
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </div>

      {selectedCourt && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={closeBookingModal}
          court={selectedCourt}
          onBookingComplete={(link: string) => handleBookingComplete(link)}
        />
      )}

      {shareLink && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={closeShareModal}
          bookingLink={shareLink}
          date={new Date().toLocaleDateString('pt-BR')}
          time={'19:00'}
          service={selectedCourt?.name || 'Serviço não informado'}
        />
      )}
    </div>
  );
}
