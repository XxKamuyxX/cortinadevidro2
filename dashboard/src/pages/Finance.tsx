import { Layout } from '../components/Layout';
import { Card } from '../components/ui/Card';
import { DollarSign, TrendingUp, CreditCard, Receipt, Target } from 'lucide-react';
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface FinanceStats {
  faturamento: number;
  contasAPagar: number;
  contasPagas: number;
  valoresAReceber: number;
  recebido: number;
  lucroLiquido: number;
  margemLiquida: number;
  margemBruta: number;
  investimentoMarketing: number;
  maoDeObra: number;
  alimentacao: number;
  estacionamento: number;
  ferramentas: number;
  outrasDespesas: number;
}

export function Finance() {
  const [stats, setStats] = useState<FinanceStats>({
    faturamento: 0,
    contasAPagar: 0,
    contasPagas: 0,
    valoresAReceber: 0,
    recebido: 0,
    lucroLiquido: 0,
    margemLiquida: 0,
    margemBruta: 0,
    investimentoMarketing: 0,
    maoDeObra: 0,
    alimentacao: 0,
    estacionamento: 0,
    ferramentas: 0,
    outrasDespesas: 0,
  });
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'month' | 'year'>('month');

  useEffect(() => {
    loadFinanceData();
  }, [period]);

  const loadFinanceData = async () => {
    try {
      // Carregar orçamentos aprovados (faturamento)
      const quotesSnapshot = await getDocs(collection(db, 'quotes'));
      const approvedQuotes = quotesSnapshot.docs
        .map((doc) => doc.data())
        .filter((quote) => quote.status === 'approved');

      const faturamento = approvedQuotes.reduce((sum, quote) => sum + (quote.total || 0), 0);
      const valoresAReceber = approvedQuotes
        .filter((quote) => !quote.paid)
        .reduce((sum, quote) => sum + (quote.total || 0), 0);
      const recebido = approvedQuotes
        .filter((quote) => quote.paid)
        .reduce((sum, quote) => sum + (quote.total || 0), 0);

      // Carregar despesas (collection 'expenses')
      let contasAPagar = 0;
      let contasPagas = 0;
      let investimentoMarketing = 0;
      let maoDeObra = 0;
      let alimentacao = 0;
      let estacionamento = 0;
      let ferramentas = 0;
      let outrasDespesas = 0;

      try {
        const expensesSnapshot = await getDocs(collection(db, 'expenses'));
        expensesSnapshot.docs.forEach((doc) => {
          const expense = doc.data();
          const amount = expense.amount || 0;

          if (expense.paid) {
            contasPagas += amount;
          } else {
            contasAPagar += amount;
          }

          // Categorizar despesas
          switch (expense.category) {
            case 'marketing':
              investimentoMarketing += amount;
              break;
            case 'mao-de-obra':
            case 'mão de obra':
              maoDeObra += amount;
              break;
            case 'alimentacao':
            case 'alimentação':
              alimentacao += amount;
              break;
            case 'estacionamento':
              estacionamento += amount;
              break;
            case 'ferramentas':
              ferramentas += amount;
              break;
            default:
              outrasDespesas += amount;
          }
        });
      } catch (error) {
        console.error('Error loading expenses:', error);
      }

      // Calcular margens
      const custos = contasPagas; // Custo total
      const margemBruta = faturamento > 0 ? ((faturamento - custos) / faturamento) * 100 : 0;
      const lucroLiquido = faturamento - custos - investimentoMarketing;
      const margemLiquida = faturamento > 0 ? (lucroLiquido / faturamento) * 100 : 0;

      setStats({
        faturamento,
        contasAPagar,
        contasPagas,
        valoresAReceber,
        recebido,
        lucroLiquido,
        margemLiquida,
        margemBruta,
        investimentoMarketing,
        maoDeObra,
        alimentacao,
        estacionamento,
        ferramentas,
        outrasDespesas,
      });
    } catch (error) {
      console.error('Error loading finance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <Layout>
        <Card>
          <p className="text-center text-slate-600 py-8">Carregando dados financeiros...</p>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-navy">Financeiro</h1>
            <p className="text-slate-600 mt-1">Gestão financeira completa</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPeriod('month')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                period === 'month'
                  ? 'bg-navy text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Mês
            </button>
            <button
              onClick={() => setPeriod('year')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                period === 'year'
                  ? 'bg-navy text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Ano
            </button>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Faturamento */}
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Faturamento</p>
                <p className="text-3xl font-bold text-navy">{formatCurrency(stats.faturamento)}</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </Card>

          {/* Contas a Pagar */}
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Contas a Pagar</p>
                <p className="text-3xl font-bold text-red-600">{formatCurrency(stats.contasAPagar)}</p>
              </div>
              <div className="bg-red-100 rounded-full p-3">
                <CreditCard className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </Card>

          {/* Contas Pagas */}
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Contas Pagas</p>
                <p className="text-3xl font-bold text-slate-700">{formatCurrency(stats.contasPagas)}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <Receipt className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </Card>

          {/* Valores a Receber */}
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Valores a Receber</p>
                <p className="text-3xl font-bold text-amber-600">{formatCurrency(stats.valoresAReceber)}</p>
              </div>
              <div className="bg-amber-100 rounded-full p-3">
                <TrendingUp className="w-8 h-8 text-amber-600" />
              </div>
            </div>
          </Card>

          {/* Recebido */}
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Recebido</p>
                <p className="text-3xl font-bold text-green-600">{formatCurrency(stats.recebido)}</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </Card>

          {/* Lucro Líquido */}
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Lucro Líquido</p>
                <p className={`text-3xl font-bold ${stats.lucroLiquido >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(stats.lucroLiquido)}
                </p>
              </div>
              <div className={`rounded-full p-3 ${stats.lucroLiquido >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                <TrendingUp className={`w-8 h-8 ${stats.lucroLiquido >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </div>
          </Card>

          {/* Margem Líquida */}
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Margem Líquida</p>
                <p className="text-3xl font-bold text-navy">{formatPercent(stats.margemLiquida)}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </Card>

          {/* Margem Bruta */}
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Margem Bruta</p>
                <p className="text-3xl font-bold text-navy">{formatPercent(stats.margemBruta)}</p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </Card>

          {/* Investimento Marketing */}
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Investimento Marketing</p>
                <p className="text-3xl font-bold text-gold">{formatCurrency(stats.investimentoMarketing)}</p>
              </div>
              <div className="bg-gold-100 rounded-full p-3">
                <Target className="w-8 h-8 text-gold-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Info Card */}
        <Card>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Nota:</strong> Para registrar despesas, crie uma collection "expenses" no Firestore com os campos: 
              amount (number), paid (boolean), category (string: 'marketing', 'mao-de-obra', 'alimentacao', 'estacionamento', 'ferramentas', ou outro), 
              date (Timestamp), description (string).
            </p>
          </div>
        </Card>
      </div>
    </Layout>
  );
}

