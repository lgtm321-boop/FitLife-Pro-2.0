import React, { useState, useEffect, useRef } from 'react';
import { Beaker, Leaf, Zap, HelpCircle, Send, MessageCircle, PlayCircle, AlertTriangle, Clock } from 'lucide-react';
import { Button } from './Button';
import { sendSupplementChatMessage } from '../services/geminiService';

interface Recipe {
    id: string;
    title: string;
    type: 'Pré-Treino' | 'Hipercalórico' | 'Recuperação';
    ingredients: {item: string, why: string}[];
    instructions: string[];
    usage: string;
    benefits: string;
    color: string;
}

const HOMEMADE_RECIPES: Recipe[] = [
    {
        id: 'hipercalorico',
        title: 'Hipercalórico Caseiro "Gorila"',
        type: 'Hipercalórico',
        color: 'from-yellow-600 to-orange-700',
        ingredients: [
            { item: '4 colheres de Aveia em Flocos', why: 'Carboidrato complexo de lenta absorção e fibras.' },
            { item: '2 Bananas Pratas maduras', why: 'Potássio e energia rápida (frutose).' },
            { item: '2 colheres de Pasta de Amendoim', why: 'Gorduras boas e muita densidade calórica.' },
            { item: '300ml de Leite (ou leite vegetal)', why: 'Base líquida e proteínas.' },
            { item: '1 colher de Cacau em pó 100%', why: 'Antioxidantes e sabor sem açúcar.' }
        ],
        instructions: [
            'Coloque todos os ingredientes no liquidificador.',
            'Bata na potência máxima por 1 minuto até ficar homogêneo.',
            'Se ficar muito grosso, adicione um pouco de água gelada.'
        ],
        usage: 'Tome no café da manhã ou como lanche da tarde (entre refeições). Evite logo antes de dormir por ser muito energético.',
        benefits: 'Ideal para quem quer ganhar peso (massa) e tem dificuldade de comer muito. Custo baixo e sem aditivos químicos.'
    },
    {
        id: 'pretreino',
        title: 'Pré-Treino "Relâmpago Natural"',
        type: 'Pré-Treino',
        color: 'from-red-600 to-pink-700',
        ingredients: [
            { item: '200ml de Café Preto forte (sem açúcar)', why: 'Cafeína pura para foco e energia.' },
            { item: '1 colher de chá de Canela em pó', why: 'Termogênico natural, ajuda a aquecer.' },
            { item: '1 colher de sopa de Mel', why: 'Glicose para energia imediata muscular.' },
            { item: 'Gengibre em pó (uma pitada)', why: 'Acelera metabolismo e melhora circulação.' }
        ],
        instructions: [
            'Faça o café fresco.',
            'Ainda quente, misture o mel para dissolver bem.',
            'Adicione a canela e o gengibre e mexa.',
            'Pode tomar morno ou colocar gelo para beber gelado.'
        ],
        usage: 'Consuma de 30 a 45 minutos antes do treino ou da pedalada.',
        benefits: 'Aumenta o estado de alerta, retarda a fadiga e melhora a performance sem os efeitos colaterais de estimulantes sintéticos.'
    },
    {
        id: 'isotenico',
        title: 'Isotônico Caseiro para Ciclistas',
        type: 'Recuperação',
        color: 'from-blue-600 to-cyan-700',
        ingredients: [
            { item: '500ml de Água Gelada', why: 'Hidratação base.' },
            { item: 'Suco de 1 Limão', why: 'Vitamina C e sabor refrescante.' },
            { item: '1 colher de sopa de Açúcar ou Mel', why: 'Reposição de glicogênio rápida.' },
            { item: '1 pitada generosa de Sal', why: 'Reposição de sódio perdido no suor (evita cãibras).' },
            { item: 'Água de Coco (Opcional, substitui metade da água)', why: 'Rico em potássio natural.' }
        ],
        instructions: [
            'Misture tudo em uma garrafa (squeeze).',
            'Agite bem até dissolver o açúcar e o sal.',
            'Leve gelado.'
        ],
        usage: 'Vá bebendo em pequenos goles durante pedais longos (acima de 1 hora) ou logo após chegar em casa.',
        benefits: 'Muito melhor e mais barato que isotônicos de mercado. Repõe eletrólitos essenciais para quem transpira muito.'
    }
];

