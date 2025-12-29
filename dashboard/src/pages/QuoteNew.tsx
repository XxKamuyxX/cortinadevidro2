import { Layout } from '../components/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Save, Trash2, Download } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import { QuotePDF } from '../components/QuotePDF';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface Service {
  id: string;
  name: string;
  description: string;
  type: 'fixed' | 'unit' | 'meter';
  defaultPrice?: number;
}

const SERVICES: Service[] = [
  {
    id: 'troca-roldanas',
    name: 'Troca de Roldanas',
    description: 'Substituição por roldanas premium',
    type: 'unit',
    defaultPrice: 50,
  },
  {
    id: 'vedacao-completa',
    name: 'Vedação Completa',
    description: 'Substituição completa da vedação',
    type: 'unit',
    defaultPrice: 35,
  },
  {
    id: 'higienizacao-blindagem',
    name: 'Higienização e Blindagem',
    description: 'Limpeza profunda e blindagem nos trilhos',
    type: 'unit',
    defaultPrice: 450,
  },
  {
    id: 'colagem-vidro',
    name: 'Colagem de Vidro',
    description: 'Colagem profissional de vidros soltos',
    type: 'unit',
    defaultPrice: 120,
  },
  {
    id: 'visita-tecnica',
    name: 'Visita Técnica/Diagnóstico',
    description: 'Diagnóstico completo do sistema',
    type: 'unit',
    defaultPrice: 150,
  },
];

interface Client {
  id: string;
  name: string;
  address: string;
  condominium: string;
  phone: string;
  email: string;
}

