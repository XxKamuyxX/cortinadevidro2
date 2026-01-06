import { Layout } from '../components/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Edit2, Ban, Crown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface CompanyOwner {
  id: string;
  email: string;
  name?: string;
  companyId: string;
  status?: 'active' | 'trial' | 'expired';
  expirationDate?: any;
  trialEndsAt?: any;
  isActive?: boolean;
  companyName?: string;
}

export function MasterDashboard() {
  const [owners, setOwners] = useState<CompanyOwner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingOwner, setEditingOwner] = useState<CompanyOwner | null>(null);
  const [editForm, setEditForm] = useState({
    expirationDate: '',
    status: 'active' as 'active' | 'trial' | 'expired',
  });

  useEffect(() => {
    loadOwners();
  }, []);

  const loadOwners = async () => {
    try {
      setLoading(true);
      // Fetch all users with role === 'admin'
      const usersQuery = query(collection(db, 'users'), where('role', '==', 'admin'));
      const usersSnapshot = await getDocs(usersQuery);
      
      const ownersData: CompanyOwner[] = [];
      
      // For each admin user, fetch their company
      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        let companyName = 'N/A';
        
        if (userData.companyId) {
          try {
            const companyDoc = await getDoc(doc(db, 'companies', userData.companyId));
            if (companyDoc.exists()) {
              const companyData = companyDoc.data();
              companyName = companyData.name || 'N/A';
            }
          } catch (error) {
            console.error(`Error fetching company for ${userData.companyId}:`, error);
          }
        }
        
        ownersData.push({
          id: userDoc.id,
          email: userData.email || '',
          name: userData.name,
          companyId: userData.companyId || '',
          status: userData.status || 'trial',
          expirationDate: userData.expirationDate,
          trialEndsAt: userData.trialEndsAt,
          isActive: userData.isActive !== false, // Default to true if not set
          companyName,
        });
      }
      
      setOwners(ownersData);
    } catch (error) {
      console.error('Error loading owners:', error);
      alert('Erro ao carregar proprietários');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubscription = (owner: CompanyOwner) => {
    setEditingOwner(owner);
    // Format dates for input
    const expDate = owner.expirationDate?.toDate ? owner.expirationDate.toDate() : null;
    
    setEditForm({
      expirationDate: expDate ? expDate.toISOString().split('T')[0] : '',
      status: owner.status || 'active',
    });
  };

  const handleSaveSubscription = async () => {
    if (!editingOwner) return;
    
    try {
      const expirationTimestamp = editForm.expirationDate 
        ? Timestamp.fromDate(new Date(editForm.expirationDate))
        : null;
      
      await updateDoc(doc(db, 'users', editingOwner.id), {
        expirationDate: expirationTimestamp,
        status: editForm.status,
        updatedAt: Timestamp.now(),
      });
      
      alert('Assinatura atualizada com sucesso!');
      setEditingOwner(null);
      loadOwners();
    } catch (error) {
      console.error('Error updating subscription:', error);
      alert('Erro ao atualizar assinatura');
    }
  };

  const handleToggleAccess = async (owner: CompanyOwner) => {
    if (!confirm(`Tem certeza que deseja ${owner.isActive ? 'bloquear' : 'desbloquear'} o acesso deste usuário?`)) {
      return;
    }
    
    try {
      await updateDoc(doc(db, 'users', owner.id), {
        isActive: !owner.isActive,
        updatedAt: Timestamp.now(),
      });
      
      alert(`Acesso ${!owner.isActive ? 'desbloqueado' : 'bloqueado'} com sucesso!`);
      loadOwners();
    } catch (error) {
      console.error('Error toggling access:', error);
      alert('Erro ao alterar acesso');
    }
  };

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    try {
      const d = date.toDate ? date.toDate() : new Date(date);
      return d.toLocaleDateString('pt-BR');
    } catch {
      return 'N/A';
    }
  };

  const getStatusBadge = (status?: string) => {
    const statusMap = {
      active: { label: 'Ativo', color: 'bg-green-100 text-green-800' },
      trial: { label: 'Trial', color: 'bg-blue-100 text-blue-800' },
      expired: { label: 'Expirado', color: 'bg-red-100 text-red-800' },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.trial;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
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
        {/* Header */}
        <div className="flex items-center gap-3">
          <Crown className="w-8 h-8 text-gold" />
          <div>
            <h1 className="text-3xl font-bold text-navy">Gestão SaaS</h1>
            <p className="text-slate-600 mt-1">Gerencie assinaturas e acessos das empresas</p>
          </div>
        </div>

        {/* Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Empresa</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Email do Proprietário</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Trial Termina Em</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Acesso</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                {owners.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-500">
                      Nenhum proprietário encontrado
                    </td>
                  </tr>
                ) : (
                  owners.map((owner) => (
                    <tr key={owner.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div className="font-medium text-navy">{owner.companyName || 'N/A'}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-slate-700">{owner.email}</div>
                        {owner.name && (
                          <div className="text-sm text-slate-500">{owner.name}</div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(owner.status)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-slate-700">{formatDate(owner.trialEndsAt || owner.expirationDate)}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          owner.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {owner.isActive ? 'Ativo' : 'Bloqueado'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditSubscription(owner)}
                            className="flex items-center gap-1"
                          >
                            <Edit2 className="w-4 h-4" />
                            Editar Assinatura
                          </Button>
                          <Button
                            variant={owner.isActive ? "outline" : "primary"}
                            size="sm"
                            onClick={() => handleToggleAccess(owner)}
                            className="flex items-center gap-1"
                          >
                            <Ban className="w-4 h-4" />
                            {owner.isActive ? 'Bloquear' : 'Desbloquear'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Edit Subscription Modal */}
        {editingOwner && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full">
              <h2 className="text-xl font-bold text-navy mb-4">Editar Assinatura</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600 mb-2">
                    <strong>Empresa:</strong> {editingOwner.companyName || 'N/A'}
                  </p>
                  <p className="text-sm text-slate-600 mb-4">
                    <strong>Email:</strong> {editingOwner.email}
                  </p>
                </div>
                
                <Input
                  label="Data de Expiração"
                  type="date"
                  value={editForm.expirationDate}
                  onChange={(e) => setEditForm({ ...editForm, expirationDate: e.target.value })}
                />
                
                <Select
                  label="Status"
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value as 'active' | 'trial' | 'expired' })}
                  options={[
                    { value: 'active', label: 'Ativo' },
                    { value: 'trial', label: 'Trial' },
                    { value: 'expired', label: 'Expirado' },
                  ]}
                />
                
                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingOwner(null)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleSaveSubscription}
                    className="flex-1"
                  >
                    Salvar
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}