export const Supplements: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'recipes' | 'chat'>('recipes');
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    
    // Chat States
    const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
        { role: 'ai', text: 'Olá! Sou sua IA especialista em suplementação natural. Quer ajuda para criar um suplemento específico ou tem dúvidas sobre Whey, Creatina, etc?' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isSending, setIsSending] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, activeTab]);

    const handleSendMessage = async () => {
        if (!inputText.trim() || isSending) return;

        const newMsg = { role: 'user' as const, text: inputText };
        setMessages(prev => [...prev, newMsg]);
        setInputText('');
        setIsSending(true);

        const history = messages.map(m => `${m.role === 'user' ? 'Usuário' : 'Especialista'}: ${m.text}`);
        const response = await sendSupplementChatMessage(history, newMsg.text);

        setMessages(prev => [...prev, { role: 'ai', text: response }]);
        setIsSending(false);
    };

    return (
        <div className="pb-24 animate-fade-in space-y-6">
            {/* Header */}
            <div className="bg-surface p-6 rounded-3xl shadow-soft border border-white/5 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-32 h-32 bg-green-500/10 rounded-bl-full -mr-10 -mt-10 z-0"></div>
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold text-secondary mb-2 flex items-center gap-2">
                    <Leaf className="text-green-500" /> Suplementação Natural
                    </h2>
                    <p className="text-muted text-sm max-w-md">
                        Economize dinheiro e potencialize seus resultados com receitas caseiras ou tire dúvidas com nosso especialista virtual.
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-surface rounded-xl border border-white/5">
                <button 
                    onClick={() => setActiveTab('recipes')}
                    className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'recipes' ? 'bg-primary text-white shadow-md' : 'text-muted hover:bg-white/5'}`}
                >
                    <Beaker className="w-4 h-4" /> Receitas Caseiras
                </button>
                <button 
                    onClick={() => setActiveTab('chat')}
                    className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'chat' ? 'bg-blue-600 text-white shadow-md' : 'text-muted hover:bg-white/5'}`}
                >
                    <MessageCircle className="w-4 h-4" /> Especialista IA
                </button>
            </div>

            {/* Content */}
            {activeTab === 'recipes' ? (
                <div className="grid gap-6 md:grid-cols-2">
                    {HOMEMADE_RECIPES.map(recipe => (
                        <div key={recipe.id} className="bg-surface rounded-3xl overflow-hidden border border-white/5 flex flex-col shadow-lg">
                             <div className={`bg-gradient-to-r ${recipe.color} p-4 text-white`}>
                                 <div className="flex justify-between items-start">
                                     <h3 className="font-bold text-lg">{recipe.title}</h3>
                                     <span className="bg-black/20 px-2 py-1 rounded text-xs font-bold uppercase">{recipe.type}</span>
                                 </div>
                             </div>
                             <div className="p-6 flex-1 flex flex-col">
                                 {/* Ingredients */}
                                 <div className="mb-4">
                                     <h4 className="text-primary text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                                         <Leaf className="w-4 h-4" /> Ingredientes
                                     </h4>
                                     <ul className="space-y-2">
                                         {recipe.ingredients.map((ing, i) => (
                                             <li key={i} className="text-sm border-b border-white/5 pb-2 last:border-0">
                                                 <span className="font-bold text-secondary block">{ing.item}</span>
                                                 <span className="text-xs text-muted italic">Para que serve: {ing.why}</span>
                                             </li>
                                         ))}
                                     </ul>
                                 </div>

                                 {/* Instructions */}
                                 <div className="mb-4 bg-black/20 p-4 rounded-xl">
                                     <h4 className="text-primary text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                         <PlayCircle className="w-4 h-4" /> Preparo
                                     </h4>
                                     <ol className="list-decimal list-inside text-sm text-gray-300 space-y-1">
                                         {recipe.instructions.map((step, i) => (
                                             <li key={i}>{step}</li>
                                         ))}
                                     </ol>
                                 </div>

                                 {/* Usage & Benefits */}
                                 <div className="mt-auto space-y-3">
                                     <div className="flex items-start gap-2">
                                         <Clock className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                                         <p className="text-xs text-gray-400"><span className="text-blue-400 font-bold">Quando tomar:</span> {recipe.usage}</p>
                                     </div>
                                     <div className="flex items-start gap-2">
                                         <Zap className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
                                         <p className="text-xs text-gray-400"><span className="text-yellow-400 font-bold">Benefício:</span> {recipe.benefits}</p>
                                     </div>
                                 </div>
                             </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-surface rounded-3xl border border-white/5 h-[60vh] flex flex-col overflow-hidden shadow-soft">
                    {/* Chat Header */}
                    <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400">
                            <HelpCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-secondary">Especialista em Suplementos</h3>
                            <p className="text-xs text-muted">Tire dúvidas sobre Creatina, Whey ou peça receitas.</p>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-accent/50">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                                    msg.role === 'user' 
                                    ? 'bg-blue-600 text-white rounded-tr-none' 
                                    : 'bg-white/10 text-gray-200 rounded-tl-none'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isSending && (
                             <div className="flex justify-start">
                                 <div className="bg-white/10 p-3 rounded-2xl rounded-tl-none flex gap-1">
                                     <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                                     <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></span>
                                     <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></span>
                                 </div>
                             </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-white/10 bg-surface">
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Ex: Como fazer um pré-treino com café?"
                                className="flex-1 bg-input border border-white/10 rounded-xl px-4 py-3 text-secondary focus:border-blue-500 outline-none"
                            />
                            <button 
                                onClick={handleSendMessage}
                                disabled={isSending || !inputText.trim()}
                                className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};