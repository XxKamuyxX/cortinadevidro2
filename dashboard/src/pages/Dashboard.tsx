import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FileText, Users, ClipboardList, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Dashboard() {
  const [stats, setStats] = useState({
    openQuotes: 0,
    monthlyRevenue: 0,
    activeWorkOrders: 0,
  });

  useEffect(() => {
    // TODO: Fetch real stats from Firestore
    // This is a placeholder
    setStats({
      openQuotes: 5,
      monthlyRevenue: 12500,
      activeWorkOrders: 3,
    });
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-navy">Dashboard</h1>
            <p className="text-slate-600 mt-1">Visão geral do seu negócio</p>
          </div>
          <Link to="/quotes/new">
            <Button variant="primary" size="lg" className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Novo Orçamento
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Orçamentos Abertos</p>
                <p className="text-3xl font-bold text-navy">{stats.openQuotes}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Faturamento do Mês</p>
                <p className="text-3xl font-bold text-navy">{formatCurrency(stats.monthlyRevenue)}</p>
              </div>
              <div className="bg-gold-100 rounded-full p-3">
                <ClipboardList className="w-8 h-8 text-gold-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">OS em Andamento</p>
                <p className="text-3xl font-bold text-navy">{stats.activeWorkOrders}</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <h2 className="text-xl font-bold text-navy mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/quotes/new">
              <div className="p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-navy hover:bg-navy-50 transition-colors cursor-pointer text-center">
                <Plus className="w-8 h-8 text-navy mx-auto mb-2" />
                <p className="font-medium text-navy">Novo Orçamento</p>
              </div>
            </Link>
            <Link to="/clients/new">
              <div className="p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-navy hover:bg-navy-50 transition-colors cursor-pointer text-center">
                <Users className="w-8 h-8 text-navy mx-auto mb-2" />
                <p className="font-medium text-navy">Novo Cliente</p>
              </div>
            </Link>
            <Link to="/quotes">
              <div className="p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-navy hover:bg-navy-50 transition-colors cursor-pointer text-center">
                <FileText className="w-8 h-8 text-navy mx-auto mb-2" />
                <p className="font-medium text-navy">Ver Orçamentos</p>
              </div>
            </Link>
            <Link to="/work-orders">
              <div className="p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-navy hover:bg-navy-50 transition-colors cursor-pointer text-center">
                <ClipboardList className="w-8 h-8 text-navy mx-auto mb-2" />
                <p className="font-medium text-navy">Ver OS</p>
              </div>
            </Link>
          </div>
        </Card>
      </div>
    </Layout>
  );
}

