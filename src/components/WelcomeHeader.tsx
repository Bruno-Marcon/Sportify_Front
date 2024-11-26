import React from 'react';
import { Bell, Calendar, Trophy, Clock, Target } from 'lucide-react';

export default function WelcomeHeader() {
  const stats = [
    {
      id: 1,
      label: 'Próximo Jogo',
      value: 'Hoje, 19h',
      info: 'Quadra Society 2',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 2,
      label: 'Tempo em Quadra',
      value: '24h',
      info: 'Este mês',
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 3,
      label: 'Nível do Jogador',
      value: 'Ouro',
      info: '450 pontos',
      icon: Trophy,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      id: 4,
      label: 'Meta Mensal',
      value: '80%',
      info: '8/10 jogos',
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-lg p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">
              Olá, João! 👋
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
          <button className="text-green-600 hover:text-green-700 text-sm font-medium">
            Ver todas
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredCourts.map((court) => (
            <div key={court.id} className="group relative rounded-lg overflow-hidden">
              <img
                src={court.image}
                alt={court.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-semibold">{court.name}</h3>
                <p className="text-green-100 text-sm">{court.price}</p>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Reservar Agora
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const featuredCourts = [
  {
    id: 1,
    name: 'Quadra Society Premium',
    price: 'R$ 120/hora',
    image: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    name: 'Quadra Futsal Coberta',
    price: 'R$ 100/hora',
    image: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    name: 'Quadra Vôlei Indoor',
    price: 'R$ 90/hora',
    image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  }
];