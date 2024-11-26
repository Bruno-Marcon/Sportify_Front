import React, { useEffect, useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Stat } from '../types';
import { getUserStats } from '../connection/apiConnection';

const StatsGrid: React.FC = () => {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getUserStats();
        console.log(data)
        setStats(data);
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.label === 'Próximo Jogo' ? Calendar : Clock;
        return (
          <div key={stat.id} className={`bg-green-50  rounded-xl p-4 border border-gray-100`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className='text-green-600 bg-green-50 p-2 rounded-lg'>
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
  );
};

export default StatsGrid;
