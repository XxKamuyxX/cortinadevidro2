import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { X, FileText } from 'lucide-react';
import { useState } from 'react';

interface QuoteItem {
  serviceName: string;
  quantity: number;
  total: number;
  dimensions?: {
    width?: number;
    height?: number;
  };
}

interface ContractModalProps {
  quote: {
    id: string;
    clientName: string;
    clientAddress?: string;
    items: QuoteItem[];
    total: number;
  };
  onClose: () => void;
  onGenerate: (contractData: ContractData) => void;
}

export interface ContractData {
  // Contratante
  clientName: string;
  clientCpfCnpj: string;
  clientRg: string;
  clientAddress: string;
  
  // Execução
  startDate: string;
  deliveryDate: string;
  
  // Pagamento
  paymentMethod: 'pix' | 'card' | 'cash' | 'bank_transfer';
  paymentDetails: string;
  
  // Testemunhas (opcional)
  witness1Name?: string;
  witness1Cpf?: string;
  witness2Name?: string;
  witness2Cpf?: string;
}

// Helper function to format CPF/CNPJ
const formatCpfCnpj = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length <= 11) {
    // CPF: 000.000.000-00
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  } else {
    // CNPJ: 00.000.000/0000-00
    return numbers
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
  }
};

export function ContractModal({ quote, onClose, onGenerate }: ContractModalProps) {
  const [formData, setFormData] = useState<ContractData>({
    clientName: quote.clientName,
    clientCpfCnpj: '',
    clientRg: '',
    clientAddress: quote.clientAddress || '',
    startDate: '',
    deliveryDate: '',
    paymentMethod: 'pix',
    paymentDetails: '',
    witness1Name: '',
    witness1Cpf: '',
    witness2Name: '',
    witness2Cpf: '',
  });

  const handleCpfCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCpfCnpj(e.target.value);
    setFormData({ ...formData, clientCpfCnpj: formatted });
  };

  const handleWitnessCpfChange = (witness: 1 | 2, value: string) => {
    const formatted = formatCpfCnpj(value);
    if (witness === 1) {
      setFormData({ ...formData, witness1Cpf: formatted });
    } else {
      setFormData({ ...formData, witness2Cpf: formatted });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.clientCpfCnpj || !formData.clientRg || !formData.clientAddress) {
      alert('Preencha todos os campos obrigatórios do Contratante');
      return;
    }
    
    if (!formData.startDate || !formData.deliveryDate) {
      alert('Preencha as datas de início e entrega');
      return;
    }
    
    if (!formData.paymentDetails) {
      alert('Preencha os detalhes do pagamento');
      return;
    }
    
    onGenerate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-navy" />
            <h2 className="text-2xl font-bold text-navy">Gerar Contrato</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contratante */}
          <div>
            <h3 className="text-lg font-bold text-navy mb-4">Dados do Contratante</h3>
            <div className="space-y-4">
              <Input
                label="Nome Completo *"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                required
                disabled
              />
              
              <Input
                label="CPF/CNPJ *"
                value={formData.clientCpfCnpj}
                onChange={handleCpfCnpjChange}
                placeholder="000.000.000-00 ou 00.000.000/0000-00"
                required
                maxLength={18}
              />
              
              <Input
                label="RG *"
                value={formData.clientRg}
                onChange={(e) => setFormData({ ...formData, clientRg: e.target.value })}
                placeholder="00.000.000-0"
                required
              />
              
              <Input
                label="Endereço Completo *"
                value={formData.clientAddress}
                onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
                placeholder="Rua, número, bairro, cidade - UF"
                required
              />
            </div>
          </div>

          {/* Execução */}
          <div>
            <h3 className="text-lg font-bold text-navy mb-4">Execução do Serviço</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Data de Início *"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
              
              <Input
                label="Prazo de Entrega *"
                type="date"
                value={formData.deliveryDate}
                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Pagamento */}
          <div>
            <h3 className="text-lg font-bold text-navy mb-4">Pagamento</h3>
            <div className="space-y-4">
              <Select
                label="Forma de Pagamento *"
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                options={[
                  { value: 'pix', label: 'PIX' },
                  { value: 'card', label: 'Cartão de Crédito/Débito' },
                  { value: 'cash', label: 'Dinheiro' },
                  { value: 'bank_transfer', label: 'Transferência Bancária' },
                ]}
                required
              />
              
              <Input
                label="Detalhes do Pagamento *"
                value={formData.paymentDetails}
                onChange={(e) => setFormData({ ...formData, paymentDetails: e.target.value })}
                placeholder="Ex: 50% entrada + 50% na entrega"
                required
              />
            </div>
          </div>

          {/* Testemunhas (Opcional) */}
          <div>
            <h3 className="text-lg font-bold text-navy mb-4">Testemunhas (Opcional)</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nome da 1ª Testemunha"
                  value={formData.witness1Name}
                  onChange={(e) => setFormData({ ...formData, witness1Name: e.target.value })}
                  placeholder="Nome completo"
                />
                
                <Input
                  label="CPF da 1ª Testemunha"
                  value={formData.witness1Cpf}
                  onChange={(e) => handleWitnessCpfChange(1, e.target.value)}
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nome da 2ª Testemunha"
                  value={formData.witness2Name}
                  onChange={(e) => setFormData({ ...formData, witness2Name: e.target.value })}
                  placeholder="Nome completo"
                />
                
                <Input
                  label="CPF da 2ª Testemunha"
                  value={formData.witness2Cpf}
                  onChange={(e) => handleWitnessCpfChange(2, e.target.value)}
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1 flex items-center justify-center gap-2"
            >
              <FileText className="w-5 h-5" />
              Gerar PDF do Contrato
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
