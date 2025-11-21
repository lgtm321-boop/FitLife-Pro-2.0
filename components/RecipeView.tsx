
import React, { useState, useEffect } from 'react';
import { PlayCircle, Clock, Flame, ChefHat, ChevronDown, ExternalLink, Search, Youtube, Star } from 'lucide-react';
import { Logo } from './Logo';
import { UserProfile } from '../types';

interface Recipe {
  id: string;
  title: string;
  category: 'Café da Manhã' | 'Almoço/Jantar' | 'Lanches' | 'Doces Fit' | 'Fast Food Fit';
  time: string;
  calories: number;
  protein: number;
  ingredients: string[];
  steps: string[];
}

const RECIPES_DB: Recipe[] = [
  {
    id: '1',
    title: 'Crepioca de Frango Cremoso',
    category: 'Café da Manhã',
    time: '10 min',
    calories: 320,
    protein: 24,
    ingredients: ['1 ovo', '2 colheres de sopa de goma de tapioca', '1 colher de requeijão light', '50g de frango desfiado temperado', 'Sal a gosto'],
    steps: ['Misture o ovo e a tapioca até ficar homogêneo.', 'Despeje em frigideira antiaderente em fogo baixo.', 'Quando firmar, vire.', 'Adicione o frango e o requeijão, dobre e sirva.']
  },
  {
    id: '2',
    title: 'Panqueca de Banana Fit',
    category: 'Café da Manhã',
    time: '10 min',
    calories: 250,
    protein: 12,
    ingredients: ['1 banana madura amassada', '2 ovos', '1 colher de aveia em flocos', 'Canela a gosto', 'Fio de mel (opcional)'],
    steps: ['Amasse bem a banana.', 'Misture com os ovos e a aveia.', 'Leve à frigideira untada com óleo de coco.', 'Doure dos dois lados e finalize com canela.']
  },
  {
    id: '3',
    title: 'Escondidinho de Batata Doce',
    category: 'Almoço/Jantar',
    time: '30 min',
    calories: 400,
    protein: 30,
    ingredients: ['150g de batata doce cozida e amassada', '150g de patinho moído refogado', 'Temperos verdes', '1 fatia de queijo minas'],
    steps: ['Faça uma camada com metade da batata doce.', 'Adicione a carne moída.', 'Cubra com o restante da batata.', 'Coloque o queijo por cima e leve ao forno/airfryer para gratinar.']
  },
  {
    id: '4',
    title: 'Omelete Super Proteico',
    category: 'Almoço/Jantar',
    time: '10 min',
    calories: 350,
    protein: 28,
    ingredients: ['3 ovos', 'Espinafre picado', 'Tomate cereja', '30g de queijo cottage', 'Orégano'],
    steps: ['Bata os ovos com o cottage.', 'Misture os vegetais.', 'Despeje na frigideira em fogo baixo.', 'Tampe para cozinhar por igual.']
  },
  {
    id: '5',
    title: 'Smoothie de Frutas Vermelhas',
    category: 'Lanches',
    time: '5 min',
    calories: 180,
    protein: 15,
    ingredients: ['1 xícara de frutas vermelhas congeladas', '1 scoop de Whey Protein (opcional)', '200ml de água de coco ou leite desnatado'],
    steps: ['Bata tudo no liquidificador até ficar cremoso.', 'Beba imediatamente bem gelado.']
  },
  {
    id: '6',
    title: 'Muffin Salgado de Legumes',
    category: 'Lanches',
    time: '25 min',
    calories: 120,
    protein: 8,
    ingredients: ['2 ovos', 'Cenoura ralada', 'Brócolis picado', '2 colheres de farinha de aveia', 'Fermento em pó'],
    steps: ['Misture todos os ingredientes.', 'Coloque em forminhas de silicone.', 'Asse por 20 min a 180 graus.']
  },
  // RECEITAS ADAPTADAS PARA PONTOS FRACOS
  {
    id: '7',
    title: 'Pizza de Frigideira Low Carb',
    category: 'Fast Food Fit',
    time: '15 min',
    calories: 280,
    protein: 18,
    ingredients: ['1 ovo', '2 colheres de farinha de aveia', '1 colher de azeite', 'Molho de tomate caseiro', 'Queijo mussarela light', 'Orégano e tomate'],
    steps: ['Misture ovo, aveia e azeite.', 'Coloque na frigideira como uma panqueca grossa.', 'Vire, adicione o molho, queijo e orégano.', 'Tampe para derreter o queijo.']
  },
  {
    id: '8',
    title: 'Hambúrguer Artesanal de Patinho',
    category: 'Fast Food Fit',
    time: '20 min',
    calories: 380,
    protein: 35,
    ingredients: ['150g de patinho moído', 'Temperos (sal, pimenta, alho)', '1 fatia de queijo prato', 'Alface e Tomate', 'Pão integral ou de hambúrguer fit'],
    steps: ['Tempere a carne e molde no formato de hambúrguer.', 'Grelhe em frigideira bem quente ou na churrasqueira.', 'Coloque o queijo para derreter no final.', 'Monte no pão com salada.']
  },
  {
    id: '9',
    title: 'Mousse de Chocolate Proteico',
    category: 'Doces Fit',
    time: '5 min',
    calories: 200,
    protein: 20,
    ingredients: ['100g de iogurte grego natural', '1 colher de cacau 100%', '1 scoop de Whey de Chocolate', 'Adoçante a gosto'],
    steps: ['Misture vigorosamente o iogurte com o whey e o cacau.', 'Leve à geladeira por 15 min para firmar.', 'Sirva com raspas de chocolate amargo.']
  },
  {
    id: '10',
    title: 'Brigadeiro de Colher Fit',
    category: 'Doces Fit',
    time: '10 min',
    calories: 150,
    protein: 8,
    ingredients: ['2 colheres de leite em pó desnatado', '1 colher de cacau 100%', 'Água quente (pouca, para dar ponto)', 'Adoçante'],
    steps: ['Misture os secos.', 'Vá adicionando água quente bem aos poucos, mexendo sempre até virar um creme.', 'Pode adicionar whey se quiser mais proteína.']
  }
];