interface QuoteItem {
  serviceId: string;
  serviceName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export function QuoteNew() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [status, setStatus] = useState<'draft' | 'sent' | 'approved' | 'cancelled'>('draft');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClients();
    if (id) {
      loadQuote(id);
    } else {
      setLoading(false);
    }
  }, [id]);

  const loadClients = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'clients'));
      const clientsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Client[];
      setClients(clientsData);
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const loadQuote = async (quoteId: string) => {
    try {
      const docRef = doc(db, 'quotes', quoteId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSelectedClientId(data.clientId);
        setItems(data.items || []);
        setDiscount(data.discount || 0);
        setStatus(data.status || 'draft');
      }
    } catch (error) {
      console.error('Error loading quote:', error);
    } finally {
      setLoading(false);
    }
  };

  const addService = (service: Service) => {
    const newItem: QuoteItem = {
      serviceId: service.id,
      serviceName: service.name,
      quantity: 1,
      unitPrice: service.defaultPrice || 0,
      total: service.defaultPrice || 0,
    };
    setItems([...items, newItem]);
  };

  const updateItem = (index: number, field: 'quantity' | 'unitPrice', value: number) => {
    const newItems = [...items];
    const item = newItems[index];
    
    if (field === 'quantity') {
      item.quantity = value;
      item.total = item.quantity * item.unitPrice;
    } else if (field === 'unitPrice') {
      item.unitPrice = value;
      item.total = item.quantity * item.unitPrice;
    }
    
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const total = subtotal - discount;

  const handleSave = async () => {
    if (!selectedClientId) {
      alert('Selecione um cliente');
      return;
    }

    const selectedClient = clients.find((c) => c.id === selectedClientId);
    if (!selectedClient) return;

    try {
      const quoteData: QuoteData = {
        clientId: selectedClientId,
        clientName: selectedClient.name,
        items,
        subtotal,
        discount,
        total,
        status,
        warranty: warranty || undefined,
        observations: observations || undefined,
        createdAt: id ? undefined : new Date(),
        updatedAt: new Date(),
      };

      if (id) {
        await updateDoc(doc(db, 'quotes', id), quoteData);
      } else {
        await addDoc(collection(db, 'quotes'), quoteData);
      }

      navigate('/quotes');
    } catch (error) {
      console.error('Error saving quote:', error);
      alert('Erro ao salvar orçamento');
    }
  };

  const handleGeneratePDF = async () => {
    if (!selectedClientId || items.length === 0) {
      alert('Complete o orçamento antes de gerar o PDF');
      return;
    }

    const selectedClient = clients.find((c) => c.id === selectedClientId);
    if (!selectedClient) return;

    try {
      const doc = (
        <QuotePDF
          clientName={selectedClient.name}
          clientAddress={selectedClient.address}
          clientCondominium={selectedClient.condominium}
          clientPhone={selectedClient.phone}
          clientEmail={selectedClient.email}
          items={items}
          subtotal={subtotal}
          discount={discount}
          total={total}
          quoteNumber={id || undefined}
          createdAt={new Date()}
        />
      );

      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Orcamento_${selectedClient.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Erro ao gerar PDF');
    }
  };

  if (loading) {
    return (
      <Layout>
        <Card>
          <p className="text-center text-slate-600 py-8">Carregando...</p>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-navy">
              {id ? 'Editar Orçamento' : 'Novo Orçamento'}
            </h1>
            <p className="text-slate-600 mt-1">Crie e gerencie seus orçamentos</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/quotes')}>
              Cancelar
            </Button>
            <Button
              variant="secondary"
              onClick={handleGeneratePDF}
              className="flex items-center gap-2"
              disabled={!selectedClientId || items.length === 0}
            >
              <Download className="w-5 h-5" />
              Gerar PDF
            </Button>
            <Button variant="primary" onClick={handleSave} className="flex items-center gap-2">
              <Save className="w-5 h-5" />
              Salvar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Client Selection */}
            <Card>
              <h2 className="text-xl font-bold text-navy mb-4">Cliente</h2>
              <Select
                label="Selecione o Cliente"
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                options={[
                  { value: '', label: 'Selecione um cliente...' },
                  ...clients.map((client) => ({
                    value: client.id,
                    label: `${client.name} - ${client.condominium}`,
                  })),
                ]}
                required
              />
            </Card>

            {/* Services */}
            <Card>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-navy">Serviços</h2>
              </div>

              {/* Add Service */}
              <div className="mb-4 p-4 border-2 border-dashed border-slate-300 rounded-lg">
                <p className="text-sm text-slate-600 mb-3">Adicionar Serviço:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SERVICES.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => addService(service)}
                      className="text-left p-3 border border-slate-200 rounded-lg hover:border-navy hover:bg-navy-50 transition-colors"
                    >
                      <div className="font-medium text-navy">{service.name}</div>
                      <div className="text-xs text-slate-600">{service.description}</div>
                      <div className="text-xs text-gold font-medium mt-1">
                        {service.type === 'fixed'
                          ? `R$ ${service.defaultPrice?.toFixed(2)}`
                          : service.type === 'meter'
                          ? `R$ ${service.defaultPrice?.toFixed(2)}/m`
                          : `R$ ${service.defaultPrice?.toFixed(2)}/un`}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Items List */}
              {items.length === 0 ? (
                <p className="text-center text-slate-600 py-8">
                  Nenhum serviço adicionado. Selecione um serviço acima.
                </p>
              ) : (
                <div className="space-y-4">
                  {items.map((item, index) => {
                    const service = SERVICES.find((s) => s.id === item.serviceId);
                    const isFixed = service?.type === 'fixed';
                    const isMeter = service?.type === 'meter';

                    return (
                      <div
                        key={index}
                        className="p-4 border border-slate-200 rounded-lg bg-slate-50"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-navy">{item.serviceName}</h3>
                              {item.isCustom && (
                                <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                                  Manual
                                </span>
                              )}
                            </div>
                            {service?.description && !item.isCustom && (
                              <p className="text-sm text-slate-600">{service.description}</p>
                            )}
                          </div>
                          <button
                            onClick={() => removeItem(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs text-slate-600 mb-1">
                              Quantidade
                            </label>
                            <input
                              type="number"
                              min="1"
                              step="1"
                              value={item.quantity}
                              onChange={(e) =>
                                updateItem(index, 'quantity', parseFloat(e.target.value) || 1)
                              }
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-slate-600 mb-1">
                              Preço / Unidade
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.unitPrice}
                              onChange={(e) =>
                                updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)
                              }
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-slate-600 mb-1">Total</label>
                            <div className="px-3 py-2 bg-white border border-slate-300 rounded-lg font-medium text-navy">
                              R$ {item.total.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Summary */}
            <Card>
              <h2 className="text-xl font-bold text-navy mb-4">Resumo</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Desconto (R$)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
                  />
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-between">
                  <span className="font-bold text-lg text-navy">Total:</span>
                  <span className="font-bold text-lg text-navy">R$ {total.toFixed(2)}</span>
                </div>
              </div>
            </Card>

            {/* Status */}
            <Card>
              <h2 className="text-xl font-bold text-navy mb-4">Status</h2>
              <Select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as 'draft' | 'sent' | 'approved' | 'cancelled')
                }
                options={[
                  { value: 'draft', label: 'Rascunho' },
                  { value: 'sent', label: 'Enviado' },
                  { value: 'approved', label: 'Aprovado' },
                  { value: 'cancelled', label: 'Cancelado' },
                ]}
              />
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

