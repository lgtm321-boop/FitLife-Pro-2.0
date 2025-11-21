import React, { useState } from 'react';
import { GeneratedPlan } from '../types';
import { Utensils, Flame, Sunrise, Sun, Sunset, Moon, ChevronDown, Droplet, Wheat, CheckCircle2, RefreshCw, Calculator, Plus, Trash2, X, PieChart as PieIcon, FileWarning, Download, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface MealViewProps {
  plan: GeneratedPlan;
  onExport?: () => void;
}

interface CalcItem {
  id: number;
  name: string;
  portion: string;
  calories: number;
  protein: number;
}

export const MealView: React.FC<MealViewProps> = ({ plan, onExport }) => {
  
  // State para controlar quais refeições estão mostrando as substituições
  const [expandedSubstitutions, setExpandedSubstitutions] = useState<{[key: number]: boolean}>({});

  // State para a Calculadora
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcItems, setCalcItems] = useState<CalcItem[]>([]);
  const [newItem, setNewItem] = useState({ name: '', portion: '', calories: '', protein: '' });
  const [calcError, setCalcError] = useState<string | null>(null);

  // Verificação de segurança antes de calcular
  if (!plan || !plan.nutritionPlan || !Array.isArray(plan.nutritionPlan) || plan.nutritionPlan.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center h-64 bg-surface rounded-3xl border border-white/5 animate-fade-in">
            <div className="bg-orange-500/10 p-4 rounded-full mb-4">
                <FileWarning className="w-8 h-8 text-orange-400" />
            </div>
            <h3 className="text-lg font-bold text-secondary mb-2">Dados da Dieta Indisponíveis</h3>
            <p className="text-muted text-sm max-w-xs">
                O plano alimentar não foi carregado corretamente.
            </p>
        </div>
      );
  }

  // Totals Calculation
  const totalCalories = plan.nutritionPlan.reduce((acc, meal) => acc + (meal.totalCalories || 0), 0);
  const totalProtein = plan.nutritionPlan.reduce((acc, meal) => 
    acc + (meal.items ? meal.items.reduce((iAcc, item) => iAcc + (item.protein || 0), 0) : 0), 0
  );

  const toggleSubstitution = (idx: number) => {
      setExpandedSubstitutions(prev => ({...prev, [idx]: !prev[idx]}));
  }

  // Calculator Logic
  const handleAddItem = () => {
    setCalcError(null);
    
    // Validação: Todos os campos devem ser preenchidos
    if (!newItem.name.trim() || !newItem.portion.trim() || !newItem.calories || !newItem.protein) {
        setCalcError("Por favor, preencha todos os campos: Nome, Porção, Kcal e Proteína.");
        return;
    }

    const item: CalcItem = {
      id: Date.now(),
      name: newItem.name,
      portion: newItem.portion,
      calories: Number(newItem.calories),
      protein: Number(newItem.protein)
    };
    setCalcItems([...calcItems, item]);
    setNewItem({ name: '', portion: '', calories: '', protein: '' });
  };

  const handleRemoveItem = (id: number) => {
    setCalcItems(calcItems.filter(item => item.id !== id));
  };

  const closeCalculator = () => {
      setShowCalculator(false);
      setCalcError(null);
      setNewItem({ name: '', portion: '', calories: '', protein: '' });
  };

  const calcTotalCalories = calcItems.reduce((acc, item) => acc + item.calories, 0);
  const calcTotalProtein = calcItems.reduce((acc, item) => acc + item.protein, 0);

  // Prepare Data for Chart (Calories per Meal Type)
  const chartData = plan.nutritionPlan.map(meal => ({
    name: meal.type,
    value: meal.totalCalories || 0,
    color: '' // Will be set below
  }));

  // Color Palette for Chart
  const COLORS = ['#FACC15', '#FB923C', '#A855F7', '#38BDF8', '#00C896']; // Yellow, Orange, Purple, Blue, Green

  // Assign colors to data
  chartData.forEach((entry, index) => {
    entry.color = COLORS[index % COLORS.length];
  });

  // Helper to get styles based on meal name
  const getMealStyle = (name: string) => {
    const lower = (name || '').toLowerCase();
    if (lower.includes('café') || lower.includes('manhã')) {
      return { 
        icon: <Sunrise className="w-6 h-6" />, 
        color: 'text-yellow-400', 
        bg: 'bg-yellow-400/10', 
        border: 'border-yellow-400/20',
        gradient: 'from-yellow-400/5 to-transparent'
      };
    }
    if (lower.includes('almoço')) {
      return { 
        icon: <Sun className="w-6 h-6" />, 
        color: 'text-orange-400', 
        bg: 'bg-orange-400/10', 
        border: 'border-orange-400/20',
        gradient: 'from-orange-400/5 to-transparent'
      };
    }
    if (lower.includes('jantar') || lower.includes('ceia')) {
      return { 
        icon: <Moon className="w-6 h-6" />, 
        color: 'text-indigo-400', 
        bg: 'bg-indigo-400/10', 
        border: 'border-indigo-400/20',
        gradient: 'from-indigo-400/5 to-transparent'
      };
    }
    return { 
      icon: <Utensils className="w-6 h-6" />, 
      color: 'text-primary', 
      bg: 'bg-primary/10', 
      border: 'border-primary/20',
      gradient: 'from-primary/5 to-transparent'
    };
  };

  return (
    <div className="space-y-8 animate-fade-in pb-24">
      
      {/* Toolbar */}
      <div className="flex justify-between items-center no-print">
          <h2 className="text-2xl font-bold text-secondary">Painel Nutricional</h2>
          <div className="flex gap-2">
            {onExport && (
              <button 
                onClick={onExport}
                className="flex items-center gap-2 bg-white/5 hover:bg-primary hover:text-white text-muted px-4 py-2 rounded-full transition-all shadow-lg active:scale-95 border border-white/10"
                title="Baixar Dieta em PDF"
              >
                <Download className="w-5 h-5" />
                <span className="font-bold text-sm hidden sm:inline">PDF</span>
              </button>
            )}
            <button 
              onClick={() => setShowCalculator(true)}
              className="flex items-center gap-2 bg-surface border border-primary/30 hover:border-primary text-primary px-4 py-2 rounded-full transition-all shadow-lg hover:bg-primary/10 active:scale-95"
            >
              <Calculator className="w-5 h-5" />
              <span className="font-bold text-sm hidden sm:inline">Calculadora</span>
            </button>
          </div>
      </div>

      {/* Dashboard Header: Nutritional Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Card: Distribution by Meal */}
        <div className="lg:col-span-1 bg-surface p-6 rounded-3xl shadow-soft border border-white/5 flex flex-col relative overflow-hidden print:break-inside-avoid print:bg-white print:border-gray-300">
           <div className="flex items-center gap-2 mb-4 z-10">
              <PieIcon className="w-5 h-5 text-muted" />
              <h3 className="text-sm font-bold text-muted uppercase tracking-wider print:text-black">Distribuição Diária</h3>
           </div>
           
           <div className="flex-1 w-full min-h-[200px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={4}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0E1E2E', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                  formatter={(value: number) => [`${value} kcal`, 'Energia']}
                />
                <Legend 
                    verticalAlign="bottom" 
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '10px', opacity: 0.7, paddingTop: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Text Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-6">
                 <span className="text-2xl font-extrabold text-white print:text-black">{totalCalories}</span>
                 <span className="text-[9px] text-muted uppercase tracking-widest">Total Kcal</span>
            </div>
           </div>
        </div>

        {/* Stats Cards */}
        <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4 h-full">
                {/* Calories Target */}
                <div className="bg-surface p-5 rounded-3xl border border-white/5 flex flex-col justify-between group hover:border-orange-500/30 transition-all print:bg-white print:border-gray-300">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-500 group-hover:scale-110 transition-transform">
                            <Flame className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-bold text-orange-400 uppercase bg-orange-500/10 px-2 py-1 rounded-lg border border-orange-500/20 print:text-black print:border-gray-400">Diário</span>
                    </div>
                    <div>
                        <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-white print:text-black">{totalCalories}</span>
                        <span className="text-sm text-muted">kcal</span>
                        </div>
                        <p className="text-xs text-muted mt-1">Meta de consumo calculada</p>
                    </div>
                </div>

                {/* Protein Target */}
                <div className="bg-surface p-5 rounded-3xl border border-white/5 flex flex-col justify-between group hover:border-primary/30 transition-all print:bg-white print:border-gray-300">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-3 bg-primary/10 rounded-2xl text-primary group-hover:scale-110 transition-transform">
                            <Wheat className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-bold text-primary uppercase bg-primary/10 px-2 py-1 rounded-lg border border-primary/20 print:text-black print:border-gray-400">Construção</span>
                    </div>
                    <div>
                        <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-white print:text-black">{Math.round(totalProtein)}g</span>
                        <span className="text-sm text-muted">proteína</span>
                        </div>
                        <p className="text-xs text-muted mt-1">Essencial para hipertrofia</p>
                    </div>
                </div>
            </div>
            
            {/* Hydration Tip */}
            <div className="bg-gradient-to-r from-blue-900/40 to-blue-800/20 p-4 rounded-2xl border border-blue-500/20 flex items-center gap-4 print:bg-white print:border-gray-300">
                <div className="p-2 bg-blue-500/20 rounded-full text-blue-400 shrink-0 animate-pulse-slow print:hidden">
                    <Droplet className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-blue-200 font-bold text-sm print:text-black">Dica de Hidratação</p>
                    <p className="text-blue-300/60 text-xs print:text-gray-600">Beba um copo d'água 20min antes de cada refeição para melhorar a digestão.</p>
                </div>
            </div>
        </div>
      </div>

      {/* Meals List - Refined Grouping */}
      <div>
          <h2 className="text-xl font-bold text-secondary mb-6 flex items-center gap-2 print:text-black">
            <Utensils className="w-5 h-5 text-primary print:text-black" />
            Roteiro de Refeições
          </h2>
          
          <div className="space-y-6">
            {plan.nutritionPlan.map((meal, idx) => {
                const style = getMealStyle(meal.type);
                const mealProtein = meal.items ? meal.items.reduce((acc, item) => acc + (item.protein || 0), 0) : 0;
                const isSubOpen = expandedSubstitutions[idx];
                
                return (
                <div key={idx} className={`bg-surface border ${style.border} rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group print:bg-white print:border-gray-300 print:shadow-none print:break-inside-avoid`}>
                    
                    {/* Meal Header with Stats Summary */}
                    <div className={`p-5 bg-gradient-to-r from-white/[0.03] to-transparent flex flex-col md:flex-row md:items-center justify-between gap-4 print:bg-none`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-2xl ${style.bg} ${style.color} flex items-center justify-center shadow-sm border border-white/5 shrink-0 print:border-gray-400`}>
                                {style.icon}
                            </div>
                            <div>
                                <h4 className="font-bold text-xl text-white group-hover:text-primary transition-colors print:text-black">{meal.type}</h4>
                                <div className="flex items-center gap-3 mt-1">
                                    {/* Meal Summary Badges */}
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 bg-black/20 px-2 py-1 rounded-lg border border-white/5 print:bg-gray-100 print:text-black print:border-gray-300">
                                        <Flame className="w-3 h-3 text-orange-500" />
                                        <span>{meal.totalCalories} kcal</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 bg-black/20 px-2 py-1 rounded-lg border border-white/5 print:bg-gray-100 print:text-black print:border-gray-300">
                                        <Wheat className="w-3 h-3 text-primary" />
                                        <span>{Math.round(mealProtein)}g Prot</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ingredients List Table */}
                    <div className="px-5 pb-5">
                        <div className="bg-black/20 rounded-xl border border-white/5 overflow-hidden print:bg-white print:border-gray-300">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5 text-[10px] uppercase tracking-wider text-muted print:text-black print:border-gray-300">
                                        <th className="p-3 font-bold">Alimento</th>
                                        <th className="p-3 font-bold text-right hidden sm:table-cell">Porção</th>
                                        <th className="p-3 font-bold text-right">Kcal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 print:divide-gray-300">
                                    {meal.items && meal.items.map((item, i) => (
                                        <tr key={i} className="hover:bg-white/5 transition-colors print:text-black">
                                            <td className="p-3">
                                                <div className="flex items-center gap-3">
                                                    <CheckCircle2 className="w-4 h-4 text-primary/30 shrink-0 print:text-black" />
                                                    <div>
                                                        <span className="text-sm font-medium text-gray-200 block print:text-black">{item.name}</span>
                                                        <span className="text-xs text-muted sm:hidden">{item.portion}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-3 text-right text-sm text-gray-400 font-mono hidden sm:table-cell whitespace-nowrap print:text-black">
                                                {item.portion}
                                            </td>
                                            <td className="p-3 text-right">
                                                <span className="text-xs font-bold text-white bg-white/10 px-2 py-1 rounded-md print:text-black print:bg-gray-100">
                                                    {item.calories}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Substitutions Section - Visible on Print as List */}
                    {meal.substitutions && meal.substitutions.length > 0 && (
                        <div className="border-t border-white/5 bg-black/10 print:bg-white print:border-gray-300 print:p-4">
                            {/* Toggle Button - Hidden on Print */}
                            <button 
                                onClick={() => toggleSubstitution(idx)}
                                className={`w-full py-3 px-5 flex items-center justify-center gap-3 text-sm font-bold transition-all duration-300 group outline-none no-print ${
                                    isSubOpen 
                                    ? 'text-primary bg-primary/5' 
                                    : 'text-muted hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <span className="uppercase tracking-widest text-[10px]">
                                    {isSubOpen ? 'Ocultar Opções de Troca' : 'Ver Substituições'}
                                </span>
                                <ChevronDown className={`w-4 h-4 transition-transform duration-500 ${isSubOpen ? 'rotate-180 text-primary' : 'group-hover:translate-y-1'}`} />
                            </button>
                            
                            {/* Web View Logic */}
                            <div 
                                className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] no-print ${
                                    isSubOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                }`}
                            >
                                <div className="p-5 pt-0">
                                    <div className="bg-surface border border-white/10 rounded-xl p-4 relative overflow-hidden mt-2">
                                         <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                                         <div className="flex items-center gap-2 mb-3 text-primary">
                                            <RefreshCw className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase">Pode substituir por:</span>
                                         </div>
                                         <ul className="space-y-3">
                                            {meal.substitutions.map((sub, sIdx) => (
                                                <li key={sIdx} className="text-sm text-gray-300 flex items-start gap-3 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></span>
                                                    {sub}
                                                </li>
                                            ))}
                                         </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Print View Logic (Always Show substitutions list if exists) */}
                            <div className="hidden print:block text-sm text-gray-600 mt-2">
                                <strong>Opções de Substituição:</strong>
                                <ul className="list-disc list-inside pl-2 mt-1">
                                    {meal.substitutions.map((sub, sIdx) => (
                                        <li key={sIdx}>{sub}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                    
                    {/* Footer decoration */}
                    {!isSubOpen && <div className="h-1 w-full bg-gradient-to-r from-transparent via-white/5 to-transparent no-print"></div>}
                </div>
            )})}
          </div>
      </div>

      {/* Calculator Modal */}
      {showCalculator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in no-print">
          <div className="bg-surface w-full max-w-lg rounded-3xl shadow-2xl border border-white/10 flex flex-col max-h-[90vh]">
             {/* Header */}
             <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Calculator className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-secondary">Calculadora</h2>
                        <p className="text-xs text-muted">Simule refeições personalizadas</p>
                    </div>
                 </div>
                 <button onClick={closeCalculator} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                 </button>
             </div>

             {/* Body */}
             <div className="p-6 space-y-6 overflow-y-auto">
                 
                 {/* Error Message */}
                 {calcError && (
                    <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-red-400 text-sm animate-fade-in">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{calcError}</span>
                    </div>
                 )}

                 {/* Input Area */}
                 <div className="grid grid-cols-12 gap-3 items-end">
                     <div className="col-span-12 md:col-span-4 space-y-1">
                         <label className="text-[10px] font-bold text-muted uppercase ml-1">Alimento</label>
                         <input 
                            type="text" 
                            placeholder="Ex: Ovo cozido"
                            value={newItem.name}
                            onChange={e => setNewItem({...newItem, name: e.target.value})}
                            className="w-full bg-input border border-white/10 rounded-xl p-3 text-sm text-secondary focus:border-primary outline-none"
                         />
                     </div>
                     <div className="col-span-6 md:col-span-3 space-y-1">
                         <label className="text-[10px] font-bold text-muted uppercase ml-1">Porção</label>
                         <input 
                            type="text" 
                            placeholder="Ex: 50g"
                            value={newItem.portion}
                            onChange={e => setNewItem({...newItem, portion: e.target.value})}
                            className="w-full bg-input border border-white/10 rounded-xl p-3 text-sm text-secondary focus:border-primary outline-none"
                         />
                     </div>
                     <div className="col-span-3 md:col-span-2 space-y-1">
                         <label className="text-[10px] font-bold text-muted uppercase ml-1">Kcal</label>
                         <input 
                            type="number" 
                            placeholder="0"
                            value={newItem.calories}
                            onChange={e => setNewItem({...newItem, calories: e.target.value})}
                            className="w-full bg-input border border-white/10 rounded-xl p-3 text-sm text-secondary focus:border-primary outline-none"
                         />
                     </div>
                     <div className="col-span-3 md:col-span-2 space-y-1">
                         <label className="text-[10px] font-bold text-muted uppercase ml-1">Prot(g)</label>
                         <input 
                            type="number" 
                            placeholder="0"
                            value={newItem.protein}
                            onChange={e => setNewItem({...newItem, protein: e.target.value})}
                            className="w-full bg-input border border-white/10 rounded-xl p-3 text-sm text-secondary focus:border-primary outline-none"
                         />
                     </div>
                     <div className="col-span-12 md:col-span-1">
                         <button 
                            onClick={handleAddItem}
                            className="w-full bg-primary hover:bg-[#00B587] text-white rounded-xl p-3 flex items-center justify-center transition-colors shadow-lg"
                         >
                             <Plus className="w-5 h-5" />
                         </button>
                     </div>
                 </div>

                 {/* List */}
                 <div className="bg-black/20 rounded-xl border border-white/5 min-h-[150px] p-2 space-y-2">
                     {calcItems.length === 0 && (
                         <div className="h-full flex flex-col items-center justify-center text-muted p-8 opacity-50">
                             <Utensils className="w-8 h-8 mb-2" />
                             <span className="text-sm">Adicione itens para calcular</span>
                         </div>
                     )}
                     {calcItems.map(item => (
                         <div key={item.id} className="bg-surface p-3 rounded-lg flex items-center justify-between animate-slide-up border border-white/5">
                             <div>
                                 <p className="font-bold text-sm text-white">{item.name}</p>
                                 <p className="text-xs text-muted">{item.portion}</p>
                             </div>
                             <div className="flex items-center gap-4">
                                 <div className="text-right">
                                     <span className="block text-xs font-bold text-primary">{item.calories} kcal</span>
                                     <span className="block text-[10px] text-muted">{item.protein}g prot</span>
                                 </div>
                                 <button onClick={() => handleRemoveItem(item.id)} className="text-red-400 hover:text-red-300 p-1 hover:bg-red-500/10 rounded">
                                     <Trash2 className="w-4 h-4" />
                                 </button>
                             </div>
                         </div>
                     ))}
                 </div>
             </div>

             {/* Footer / Totals */}
             <div className="p-6 border-t border-white/10 bg-white/5 mt-auto">
                 <div className="flex justify-between items-center">
                     <span className="text-sm font-bold text-muted uppercase">Total Estimado</span>
                     <div className="flex gap-6">
                         <div className="text-right">
                             <span className="block text-2xl font-bold text-white">{calcTotalCalories}</span>
                             <span className="text-xs text-primary uppercase font-bold">Kcal</span>
                         </div>
                         <div className="text-right">
                             <span className="block text-2xl font-bold text-white">{calcTotalProtein}g</span>
                             <span className="text-xs text-blue-400 uppercase font-bold">Proteína</span>
                         </div>
                     </div>
                 </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};