interface RecipeViewProps {
    profile?: UserProfile;
}

export const RecipeView: React.FC<RecipeViewProps> = ({ profile }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('Todos');

  // Lógica para recomendar baseada no ponto fraco
  useEffect(() => {
      if (profile?.foodCravings) {
          if (profile.foodCravings.includes('Doces')) setActiveFilter('Doces Fit');
          else if (profile.foodCravings.includes('Pizza') || profile.foodCravings.includes('Massas')) setActiveFilter('Fast Food Fit');
          else if (profile.foodCravings.includes('Lanches') || profile.foodCravings.includes('Hambúrguer')) setActiveFilter('Fast Food Fit');
      }
  }, [profile]);

  const filteredRecipes = RECIPES_DB.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || r.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'Todos' || r.category === activeFilter || (activeFilter === 'Fast Food Fit' && (r.category === 'Fast Food Fit' || r.title.includes('Pizza') || r.title.includes('Hambúrguer')));
    return matchesSearch && matchesFilter;
  });

  const openYouTube = (recipeTitle: string) => {
    const query = encodeURIComponent(`receita fit ${recipeTitle}`);
    window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
  };

  const getCravingMessage = () => {
      if (!profile?.foodCravings || profile.foodCravings === 'Nenhum') return null;
      return (
          <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl mb-6 flex items-center gap-3">
              <div className="bg-primary text-white p-2 rounded-full">
                  <Star className="w-5 h-5 fill-current" />
              </div>
              <div>
                  <p className="text-sm font-bold text-secondary">Recomendação Personalizada</p>
                  <p className="text-xs text-muted">Você disse que gosta de <span className="text-primary font-bold">{profile.foodCravings}</span>. Separamos estas receitas saudáveis para matar a vontade sem sair da dieta!</p>
              </div>
          </div>
      )
  };

  return (
    <div className="space-y-6 animate-fade-in pb-24">
      {/* Header */}
      <div className="bg-surface p-6 rounded-3xl shadow-soft border border-white/5 relative overflow-hidden">
         <div className="absolute right-0 top-0 w-32 h-32 bg-primary/10 rounded-bl-full -mr-10 -mt-10 z-0"></div>
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
             <div>
                <div className="flex items-center gap-3 mb-2">
                    <Logo size="sm" />
                    <span className="text-primary font-bold uppercase tracking-wider text-xs bg-primary/10 px-2 py-1 rounded">Receitas</span>
                </div>
                <h2 className="text-2xl font-bold text-secondary">Cozinha Inteligente</h2>
                <p className="text-muted text-sm">Pratos deliciosos alinhados ao seu objetivo.</p>
             </div>
             
             {/* Search Bar */}
             <div className="relative w-full md:w-auto">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                <input 
                    type="text" 
                    placeholder="Buscar receita..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-64 bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-secondary focus:border-primary outline-none"
                />
             </div>
         </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
          {['Todos', 'Café da Manhã', 'Almoço/Jantar', 'Lanches', 'Doces Fit', 'Fast Food Fit'].map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeFilter === cat ? 'bg-primary text-white shadow-glow' : 'bg-surface text-muted hover:bg-white/5'}`}
              >
                  {cat}
              </button>
          ))}
      </div>

      {/* Personal Recommendation Banner */}
      {activeFilter !== 'Todos' && getCravingMessage()}

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRecipes.map((recipe) => {
            const isExpanded = expandedRecipe === recipe.id;
            
            return (
            <div key={recipe.id} className="bg-surface rounded-3xl overflow-hidden border border-white/5 shadow-lg hover:border-primary/30 transition-all group">
                {/* Card Header */}
                <div className="p-5 bg-gradient-to-r from-white/5 to-transparent border-b border-white/5 flex justify-between items-start">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-glow">
                            <ChefHat className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-secondary leading-tight group-hover:text-primary transition-colors">{recipe.title}</h3>
                            <span className="text-xs text-muted bg-white/5 px-2 py-0.5 rounded mt-1 inline-block">{recipe.category}</span>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 border-b border-white/5 divide-x divide-white/5 bg-black/20">
                    <div className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1 text-muted text-[10px] uppercase font-bold mb-1">
                            <Clock className="w-3 h-3" /> Tempo
                        </div>
                        <span className="text-sm font-bold text-secondary">{recipe.time}</span>
                    </div>
                    <div className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1 text-orange-400 text-[10px] uppercase font-bold mb-1">
                            <Flame className="w-3 h-3" /> Kcal
                        </div>
                        <span className="text-sm font-bold text-secondary">{recipe.calories}</span>
                    </div>
                    <div className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1 text-blue-400 text-[10px] uppercase font-bold mb-1">
                            <PlayCircle className="w-3 h-3" /> Prot
                        </div>
                        <span className="text-sm font-bold text-secondary">{recipe.protein}g</span>
                    </div>
                </div>

                {/* Content (Expandable) */}
                <div className={`transition-all duration-300 ${isExpanded ? 'max-h-[600px]' : 'max-h-[160px]'} overflow-hidden relative`}>
                    <div className="p-5 space-y-4">
                        {/* Ingredients */}
                        <div>
                            <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Ingredientes</h4>
                            <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
                                {recipe.ingredients.slice(0, isExpanded ? undefined : 2).map((ing, i) => (
                                    <li key={i}>{ing}</li>
                                ))}
                                {!isExpanded && recipe.ingredients.length > 2 && <li className="list-none text-muted text-xs italic pt-1">... e mais {recipe.ingredients.length - 2} itens</li>}
                            </ul>
                        </div>

                        {/* Steps (Only visible when expanded) */}
                        <div className={`${isExpanded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
                            <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-2 mt-4">Modo de Preparo</h4>
                            <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
                                {recipe.steps.map((step, i) => (
                                    <li key={i} className="leading-relaxed">{step}</li>
                                ))}
                            </ol>
                        </div>
                    </div>
                    
                    {/* Fade overlay when collapsed */}
                    {!isExpanded && (
                        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-surface to-transparent pointer-events-none"></div>
                    )}
                </div>

                {/* Actions Footer */}
                <div className="p-4 border-t border-white/5 bg-black/20 flex gap-3">
                    <button 
                        onClick={() => setExpandedRecipe(isExpanded ? null : recipe.id)}
                        className="flex-1 py-2 rounded-xl text-sm font-bold text-secondary bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                    >
                        {isExpanded ? 'Menos Detalhes' : 'Ver Receita Completa'}
                        <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <button 
                        onClick={() => openYouTube(recipe.title)}
                        className="flex-1 py-2 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-900/20"
                        title="Buscar vídeo no YouTube"
                    >
                        <Youtube className="w-4 h-4 fill-current" /> Ver Tutorial
                    </button>
                </div>
            </div>
            );
        })}
      </div>

      {filteredRecipes.length === 0 && (
          <div className="text-center py-10 text-muted bg-surface rounded-3xl border border-white/5">
              <p>Nenhuma receita encontrada para o filtro atual.</p>
          </div>
      )}
    </div>
  );
};
