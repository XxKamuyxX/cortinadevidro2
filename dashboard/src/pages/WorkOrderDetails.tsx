import { Layout } from '../components/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CheckCircle2, Circle, X, Plus, Copy, ExternalLink } from 'lucide-react';

interface WorkOrder {
  id: string;
  quoteId: string;
  clientName: string;
  scheduledDate: string;
  technician: string;
  status: 'scheduled' | 'in-progress' | 'completed';
  checklist: { task: string; completed: boolean }[];
  notes: string;
  photos?: string[];
  feedbackLink?: string;
}

export function WorkOrderDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (id) {
      loadWorkOrder();
    }
  }, [id]);

  const loadWorkOrder = async () => {
    try {
      if (!id) {
        setLoading(false);
        return;
      }

      const docRef = doc(db, 'workOrders', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        setLoading(false);
        return;
      }

      const data = docSnap.data();
      setWorkOrder({
        id: docSnap.id,
        ...data,
      } as WorkOrder);
      setNotes(data.notes || '');
    } catch (error) {
      console.error('Error loading work order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPhoto = async () => {
    if (!newPhotoUrl.trim() || !id || !workOrder) return;

    const updatedPhotos = [...(workOrder.photos || []), newPhotoUrl.trim()];
    
    setSaving(true);
    try {
      await updateDoc(doc(db, 'workOrders', id), {
        photos: updatedPhotos,
      });
      setWorkOrder({ ...workOrder, photos: updatedPhotos });
      setNewPhotoUrl('');
    } catch (error) {
      console.error('Error adding photo:', error);
      alert('Erro ao adicionar foto');
    } finally {
      setSaving(false);
    }
  };

  const handleRemovePhoto = async (index: number) => {
    if (!id || !workOrder || !workOrder.photos) return;

    const updatedPhotos = workOrder.photos.filter((_, i) => i !== index);
    
    setSaving(true);
    try {
      await updateDoc(doc(db, 'workOrders', id), {
        photos: updatedPhotos,
      });
      setWorkOrder({ ...workOrder, photos: updatedPhotos });
    } catch (error) {
      console.error('Error removing photo:', error);
      alert('Erro ao remover foto');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!id) return;

    setSaving(true);
    try {
      await updateDoc(doc(db, 'workOrders', id), {
        notes,
      });
      if (workOrder) {
        setWorkOrder({ ...workOrder, notes });
      }
      alert('Observações salvas com sucesso!');
    } catch (error) {
      console.error('Error saving notes:', error);
      alert('Erro ao salvar observações');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleChecklist = async (index: number) => {
    if (!id || !workOrder || !workOrder.checklist) return;

    const updatedChecklist = [...workOrder.checklist];
    updatedChecklist[index].completed = !updatedChecklist[index].completed;

    setSaving(true);
    try {
      await updateDoc(doc(db, 'workOrders', id), {
        checklist: updatedChecklist,
      });
      setWorkOrder({ ...workOrder, checklist: updatedChecklist });
    } catch (error) {
      console.error('Error updating checklist:', error);
      alert('Erro ao atualizar checklist');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: 'scheduled' | 'in-progress' | 'completed') => {
    if (!id || !workOrder) return;

    if (newStatus === 'completed' && !workOrder.feedbackLink) {
      // Generate feedback link when completing
      const baseUrl = window.location.origin;
      const feedbackLink = `${baseUrl}/feedback/${id}`;
      
      setSaving(true);
      try {
        await updateDoc(doc(db, 'workOrders', id), {
          status: newStatus,
          feedbackLink,
          completedDate: new Date(),
        });
        setWorkOrder({ ...workOrder, status: newStatus, feedbackLink });
        alert('Ordem de serviço concluída! Link de feedback gerado.');
      } catch (error) {
        console.error('Error updating status:', error);
        alert('Erro ao atualizar status');
      } finally {
        setSaving(false);
      }
    } else {
      setSaving(true);
      try {
        await updateDoc(doc(db, 'workOrders', id), {
          status: newStatus,
        });
        setWorkOrder({ ...workOrder, status: newStatus });
      } catch (error) {
        console.error('Error updating status:', error);
        alert('Erro ao atualizar status');
      } finally {
        setSaving(false);
      }
    }
  };

  const copyFeedbackLink = () => {
    if (!workOrder?.feedbackLink) return;
    navigator.clipboard.writeText(workOrder.feedbackLink);
    alert('Link copiado para a área de transferência!');
  };

  const statusLabels = {
    scheduled: 'Agendado',
    'in-progress': 'Em Andamento',
    completed: 'Concluído',
  };

  const statusColors = {
    scheduled: 'bg-blue-100 text-blue-700',
    'in-progress': 'bg-yellow-100 text-yellow-700',
    completed: 'bg-green-100 text-green-700',
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

  if (!workOrder) {
    return (
      <Layout>
        <Card>
          <p className="text-center text-slate-600 py-8">Ordem de serviço não encontrada</p>
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
            <button
              onClick={() => navigate('/work-orders')}
              className="text-slate-600 hover:text-navy mb-2"
            >
              ← Voltar
            </button>
            <h1 className="text-3xl font-bold text-navy">Ordem de Serviço</h1>
            <p className="text-slate-600 mt-1">{workOrder.clientName}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusColors[workOrder.status]}`}>
              {statusLabels[workOrder.status]}
            </span>
          </div>
        </div>

        {/* Status Actions */}
        <Card>
          <h2 className="text-xl font-bold text-navy mb-4">Alterar Status</h2>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={workOrder.status === 'scheduled' ? 'primary' : 'outline'}
              onClick={() => handleStatusChange('scheduled')}
              disabled={saving}
            >
              Agendado
            </Button>
            <Button
              variant={workOrder.status === 'in-progress' ? 'primary' : 'outline'}
              onClick={() => handleStatusChange('in-progress')}
              disabled={saving}
            >
              Em Andamento
            </Button>
            <Button
              variant={workOrder.status === 'completed' ? 'primary' : 'outline'}
              onClick={() => handleStatusChange('completed')}
              disabled={saving}
            >
              Concluído
            </Button>
          </div>
        </Card>

        {/* Feedback Link */}
        {workOrder.status === 'completed' && workOrder.feedbackLink && (
          <Card>
            <h2 className="text-xl font-bold text-navy mb-4">Link de Feedback</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={workOrder.feedbackLink}
                readOnly
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg bg-slate-50"
              />
              <Button variant="outline" onClick={copyFeedbackLink}>
                <Copy className="w-4 h-4 mr-2" />
                Copiar
              </Button>
              <Button
                variant="secondary"
                onClick={() => window.open(workOrder.feedbackLink, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Abrir
              </Button>
            </div>
            <p className="text-sm text-slate-600 mt-2">
              Compartilhe este link com o cliente para coletar feedback sobre o serviço.
            </p>
          </Card>
        )}

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-xl font-bold text-navy mb-4">Informações</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-600">Cliente</p>
                <p className="font-medium text-navy">{workOrder.clientName}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Data Agendada</p>
                <p className="font-medium text-navy">
                  {new Date(workOrder.scheduledDate).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Técnico</p>
                <p className="font-medium text-navy">{workOrder.technician || 'Não atribuído'}</p>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-bold text-navy mb-4">Checklist</h2>
            <div className="space-y-2">
              {workOrder.checklist && workOrder.checklist.length > 0 ? (
                workOrder.checklist.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer"
                    onClick={() => handleToggleChecklist(index)}
                  >
                    {item.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300" />
                    )}
                    <span
                      className={item.completed ? 'text-slate-600 line-through' : 'text-slate-700'}
                    >
                      {item.task}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-slate-600">Nenhum item no checklist</p>
              )}
            </div>
          </Card>
        </div>

        {/* Photo Report */}
        <Card>
          <h2 className="text-xl font-bold text-navy mb-4">Relatório Fotográfico</h2>
          
          {/* Add Photo */}
          <div className="mb-6 p-4 border-2 border-dashed border-slate-300 rounded-lg">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Adicionar Foto (URL)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                placeholder="Cole a URL da imagem aqui"
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
              />
              <Button
                variant="primary"
                onClick={handleAddPhoto}
                disabled={!newPhotoUrl.trim() || saving}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              💡 Dica: Você pode usar serviços como Imgur, Google Drive (com link público), ou qualquer hospedagem de imagens.
            </p>
          </div>

          {/* Photos Grid */}
          {workOrder.photos && workOrder.photos.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {workOrder.photos.map((photoUrl, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photoUrl}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg border border-slate-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Imagem+Inválida';
                    }}
                  />
                  <button
                    onClick={() => handleRemovePhoto(index)}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-600">
              <p>Nenhuma foto adicionada ainda.</p>
              <p className="text-sm mt-2">Adicione fotos do serviço realizado acima.</p>
            </div>
          )}
        </Card>

        {/* Notes */}
        <Card>
          <h2 className="text-xl font-bold text-navy mb-4">Observações Técnicas</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={6}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy resize-none"
            placeholder="Adicione observações sobre o serviço realizado..."
          />
          <div className="mt-4 flex justify-end">
            <Button variant="primary" onClick={handleSaveNotes} disabled={saving}>
              Salvar Observações
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
}

