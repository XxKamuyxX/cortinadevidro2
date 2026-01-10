/**
 * Landing Page Component
 * 
 * Marketing/Public homepage.
 * Simulates: src/app/(marketing)/page.tsx (Next.js Route Group)
 * Uses MarketingLayout (no sidebar).
 */

import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { 
  CheckCircle2, 
  ArrowRight, 
  Users, 
  FileText, 
  ClipboardList, 
  Calendar, 
  BarChart, 
  DollarSign,
  Shield,
  Zap,
  Smartphone,
  Cloud
} from 'lucide-react';
import { SEGMENTS } from '../config/segments';
import * as LucideIcons from 'lucide-react';

// Helper function to get icon component by name (for profession grid)
const getIconComponent = (iconName: string) => {
  const IconComponent = (LucideIcons as any)[iconName];
  if (IconComponent) {
    return IconComponent;
  }
  return LucideIcons.Wrench; // Fallback
};

export function Landing() {
  // Get all segments for profession grid
  const segments = Object.entries(SEGMENTS).map(([key, config]) => ({
    id: key,
    ...config
  }));

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy via-primary to-primary-dark text-white py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              O Sistema Definitivo para{' '}
              <span className="bg-gradient-to-r from-blue-200 to-blue-100 bg-clip-text text-transparent">
                Vidraceiros
              </span>{' '}
              e Prestadores
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-2xl mx-auto">
              Gerencie clientes, orçamentos e ordens de serviço de forma profissional. 
              Tudo em um só lugar, simples e eficiente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link to="/signup">
                <Button variant="secondary" size="lg" className="flex items-center gap-2 w-full sm:w-auto">
                  Testar Grátis - 7 Dias
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20 w-full sm:w-auto">
                  Já tenho conta
                </Button>
              </Link>
            </div>
            <p className="text-sm text-blue-200 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Sem cartão de crédito necessário • Teste por 7 dias grátis • Cancele quando quiser
            </p>
          </div>
        </div>
      </section>

      {/* Grid de Profissões */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-navy mb-4">
              Feito para Profissionais
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Seja qual for sua área de atuação, temos a solução perfeita para você
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {segments.map((segment) => {
              const IconComponent = getIconComponent(segment.visualCategories[0]?.icon || 'Wrench');
              return (
                <div 
                  key={segment.id}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all text-center border border-slate-200 hover:border-primary/30 group"
                >
                  <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:from-primary/20 group-hover:to-primary/10 transition-colors">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-navy text-base">{segment.label}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-navy mb-4">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Ferramentas poderosas para gerenciar seu negócio de forma eficiente e profissional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border border-blue-100 hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">Gestão de Clientes</h3>
              <p className="text-slate-600">
                Cadastre e gerencie seus clientes de forma organizada. Histórico completo de interações, condomínios VIP e muito mais.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 border border-green-100 hover:shadow-lg transition-shadow">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">Orçamentos Profissionais</h3>
              <p className="text-slate-600">
                Crie orçamentos detalhados com construtor visual intuitivo. Gere PDFs profissionais automaticamente e envie por WhatsApp.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-6 border border-purple-100 hover:shadow-lg transition-shadow">
              <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <ClipboardList className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">Ordens de Serviço</h3>
              <p className="text-slate-600">
                Acompanhe todas as suas ordens de serviço. Sistema completo de aprovação pública, rastreamento e histórico detalhado.
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-white rounded-xl p-6 border border-yellow-100 hover:shadow-lg transition-shadow">
              <div className="bg-yellow-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">Controle Financeiro</h3>
              <p className="text-slate-600">
                Gerencie receitas, despesas e relatórios financeiros. Visão completa da saúde financeira do seu negócio.
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-white rounded-xl p-6 border border-red-100 hover:shadow-lg transition-shadow">
              <div className="bg-red-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">Agenda Integrada</h3>
              <p className="text-slate-600">
                Organize seus compromissos e serviços. Calendário visual, lembretes automáticos e sincronização em tempo real.
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl p-6 border border-indigo-100 hover:shadow-lg transition-shadow">
              <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <BarChart className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">Relatórios e Análises</h3>
              <p className="text-slate-600">
                Dashboards completos com métricas importantes. Tome decisões baseadas em dados reais do seu negócio.
              </p>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-white rounded-xl p-6 border border-teal-100 hover:shadow-lg transition-shadow">
              <div className="bg-teal-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">Integração WhatsApp</h3>
              <p className="text-slate-600">
                Envie orçamentos e ordens de serviço diretamente pelo WhatsApp. Compartilhe links de aprovação pública.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-6 border border-orange-100 hover:shadow-lg transition-shadow">
              <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Cloud className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">Armazenamento em Nuvem</h3>
              <p className="text-slate-600">
                Todos os seus dados seguros na nuvem. Acesse de qualquer lugar, a qualquer momento.
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-white rounded-xl p-6 border border-pink-100 hover:shadow-lg transition-shadow">
              <div className="bg-pink-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">Segurança Total</h3>
              <p className="text-slate-600">
                Seus dados protegidos com criptografia de ponta a ponta. Backup automático e recuperação garantida.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-navy mb-4">
              Preços Simples e Transparentes
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Um plano, todas as funcionalidades. Sem surpresas.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border-2 border-primary/20 relative overflow-hidden">
              {/* Badge */}
              <div className="absolute top-0 right-0 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-bl-lg">
                <span className="text-sm font-semibold">⭐ Mais Popular</span>
              </div>

              <div className="text-center mb-8 mt-4">
                <h3 className="text-3xl font-bold text-navy mb-2">Plano Premium</h3>
                <div className="flex items-baseline justify-center gap-2 mb-4">
                  <span className="text-6xl font-bold bg-gradient-to-r from-navy to-primary bg-clip-text text-transparent">
                    R$ 40
                  </span>
                  <span className="text-slate-600 text-xl">/mês</span>
                </div>
                <p className="text-slate-600 mb-6 text-lg">
                  Ideal para empresas de todos os tamanhos
                </p>
                
                {/* Trial Badge */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 mb-6">
                  <p className="text-lg font-bold text-green-800 mb-1 flex items-center justify-center gap-2">
                    <Zap className="w-5 h-5" />
                    7 dias grátis para testar
                  </p>
                  <p className="text-sm text-green-700">
                    Sem compromisso. Cancele quando quiser.
                  </p>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  'Gestão completa de clientes ilimitados',
                  'Orçamentos profissionais ilimitados',
                  'Ordens de serviço completas',
                  'Controle financeiro avançado',
                  'Agenda e calendário integrado',
                  'Relatórios e dashboards em tempo real',
                  'Integração WhatsApp',
                  'Armazenamento em nuvem ilimitado',
                  'Suporte prioritário',
                  'Atualizações gratuitas para sempre'
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/signup" className="block">
                <Button variant="primary" size="lg" className="w-full flex items-center justify-center gap-2 py-4 text-lg">
                  Começar Agora - 7 Dias Grátis
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>

              <p className="text-xs text-center text-slate-500 mt-4">
                Pagamento via Cartão de Crédito ou Boleto • Renovação automática mensal • Cancele a qualquer momento
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-navy mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Tire suas dúvidas sobre o Gestor Vítreo
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                q: 'Como funciona o período de teste de 7 dias?',
                a: 'Você pode testar todas as funcionalidades do sistema por 7 dias completamente grátis. Não é necessário cartão de crédito para começar. Após o período de teste, a assinatura mensal é ativada automaticamente por apenas R$ 40/mês.'
              },
              {
                q: 'Posso cancelar a qualquer momento?',
                a: 'Sim! Você pode cancelar sua assinatura a qualquer momento, sem taxas ou multas. Seu acesso permanece ativo até o fim do período já pago.'
              },
              {
                q: 'Meus dados estão seguros?',
                a: 'Absolutamente. Utilizamos criptografia de ponta a ponta e armazenamento seguro em nuvem. Seus dados são seus e apenas seus. Fazemos backup automático todos os dias.'
              },
              {
                q: 'Funciona no celular?',
                a: 'Sim! O Gestor Vítreo é totalmente responsivo e funciona perfeitamente em smartphones, tablets e computadores. Acesse de qualquer lugar, a qualquer momento.'
              },
              {
                q: 'Preciso de treinamento para usar?',
                a: 'Não! O sistema foi projetado para ser intuitivo e fácil de usar. Em poucos minutos você já estará criando orçamentos e gerenciando clientes. Oferecemos também suporte por email e WhatsApp.'
              },
              {
                q: 'Posso usar para múltiplas empresas?',
                a: 'Cada assinatura é para uma empresa. Se você tem múltiplas empresas, precisará de uma assinatura para cada uma. Oferecemos descontos para múltiplas assinaturas - entre em contato conosco.'
              },
              {
                q: 'E se eu precisar de funcionalidades específicas?',
                a: 'Estamos sempre desenvolvendo novas funcionalidades baseadas no feedback dos usuários. Se você tem uma necessidade específica, entre em contato conosco e vamos avaliar como podemos ajudar.'
              },
              {
                q: 'Quais formas de pagamento são aceitas?',
                a: 'Aceitamos pagamento via Cartão de Crédito (recomendado para o período de teste) ou Boleto bancário. O pagamento é processado de forma segura através do Stripe.'
              }
            ].map((item, index) => (
              <div key={index} className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                <h3 className="font-bold text-navy mb-2 text-lg">{item.q}</h3>
                <p className="text-slate-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-navy via-primary to-primary-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Pronto para transformar seu negócio?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Junte-se a centenas de profissionais que já usam o Gestor Vítreo para gerenciar seus negócios de forma mais eficiente
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link to="/signup">
              <Button variant="secondary" size="lg" className="flex items-center gap-2 w-full sm:w-auto">
                Criar Conta Grátis - 7 Dias
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20 w-full sm:w-auto">
                Já tenho conta
              </Button>
            </Link>
          </div>
          <p className="text-sm text-blue-200 flex items-center justify-center gap-2 flex-wrap">
            <CheckCircle2 className="w-4 h-4" />
            Setup em 2 minutos • Sem compromisso • Suporte incluso
          </p>
        </div>
      </section>
    </div>
  );
}
