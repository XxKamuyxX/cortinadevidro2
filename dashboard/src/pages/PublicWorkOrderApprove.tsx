import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

interface WorkOrder {
  id: string;
  quoteId: string;
  clientName: string;
  scheduledDate: string;
  scheduledTime?: string;
  technician: string;
  status: string;
  checklist: { task: string; completed: boolean }[];
  notes: string;
  photos?: string[];
  approved?: boolean;
}

export function PublicWorkOrderApprove() {
  const { osId } = useParams<{ osId: string }>();
  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    if (osId) {
      loadWorkOrder();
    }
  }, [osId]);

  const loadWorkOrder = async () => {
    try {
      if (!osId) {
        setError('ID da ordem de serviço não fornecido');
        setLoading(false);
        return;
      }

      const osDoc = await getDoc(doc(db, 'workOrders', osId));
      if (!osDoc.exists()) {
        setError('Ordem de serviço não encontrada');
        setLoading(false);
        return;
      }

      const osData = osDoc.data();
      setWorkOrder({
        id: osDoc.id,
        ...osData,
      } as WorkOrder);

      if (osData.approved) {
        setApproved(true);
      }
    } catch (err) {
      console.error('Error loading work order:', err);
      setError('Erro ao carregar ordem de serviço');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!osId || !workOrder) return;

    if (workOrder.approved) {
      alert('Esta ordem de serviço já foi aprovada');
      return;
    }

    if (!confirm('Deseja aprovar esta ordem de serviço?')) {
      return;
    }

    setUpdating(true);
    try {
      await updateDoc(doc(db, 'workOrders', osId), {
        approved: true,
        approvedAt: new Date(),
        updatedAt: new Date(),
      });
      setWorkOrder({ ...workOrder, approved: true });
      setApproved(true);
      alert('Ordem de Serviço Aprovada com Sucesso!');
    } catch (err) {
      console.error('Error approving work order:', err);
      alert('Erro ao aprovar ordem de serviço. Tente novamente.');
    } finally {
      setUpdating(false);
    }
  };

  const handleReject = async () => {
    if (!osId || !workOrder) return;

    if (!confirm('Deseja rejeitar esta ordem de serviço?')) {
      return;
    }

    setUpdating(true);
    try {
      await updateDoc(doc(db, 'workOrders', osId), {
        approved: false,
        rejected: true,
        rejectedAt: new Date(),
        updatedAt: new Date(),
      });
      alert('Ordem de serviço rejeitada');
    } catch (err) {
      console.error('Error rejecting work order:', err);
      alert('Erro ao rejeitar ordem de serviço. Tente novamente.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-navy animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Carregando ordem de serviço...</p>
        </div>
      </div>
    );
  }

  if (error || !workOrder) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-navy mb-2">Erro</h1>
          <p className="text-slate-600 mb-6">{error || 'Ordem de serviço não encontrada'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-center mb-4">
            <img src="/logo.png" alt="House Manutenção" className="h-16 w-16 object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-navy text-center mb-2">Aprovar Ordem de Serviço</h1>
          <p className="text-center text-slate-600">
            Cliente: {workOrder.clientName}
          </p>
          {workOrder.scheduledDate && (
            <p className="text-center text-slate-600">
              Agendada para: {new Date(workOrder.scheduledDate).toLocaleDateString('pt-BR')}
              {workOrder.scheduledTime && ` às ${workOrder.scheduledTime}`}
            </p>
          )}
        </div>

        {/* Approval Status */}
        {approved && (
          <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 mb-6 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-700 mb-2">Ordem de Serviço Aprovada!</h2>
            <p className="text-green-600">Esta ordem de serviço já foi aprovada anteriormente.</p>
          </div>
        )}

        {/* Checklist */}
        {workOrder.checklist && workOrder.checklist.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-navy mb-4">Checklist de Serviços</h2>
            <div className="space-y-2">
              {workOrder.checklist.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  {item.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-slate-300" />
                  )}
                  <span className={item.completed ? 'text-slate-600' : 'text-slate-700'}>
                    {item.task}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {workOrder.notes && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-navy mb-4">Observações</h2>
            <p className="text-slate-700">{workOrder.notes}</p>
          </div>
        )}

        {/* Action Buttons */}
        {!approved && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleApprove}
                disabled={updating}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                {updating ? 'Aprovando...' : 'Aprovar Ordem de Serviço'}
              </button>
              <button
                onClick={handleReject}
                disabled={updating}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                {updating ? 'Rejeitando...' : 'Rejeitar'}
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-slate-600 text-sm">
          <p>House Manutenção - Especialistas em Cortinas de Vidro</p>
          <p className="mt-1">Rua Rio Grande do Norte, 726, Savassi, Belo Horizonte - MG</p>
          <p className="mt-1">Telefone: (31) 98279-8513</p>
        </div>
      </div>
    </div>
  );
}

