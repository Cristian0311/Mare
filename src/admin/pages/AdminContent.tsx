import { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  HelpCircle, 
  BookOpen, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  Save, 
  X, 
  HelpCircle as HelpIcon,
  RefreshCw
} from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { contentService, FAQCategory, HowToBuyStep, Term } from '../../services/contentService';
import { InfoTrigger } from '../components/InfoTrigger';

export function AdminContent() {
  const { success, error } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Section collapse states
  const [openSection, setOpenSection] = useState<'how-to-buy' | 'faqs' | 'terms'>('how-to-buy');

  // 1. Cómo comprar state
  const [howToBuySteps, setHowToBuySteps] = useState<HowToBuyStep[]>([]);
  // 2. FAQs state
  const [faqsList, setFaqsList] = useState<FAQCategory[]>([]);
  // 3. Terms state
  const [termsList, setTermsList] = useState<Term[]>([]);
  
  // Temp states for adding FAQs
  const [newFaqCategory, setNewFaqCategory] = useState('Pedidos');
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');

  // Load from Supabase
  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setIsLoading(true);
    try {
      const [stepsData, faqsData, termsData] = await Promise.all([
        contentService.getHowToBuy(),
        contentService.getFAQs(),
        contentService.getTerms()
      ]);

      setHowToBuySteps(stepsData);
      setFaqsList(faqsData);
      setTermsList(termsData);
    } catch (err) {
      error('Error', 'No se pudo cargar el contenido desde la base de datos.');
    } finally {
      setIsLoading(false);
    }
  };

  // Save specific sections
  const saveHowToBuy = async () => {
    try {
      await contentService.saveHowToBuy(howToBuySteps);
      success('¡Cambios guardados!', 'La sección "Cómo comprar" ha sido actualizada en Supabase.');
    } catch (err) {
      error('Error', 'No se pudo guardar la sección en la base de datos.');
    }
  };

  const saveFaqs = async (updatedList = faqsList) => {
    try {
      await contentService.saveFAQs(updatedList);
      setFaqsList(updatedList);
      success('¡Preguntas Frecuentes actualizadas!', 'Las FAQs han sido sincronizadas con Supabase.');
    } catch (err) {
      error('Error', 'No se pudieron actualizar las FAQs.');
    }
  };

  const saveTerms = async () => {
    try {
      await contentService.saveTerms(termsList);
      success('¡Términos guardados!', 'Los "Términos y Condiciones" se han guardado en Supabase.');
    } catch (err) {
      error('Error', 'No se pudieron guardar los términos.');
    }
  };

  // Step editing handlers
  const handleStepChange = (index: number, field: string, value: string) => {
    const updated = [...howToBuySteps];
    updated[index] = { ...updated[index], [field as keyof HowToBuyStep]: value };
    setHowToBuySteps(updated);
  };

  // FAQ handlers
  const addFaqQuestion = () => {
    if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) {
      error('Faltan campos', 'Por favor ingresa la pregunta y respuesta de la FAQ.');
      return;
    }

    const updated = [...faqsList];
    let catIndex = updated.findIndex(c => c.category === newFaqCategory);
    
    const newQuestion = {
      id: 'q-' + Date.now(),
      title: newFaqQuestion,
      content: newFaqAnswer
    };

    if (catIndex !== -1) {
      updated[catIndex].questions.push(newQuestion);
    } else {
      updated.push({
        category: newFaqCategory,
        questions: [newQuestion]
      });
    }

    saveFaqs(updated);
    setNewFaqQuestion('');
    setNewFaqAnswer('');
  };

  const deleteFaqQuestion = (catIdx: number, qId: string) => {
    const updated = [...faqsList];
    updated[catIdx].questions = updated[catIdx].questions.filter((q: any) => q.id !== qId);
    
    // If category is empty, filter it out
    const cleanList = updated.filter(c => c.questions.length > 0);
    saveFaqs(cleanList);
  };

  // Terms change handlers
  const handleTermChange = (index: number, value: string) => {
    const updated = [...termsList];
    updated[index] = { ...updated[index], text: value };
    setTermsList(updated);
  };

  const toggleSection = (section: 'how-to-buy' | 'faqs' | 'terms') => {
    setOpenSection(openSection === section ? 'how-to-buy' : section);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <RefreshCw className="w-10 h-10 text-mare-gold animate-spin" />
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sincronizando Contenido...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-mare-navy uppercase tracking-tight flex items-center">
            Gestor de Contenido Informativo
            <InfoTrigger 
              title="Gestor de Contenido" 
              text="Aquí puedes modificar los textos informativos, pasos de compra y preguntas frecuentes de cara al cliente sin programar." 
            />
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-medium mt-1">
            Sincronizado con <span className="text-mare-turquoise font-black">Supabase DB</span>
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* SECTION 1: Cómo Comprar Steps (Collapsible) */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <button 
            onClick={() => toggleSection('how-to-buy')}
            className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                <BookOpen size={18} />
              </div>
              <div>
                <h3 className="font-black text-sm text-mare-navy uppercase tracking-tight flex items-center">
                  Pasos de "Cómo Comprar"
                  <InfoTrigger 
                    title="Pasos de Compra" 
                    text="Esta sección le explica paso a paso al usuario cómo hacer un pedido, añadirlo a la bolsa de compras y enviarlo a WhatsApp." 
                  />
                </h3>
                <p className="text-xs text-gray-400 font-bold">Edita la guía explicativa que ven tus clientes para aprender a usar la web.</p>
              </div>
            </div>
            {openSection === 'how-to-buy' ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
          </button>

          {openSection === 'how-to-buy' && (
            <div className="p-6 border-t border-gray-50 bg-gray-50/30 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {howToBuySteps.map((step, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 space-y-4 shadow-sm relative">
                    <div className="absolute top-4 right-4 flex items-center gap-1.5">
                      <span className="w-7 h-7 rounded-lg bg-mare-green text-white flex items-center justify-center text-xs font-black">
                        {step.number}
                      </span>
                      <InfoTrigger 
                        title={`Paso ${step.number}`} 
                        text={`Modifica el título o el contenido de este paso. Aparecerá en la página del cliente exactamente en la posición ${step.number}.`} 
                      />
                    </div>
                    
                    <div className="w-2/3">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Título del Paso</label>
                      <input 
                        className="w-full h-10 px-3 rounded-xl border border-gray-200 outline-none focus:border-mare-green font-bold text-xs text-mare-navy"
                        value={step.title}
                        onChange={(e) => handleStepChange(idx, 'title', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Descripción del Paso</label>
                      <textarea 
                        rows={2}
                        className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-mare-green font-bold text-xs text-gray-600 resize-none"
                        value={step.description}
                        onChange={(e) => handleStepChange(idx, 'description', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end pt-2">
                <button 
                  onClick={saveHowToBuy}
                  className="px-6 py-3 bg-mare-green hover:bg-mare-green/90 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center transition-colors shadow-lg shadow-mare-green/10"
                >
                  <Save size={16} className="mr-2" /> Guardar Pasos de Guía
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 3: Preguntas Frecuentes FAQs (Collapsible) */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <button 
            onClick={() => toggleSection('faqs')}
            className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <HelpIcon size={18} />
              </div>
              <div>
                <h3 className="font-black text-sm text-mare-navy uppercase tracking-tight flex items-center">
                  Preguntas Frecuentes (FAQs)
                  <InfoTrigger 
                    title="Preguntas Frecuentes" 
                    text="Las FAQs ayudan a disipar las dudas que los clientes tengan sobre el cobro de envío por municipio, formas de pago, garantías y devoluciones." 
                  />
                </h3>
                <p className="text-xs text-gray-400 font-bold">Añade y remueve de forma interactiva las preguntas recurrentes de tus clientes.</p>
              </div>
            </div>
            {openSection === 'faqs' ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
          </button>

          {openSection === 'faqs' && (
            <div className="p-6 border-t border-gray-50 bg-gray-50/30 space-y-6">
              {/* Existing FAQs categorized */}
              <div className="space-y-6">
                {faqsList.map((categoryObj, catIdx) => (
                  <div key={catIdx} className="space-y-3 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <h4 className="text-xs font-black text-mare-green uppercase tracking-widest border-b border-gray-100 pb-2">
                      Categoría: {categoryObj.category}
                    </h4>
                    <div className="divide-y divide-gray-50 space-y-3">
                      {categoryObj.questions.map((q: any) => (
                        <div key={q.id} className="pt-3 flex justify-between items-start gap-4">
                          <div className="space-y-1">
                            <h5 className="font-black text-xs text-mare-navy uppercase tracking-tight">{q.title}</h5>
                            <p className="text-xs text-gray-500 font-medium leading-relaxed">{q.content}</p>
                          </div>
                          <button 
                            onClick={() => deleteFaqQuestion(catIdx, q.id)}
                            className="p-1.5 text-gray-300 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors shrink-0"
                            title="Eliminar Pregunta"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New FAQ Form */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center">
                  Agregar Nueva Pregunta Frecuente
                  <InfoTrigger 
                    title="Nueva FAQ" 
                    text="Ingresa el título de la pregunta, selecciona su categoría temática y redacta una respuesta clara y profesional." 
                  />
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Categoría</label>
                    <select 
                      className="w-full h-11 px-3 rounded-xl border border-gray-200 outline-none focus:border-mare-green font-bold text-xs text-mare-navy appearance-none"
                      value={newFaqCategory}
                      onChange={(e) => setNewFaqCategory(e.target.value)}
                    >
                      <option value="Pedidos">Pedidos</option>
                      <option value="Pagos y Precios">Pagos y Precios</option>
                      <option value="Envíos">Envíos</option>
                      <option value="Productos">Productos</option>
                      <option value="Mayoristas">Mayoristas</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Título de la Pregunta</label>
                    <input 
                      className="w-full h-11 px-3 rounded-xl border border-gray-200 outline-none focus:border-mare-green font-bold text-xs text-mare-navy"
                      placeholder="Ej: ¿Cuáles son las tarifas de envío?"
                      value={newFaqQuestion}
                      onChange={(e) => setNewFaqQuestion(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Respuesta</label>
                  <textarea 
                    rows={2}
                    className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-mare-green font-bold text-xs text-gray-600 resize-none"
                    placeholder="Escribe la explicación detallada aquí..."
                    value={newFaqAnswer}
                    onChange={(e) => setNewFaqAnswer(e.target.value)}
                  />
                </div>

                <div className="flex justify-end">
                  <button 
                    onClick={addFaqQuestion}
                    className="px-5 py-2 bg-mare-navy hover:bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center transition-colors"
                  >
                    <Plus size={14} className="mr-1.5" /> Añadir Pregunta
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 4: Terms & Conditions (Collapsible) */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <button 
            onClick={() => toggleSection('terms')}
            className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-50 text-mare-navy rounded-xl">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h3 className="font-black text-sm text-mare-navy uppercase tracking-tight flex items-center">
                  Términos y Condiciones
                  <InfoTrigger 
                    title="Términos Legales" 
                    text="Son los términos de uso oficiales de MARÉ, abarcando las políticas de devolución de 48 horas, precios informativos en USD, y condiciones de venta mayorista." 
                  />
                </h3>
                <p className="text-xs text-gray-400 font-bold">Modifica las secciones del contrato legal de compraventa.</p>
              </div>
            </div>
            {openSection === 'terms' ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
          </button>

          {openSection === 'terms' && (
            <div className="p-6 border-t border-gray-50 bg-gray-50/30 space-y-6">
              <div className="space-y-6">
                {termsList.map((term, idx) => (
                  <div key={term.id} className="bg-white p-5 rounded-2xl border border-gray-100 space-y-2 shadow-sm">
                    <div className="flex items-center justify-between border-b border-gray-50 pb-2 mb-2">
                      <h4 className="text-xs font-black text-mare-navy uppercase tracking-tight">{term.title}</h4>
                      <InfoTrigger 
                        title="Término de Uso" 
                        text="Reescribe el párrafo de esta cláusula legal. Manténlo claro, explicativo y adaptado a las regulaciones vigentes en Cuba." 
                      />
                    </div>
                    <textarea 
                      rows={3}
                      className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-indigo-600 font-bold text-xs text-gray-600 resize-none"
                      value={term.text}
                      onChange={(e) => handleTermChange(idx, e.target.value)}
                    />
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end pt-2">
                <button 
                  onClick={saveTerms}
                  className="px-6 py-3 bg-mare-navy hover:bg-black text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center transition-colors shadow-lg"
                >
                  <Save size={16} className="mr-2" /> Guardar Términos Legales
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
