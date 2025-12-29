import { Layout } from '../components/Layout';
import { ClientForm } from '../components/ClientForm';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';

const VIP_CONDOMINIUMS = [
  'Belvedere',
  'Vila da Serra',
  'Nova Lima',
  'Alphaville Lagoa dos Ingleses',
  'Vale dos Cristais',
  'Olympus',
  'Four Seasons',
  'Beverly Hills',
];

interface Client {
  id: string;
  name: string;
  address: string;
  condominium: string;
  phone: string;
  email: string;
  origin?: string; // Origem do cliente
}

export function ClientNew() {
  const navigate = useNavigate();

  const handleSave = async (clientData: Omit<Client, 'id'>) => {
    try {
      await addDoc(collection(db, 'clients'), clientData);
      navigate('/clients');
    } catch (error) {
      console.error('Error saving client:', error);
      alert('Erro ao salvar cliente');
    }
  };

  const handleCancel = () => {
    navigate('/clients');
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/clients')}
          className="text-slate-600 hover:text-navy mb-4"
        >
          ← Voltar
        </button>
        <ClientForm
          onSave={handleSave}
          onCancel={handleCancel}
          vipCondominiums={VIP_CONDOMINIUMS}
        />
      </div>
    </Layout>
  );
}

