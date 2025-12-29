import { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { ImageUpload } from './ImageUpload';
import { CheckCircle2, AlertCircle, XCircle, X } from 'lucide-react';

interface Leaf {
  id: number;
  status: 'perfect' | 'attention' | 'damaged';
  defects: string[];
  photo?: string;
}

interface TechnicalInspectionProps {
  initialLeaves?: Leaf[];
  initialGeneralChecklist?: { task: string; completed: boolean }[];
  onSave: (data: {
    leaves: Leaf[];
    generalChecklist: { task: string; completed: boolean }[];
  }) => void;
}

const DEFECT_OPTIONS = ['Roldana', 'Vedação', 'Vidro Lascado', 'Fechadura', 'Trilho'];

const GENERAL_CHECKLIST_ITEMS = [
  'Proteção do piso realizada',
  'Condição das paredes verificada',
  'Área de trabalho limpa',
  'Ferramentas organizadas',
];

export function TechnicalInspection({
  initialLeaves = [],
  initialGeneralChecklist = GENERAL_CHECKLIST_ITEMS.map((task) => ({ task, completed: false })),
  onSave,
}: TechnicalInspectionProps) {
  const [numberOfLeaves, setNumberOfLeaves] = useState(initialLeaves.length || 0);
  const [leaves, setLeaves] = useState<Leaf[]>(initialLeaves);
  const [selectedLeaf, setSelectedLeaf] = useState<number | null>(null);
  const [generalChecklist, setGeneralChecklist] = useState(initialGeneralChecklist);

  const handleSetLeaves = () => {
    if (numberOfLeaves <= 0) {
      alert('Digite um número válido de folhas');
      return;
    }

    const newLeaves: Leaf[] = Array.from({ length: numberOfLeaves }, (_, i) => {
      const existing = leaves.find((l) => l.id === i + 1);
      return existing || {
        id: i + 1,
        status: 'perfect',
        defects: [],
      };
    });

    setLeaves(newLeaves);
  };

  const updateLeafStatus = (leafId: number, status: 'perfect' | 'attention' | 'damaged') => {
    setLeaves(leaves.map((leaf) => (leaf.id === leafId ? { ...leaf, status } : leaf)));
  };

  const toggleDefect = (leafId: number, defect: string) => {
    setLeaves(
      leaves.map((leaf) => {
        if (leaf.id === leafId) {
          const defects = leaf.defects.includes(defect)
            ? leaf.defects.filter((d) => d !== defect)
            : [...leaf.defects, defect];
          return { ...leaf, defects };
        }
        return leaf;
      })
    );
  };

  const handlePhotoUpload = (leafId: number, url: string) => {
    setLeaves(leaves.map((leaf) => (leaf.id === leafId ? { ...leaf, photo: url } : leaf)));
  };

  const toggleGeneralChecklist = (index: number) => {
    const updated = [...generalChecklist];
    updated[index].completed = !updated[index].completed;
    setGeneralChecklist(updated);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'perfect':
        return 'bg-green-100 border-green-500 text-green-700';
      case 'attention':
        return 'bg-yellow-100 border-yellow-500 text-yellow-700';
      case 'damaged':
        return 'bg-red-100 border-red-500 text-red-700';
      default:
        return 'bg-slate-100 border-slate-300 text-slate-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'perfect':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'attention':
        return <AlertCircle className="w-5 h-5" />;
      case 'damaged':
        return <XCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'perfect':
        return 'Perfeito';
      case 'attention':
        return 'Atenção';
      case 'damaged':
        return 'Danificado';
      default:
        return '';
    }
  };

  const getDefectCount = (defect: string) => {
    return leaves.filter((leaf) => leaf.defects.includes(defect)).length;
  };

  return (
    <div className="space-y-6">
      {/* Leaf Count Input */}
      <Card>
        <h2 className="text-xl font-bold text-navy mb-4">Quantidade de Folhas (Lâminas)</h2>
        <div className="flex gap-2">
          <input
            type="number"
            min="1"
            value={numberOfLeaves}
            onChange={(e) => setNumberOfLeaves(parseInt(e.target.value) || 0)}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
            placeholder="Digite o número de folhas"
          />
          <Button variant="primary" onClick={handleSetLeaves}>
            Definir
          </Button>
        </div>
      </Card>

      {/* Leaves Visualization */}
      {leaves.length > 0 && (
        <Card>
          <h2 className="text-xl font-bold text-navy mb-4">Vistoria Técnica - Folhas</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
            {leaves.map((leaf) => (
              <button
                key={leaf.id}
                onClick={() => setSelectedLeaf(leaf.id)}
                className={`p-4 border-2 rounded-lg transition-all hover:scale-105 ${getStatusColor(
                  leaf.status
                )}`}
              >
                <div className="flex items-center justify-center mb-2">
                  {getStatusIcon(leaf.status)}
                </div>
                <p className="font-bold text-center">Folha {leaf.id}</p>
                <p className="text-xs text-center mt-1">{getStatusLabel(leaf.status)}</p>
                {leaf.defects.length > 0 && (
                  <p className="text-xs text-center mt-1 text-red-600">
                    {leaf.defects.length} defeito(s)
                  </p>
                )}
              </button>
            ))}
          </div>

          {/* Leaf Detail Modal */}
          {selectedLeaf !== null && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-navy">Folha {selectedLeaf}</h3>
                  <button
                    onClick={() => setSelectedLeaf(null)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Status Selection */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => updateLeafStatus(selectedLeaf, 'perfect')}
                        className={`p-3 rounded-lg border-2 transition-colors ${
                          leaves.find((l) => l.id === selectedLeaf)?.status === 'perfect'
                            ? 'bg-green-100 border-green-500 text-green-700'
                            : 'bg-white border-slate-300 text-slate-700'
                        }`}
                      >
                        <CheckCircle2 className="w-6 h-6 mx-auto mb-1" />
                        <span className="text-xs">Perfeito</span>
                      </button>
                      <button
                        onClick={() => updateLeafStatus(selectedLeaf, 'attention')}
                        className={`p-3 rounded-lg border-2 transition-colors ${
                          leaves.find((l) => l.id === selectedLeaf)?.status === 'attention'
                            ? 'bg-yellow-100 border-yellow-500 text-yellow-700'
                            : 'bg-white border-slate-300 text-slate-700'
                        }`}
                      >
                        <AlertCircle className="w-6 h-6 mx-auto mb-1" />
                        <span className="text-xs">Atenção</span>
                      </button>
                      <button
                        onClick={() => updateLeafStatus(selectedLeaf, 'damaged')}
                        className={`p-3 rounded-lg border-2 transition-colors ${
                          leaves.find((l) => l.id === selectedLeaf)?.status === 'damaged'
                            ? 'bg-red-100 border-red-500 text-red-700'
                            : 'bg-white border-slate-300 text-slate-700'
                        }`}
                      >
                        <XCircle className="w-6 h-6 mx-auto mb-1" />
                        <span className="text-xs">Danificado</span>
                      </button>
                    </div>
                  </div>

                  {/* Defects Selection */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Defeitos (Selecione múltiplos)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {DEFECT_OPTIONS.map((defect) => {
                        const leaf = leaves.find((l) => l.id === selectedLeaf);
                        const isSelected = leaf?.defects.includes(defect);
                        return (
                          <button
                            key={defect}
                            onClick={() => toggleDefect(selectedLeaf, defect)}
                            className={`px-3 py-1 rounded-full text-sm transition-colors ${
                              isSelected
                                ? 'bg-navy text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {defect}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Photo Upload */}
                  <div>
                    <ImageUpload
                      onUploadComplete={(url) => handlePhotoUpload(selectedLeaf, url)}
                      path={`work-orders/leaves/${selectedLeaf}`}
                      label="Foto da Folha"
                    />
                    {leaves.find((l) => l.id === selectedLeaf)?.photo && (
                      <img
                        src={leaves.find((l) => l.id === selectedLeaf)?.photo}
                        alt={`Folha ${selectedLeaf}`}
                        className="mt-2 w-full h-48 object-cover rounded-lg"
                      />
                    )}
                  </div>
                </div>
              </Card>
            </div>
          )}
        </Card>
      )}

      {/* General Checklist */}
      <Card>
        <h2 className="text-xl font-bold text-navy mb-4">Checklist Geral (Ambiente)</h2>
        <div className="space-y-2">
          {generalChecklist.map((item, index) => (
            <button
              key={index}
              onClick={() => toggleGeneralChecklist(index)}
              className="w-full flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left"
            >
              {item.completed ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <div className="w-5 h-5 border-2 border-slate-300 rounded-full" />
              )}
              <span className={item.completed ? 'text-slate-600 line-through' : 'text-slate-700'}>
                {item.task}
              </span>
            </button>
          ))}
        </div>
      </Card>

      {/* Defect Summary */}
      {leaves.length > 0 && (
        <Card>
          <h2 className="text-xl font-bold text-navy mb-4">Resumo de Defeitos</h2>
          <div className="space-y-2">
            {DEFECT_OPTIONS.map((defect) => {
              const count = getDefectCount(defect);
              if (count === 0) return null;
              return (
                <div key={defect} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="font-medium text-red-700">{defect}</span>
                  <span className="text-red-600 font-bold">{count} folha(s)</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <Button variant="primary" size="lg" onClick={() => onSave({ leaves, generalChecklist })}>
          Salvar Vistoria
        </Button>
      </div>
    </div>
  );
}

