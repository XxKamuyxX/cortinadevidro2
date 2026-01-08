import { Layout } from '../../components/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useState, useEffect, useRef } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db, storage } from '../../lib/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { Trash2, Upload, Image as ImageIcon } from 'lucide-react';
import { compressFile } from '../../utils/compressImage';

interface Template {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  createdAt: any;
}

const CATEGORIES = [
  'Janelas',
  'Portas',
  'Box',
  'Espelhos',
  'Guarda-Corpo',
  'Cobertura',
  'Outro',
];

export function TemplateManager() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    customCategory: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const q = query(collection(db, 'templates'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const templatesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Template[];
      setTemplates(templatesData);
    } catch (error) {
      console.error('Error loading templates:', error);
      alert('Erro ao carregar templates');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas imagens (JPG, PNG, SVG)');
      return;
    }

    setSelectedFile(file);

    // Show preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert('Digite o nome do projeto');
      return;
    }

    const category = formData.category === 'Outro' ? formData.customCategory : formData.category;
    if (!category.trim()) {
      alert('Selecione ou digite a categoria');
      return;
    }

    if (!selectedFile) {
      alert('Selecione uma imagem do projeto');
      return;
    }

    try {
      setUploading(true);

      // Compress image before upload
      const compressedFile = await compressFile(selectedFile);
      console.log(`Compressed size: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);

      // Upload to Firebase Storage
      const timestamp = Date.now();
      const fileName = `${timestamp}_${compressedFile.name}`;
      const storageRef = ref(storage, `templates/${fileName}`);
      
      await uploadBytes(storageRef, compressedFile);
      const imageUrl = await getDownloadURL(storageRef);

      // Save to Firestore
      await addDoc(collection(db, 'templates'), {
        name: formData.name.trim(),
        category: category.trim(),
        imageUrl,
        createdAt: new Date(),
      });

      // Reset form
      setFormData({ name: '', category: '', customCategory: '' });
      setSelectedFile(null);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      alert('Template salvo com sucesso!');
      await loadTemplates();
    } catch (error: any) {
      console.error('Error saving template:', error);
      alert(`Erro ao salvar template: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (template: Template) => {
    if (!confirm(`Tem certeza que deseja excluir o template "${template.name}"?`)) {
      return;
    }

    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'templates', template.id));

      // Delete from Storage
      try {
        const imageRef = ref(storage, template.imageUrl);
        await deleteObject(imageRef);
      } catch (storageError) {
        console.warn('Error deleting image from storage:', storageError);
        // Continue even if storage deletion fails
      }

      alert('Template excluído com sucesso!');
      await loadTemplates();
    } catch (error: any) {
      console.error('Error deleting template:', error);
      alert(`Erro ao excluir template: ${error.message}`);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-secondary">Biblioteca de Projetos</h1>
          <p className="text-slate-600 mt-1">Gerencie os templates visuais para orçamentos</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side - Form */}
          <Card>
            <h2 className="text-xl font-bold text-secondary mb-4">Adicionar Novo Projeto</h2>
            
            <div className="space-y-4">
              <Input
                label="Nome do Projeto *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Janela 4 Folhas Correr"
                required
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Categoria *
                </label>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value, customCategory: '' })}
                  options={[
                    { value: '', label: 'Selecione a categoria...' },
                    ...CATEGORIES.map((cat) => ({ value: cat, label: cat })),
                  ]}
                  required
                />
              </div>

              {formData.category === 'Outro' && (
                <Input
                  label="Nome da Categoria Personalizada *"
                  value={formData.customCategory}
                  onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                  placeholder="Digite o nome da categoria"
                  required
                />
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Imagem do Projeto * (JPG, PNG, SVG)
                </label>
                <div className="space-y-2">
                  {preview ? (
                    <div className="relative">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-48 object-contain border border-slate-200 rounded-lg bg-gray-50"
                      />
                      <button
                        onClick={() => {
                          setSelectedFile(null);
                          setPreview(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                    >
                      <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-600">Clique para selecionar ou arraste uma imagem</p>
                      <p className="text-xs text-slate-500 mt-1">JPG, PNG ou SVG</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </div>

              <Button
                variant="primary"
                onClick={handleSave}
                disabled={uploading || !formData.name || !formData.category || !selectedFile}
                className="w-full flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Salvar Projeto
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Right Side - List */}
          <Card>
            <h2 className="text-xl font-bold text-secondary mb-4">Templates Existentes</h2>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-slate-600 mt-2">Carregando...</p>
              </div>
            ) : templates.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-600">Nenhum template cadastrado ainda</p>
                <p className="text-sm text-slate-500 mt-1">Adicione seu primeiro projeto ao lado</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="border border-slate-200 rounded-lg p-3 hover:border-primary transition-colors"
                  >
                    <div className="aspect-video bg-gray-50 rounded-lg mb-2 overflow-hidden">
                      <img
                        src={template.imageUrl}
                        alt={template.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-secondary text-sm">{template.name}</h3>
                      <p className="text-xs text-slate-500">{template.category}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(template)}
                      className="w-full mt-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Excluir
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
}
