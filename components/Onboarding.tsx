
import React, { useState } from 'react';
import { UserProfile, UserGoal, UserLevel, GeneratedPlan } from '../types';
import { Button } from './Button';
import { generateUserPlan } from '../services/geminiService';
import { Dumbbell, Utensils, Activity, ArrowRight, Check, Bike, Beaker, Camera, Trophy, Home, Pizza, AlertOctagon, Plus } from 'lucide-react';
import { Logo } from './Logo';

interface OnboardingProps {
  onComplete: (profile: UserProfile, plan: GeneratedPlan) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State auxiliar para equipamentos de casa
  const [homeEquipment, setHomeEquipment] = useState({
    dumbbells: false,
    bands: false,
    jumpRope: false,
    bar: false,
    kettlebell: false,
    bench: false,
    ankleWeights: false,
    barbell: false
  });
  const [otherEquipment, setOtherEquipment] = useState('');
  
  const [trainingLocation, setTrainingLocation] = useState<'gym' | 'home'>('gym');

  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    age: 25,
    weight: 70,
    height: 170,
    goal: UserGoal.LoseWeight,
    level: UserLevel.Beginner,
    equipment: 'Academia completa',
    dietaryRestrictions: '',
    dailyCommute: '',
    extraActivity: '',
    wantsSupplements: false,
    playsSoccer: false,
    startingPhoto: '',
    foodCravings: 'Nenhum',
    physicalLimitations: ''
  });

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, startingPhoto: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addInjuryTag = (injury: string) => {
    const current = profile.physicalLimitations || '';
    if (!current.includes(injury)) {
      const separator = current.length > 0 ? ', ' : '';
      setProfile({ ...profile, physicalLimitations: current + separator + injury });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    
    // Timeout de segurança: se demorar mais de 45s, avisa o usuário
    const timeoutId = setTimeout(() => {
        setLoading(false);
        setError("A IA está demorando muito para responder. Verifique sua conexão e tente novamente.");
    }, 45000);

    try {
      // Construir string final de equipamento
      let finalEquipment = '';
      if (trainingLocation === 'gym') {
        finalEquipment = 'Academia Completa (Máquinas, Barras, Halteres)';
      } else {
        const items = [];
        items.push('Peso do Corpo (Calistenia)');
        if (homeEquipment.dumbbells) items.push('Halteres');
        if (homeEquipment.bands) items.push('Elásticos');
        if (homeEquipment.jumpRope) items.push('Corda de Pular');
        if (homeEquipment.bar) items.push('Barra Fixa de Porta');
        if (homeEquipment.kettlebell) items.push('Kettlebell');
        if (homeEquipment.bench) items.push('Banco Regulável');
        if (homeEquipment.ankleWeights) items.push('Caneleiras');
        if (homeEquipment.barbell) items.push('Barra Longa e Anilhas');
        
        if (otherEquipment.trim()) items.push(`Outros: ${otherEquipment.trim()}`);
        
        finalEquipment = `Em Casa com: ${items.join(', ')}`;
      }

      const finalProfile = { ...profile, equipment: finalEquipment };
      const plan = await generateUserPlan(finalProfile);
      
      clearTimeout(timeoutId);
      onComplete(finalProfile, plan);
    } catch (error) {
      clearTimeout(timeoutId);
      console.error(error);
      setError("Ocorreu um erro ao gerar seu plano. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: "Seus Dados", icon: <Activity className="w-6 h-6" /> },
    { title: "Objetivo", icon: <Dumbbell className="w-6 h-6" /> },
    { title: "Rotina", icon: <Bike className="w-6 h-6" /> },
    { title: "Saúde & Dieta", icon: <Pizza className="w-6 h-6" /> }, // Nova Etapa
    { title: "Finalizar", icon: <Utensils className="w-6 h-6" /> }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center animate-fade-in bg-accent">
        <Logo size="xl" className="mb-8 animate-pulse" />
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-bold text-secondary mb-2">Construindo seu plano...</h2>
        <p className="text-muted mb-8">A IA está adaptando o treino para suas limitações e gerando receitas saudáveis.</p>
        <p className="text-xs text-gray-500">Isso pode levar alguns segundos.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 max-w-xl mx-auto bg-accent">
      <div className="mb-8">
        <Logo size="md" />
      </div>
      
      {/* Progress Bar */}
      <div className="w-full flex items-center justify-between mb-8 px-2 md:px-4 overflow-x-auto md:overflow-visible">
        {steps.map((s, i) => (
          <div key={i} className={`flex flex-col items-center relative z-10 min-w-[60px] ${i + 1 === step ? 'text-primary' : 'text-muted'}`}>
            <div className={`w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-2 border-2 transition-all shadow-sm ${i + 1 <= step ? 'border-primary bg-surface text-primary' : 'border-white/10 bg-surface text-gray-500'}`}>
              {i + 1 < step ? <Check className="w-4 h-4 md:w-6 md:h-6" /> : s.icon}
            </div>
            <span className={`hidden md:block text-[10px] md:text-xs uppercase font-bold tracking-wider ${i + 1 === step ? 'text-secondary' : 'text-gray-600'}`}>{s.title}</span>
          </div>
        ))}
      </div>

      {error && (
        <div className="w-full mb-6 bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-center animate-fade-in">
            <p className="text-red-400 font-bold text-sm mb-2">{error}</p>
            <button onClick={() => setError(null)} className="text-xs text-white bg-red-500/20 px-3 py-1 rounded-lg hover:bg-red-500/40">Tentar Novamente</button>
        </div>
      )}

      <div className="w-full bg-surface p-6 md:p-8 rounded-3xl shadow-soft border border-white/5">
        {step === 1 && (
          <div className="space-y-5 animate-slide-up">
            <h2 className="text-2xl font-bold text-secondary mb-6">Vamos começar com o básico</h2>
            
            <div>
              <label className="block text-xs font-bold text-muted uppercase mb-1">Nome</label>
              <input 
                type="text" 
                value={profile.name}
                onChange={e => setProfile({...profile, name: e.target.value})}
                className="w-full bg-input border border-white/5 rounded-xl p-4 text-secondary focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                placeholder="Como devemos te chamar?"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-muted uppercase mb-1">Idade</label>
                <input 
                  type="number" 
                  value={profile.age}
                  onChange={e => setProfile({...profile, age: Number(e.target.value)})}
                  className="w-full bg-input border border-white/5 rounded-xl p-4 text-secondary focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted uppercase mb-1">Peso (kg)</label>
                <input 
                  type="number" 
                  value={profile.weight}
                  onChange={e => setProfile({...profile, weight: Number(e.target.value)})}
                  className="w-full bg-input border border-white/5 rounded-xl p-4 text-secondary focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted uppercase mb-1">Altura (cm)</label>
                <input 
                  type="number" 
                  value={profile.height}
                  onChange={e => setProfile({...profile, height: Number(e.target.value)})}
                  className="w-full bg-input border border-white/5 rounded-xl p-4 text-secondary focus:border-primary outline-none"
                />
              </div>
            </div>
            <Button onClick={handleNext} fullWidth disabled={!profile.name}>Continuar <ArrowRight className="inline w-4 h-4 ml-2"/></Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-slide-up">
            <h2 className="text-2xl font-bold text-secondary">Qual seu objetivo principal?</h2>
            
            <div className="space-y-3">
              {Object.values(UserGoal).map((goal) => (
                <button
                  key={goal}
                  onClick={() => setProfile({...profile, goal})}
                  className={`w-full p-4 rounded-xl text-left transition-all border-2 ${profile.goal === goal ? 'border-primary bg-primary/10 text-primary shadow-glow' : 'border-transparent bg-input text-gray-400 hover:bg-white/5'}`}
                >
                  <span className="font-bold text-lg">{goal}</span>
                </button>
              ))}
            </div>

            <div className="pt-4">
              <label className="block text-xs font-bold text-muted uppercase mb-3">Qual seu nível de experiência?</label>
              <div className="grid grid-cols-3 gap-2">
                 {Object.values(UserLevel).map((level) => (
                    <button
                      key={level}
                      onClick={() => setProfile({...profile, level})}
                      className={`p-3 rounded-lg text-sm font-medium transition-all shadow-sm ${profile.level === level ? 'bg-white text-accent font-bold' : 'bg-input text-gray-500 hover:bg-white/5'}`}
                    >
                      {level}
                    </button>
                 ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={handleBack} className="flex-1">Voltar</Button>
              <Button onClick={handleNext} className="flex-1">Continuar</Button>
            </div>
          </div>
        )}

        {step === 3 && (
            <div className="space-y-6 animate-slide-up">
                <h2 className="text-2xl font-bold text-secondary">Atividade e Esportes</h2>
                
                {/* Opção de Futebol */}
                <div 
                   onClick={() => setProfile({...profile, playsSoccer: !profile.playsSoccer})}
                   className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 ${profile.playsSoccer ? 'border-green-500 bg-green-500/10' : 'border-white/5 bg-input'}`}
                >
                    <div className={`p-2 rounded-full ${profile.playsSoccer ? 'bg-green-500 text-black' : 'bg-white/5 text-gray-500'}`}>
                        <Trophy className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <p className="font-bold text-secondary">Jogo Futebol / Esportes no FDS</p>
                        <p className="text-xs text-muted">Ajustaremos sua dieta e recuperação para os jogos.</p>
                    </div>
                    {profile.playsSoccer && <Check className="w-5 h-5 text-green-500" />}
                </div>

                <div>
                    <label className="block text-xs font-bold text-muted uppercase mb-2">Deslocamento Diário</label>
                    <input 
                        type="text" 
                        value={profile.dailyCommute}
                        onChange={e => setProfile({...profile, dailyCommute: e.target.value})}
                        className="w-full bg-input border border-white/5 rounded-xl p-4 text-secondary focus:border-primary outline-none placeholder-gray-600"
                        placeholder="Ex: Vou de bike 8km, Caminho 2km..."
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-muted uppercase mb-2">Outras Atividades (Opcional)</label>
                    <input 
                        type="text" 
                        value={profile.extraActivity}
                        onChange={e => setProfile({...profile, extraActivity: e.target.value})}
                        className="w-full bg-input border border-white/5 rounded-xl p-4 text-secondary focus:border-primary outline-none placeholder-gray-600"
                        placeholder="Ex: Corrida leve 5km na terça..."
                    />
                </div>

                <div className="flex gap-3">
                    <Button variant="secondary" onClick={handleBack} className="flex-1">Voltar</Button>
                    <Button onClick={handleNext} className="flex-1">Continuar</Button>
                </div>
            </div>
        )}

        {/* NOVA ETAPA: PONTOS FRACOS E LIMITAÇÕES */}
        {step === 4 && (
           <div className="space-y-6 animate-slide-up">
             <h2 className="text-2xl font-bold text-secondary">Preferências e Saúde</h2>
             
             {/* Ponto Fraco Alimentar */}
             <div>
                <label className="block text-xs font-bold text-muted uppercase mb-3">Qual seu maior "ponto fraco" na alimentação?</label>
                <div className="grid grid-cols-2 gap-3">
                    {['Doces', 'Salgados', 'Massas/Pizza', 'Lanches/Hambúrguer', 'Nenhum'].map(craving => (
                        <button 
                          key={craving}
                          onClick={() => setProfile({...profile, foodCravings: craving})}
                          className={`p-3 rounded-xl border text-sm font-bold transition-all ${profile.foodCravings === craving ? 'border-primary bg-primary/10 text-white' : 'border-white/5 bg-input text-gray-500'}`}
                        >
                            {craving}
                        </button>
                    ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">Vamos incluir versões saudáveis (receitas fit) disso no seu plano.</p>
             </div>

             {/* Limitações Físicas */}
             <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                    <AlertOctagon className="w-5 h-5 text-red-400" />
                    <label className="text-xs font-bold text-red-200 uppercase">Limitações ou Lesões</label>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                    {['Dor no Joelho', 'Dor na Lombar', 'Dor no Ombro', 'Hérnia de Disco', 'Condromalácia'].map(injury => (
                        <button
                            key={injury}
                            onClick={() => addInjuryTag(injury)}
                            className="text-[10px] bg-red-500/10 text-red-200 border border-red-500/20 px-2 py-1 rounded-lg hover:bg-red-500/20 transition-colors flex items-center gap-1"
                        >
                            <Plus className="w-3 h-3" /> {injury}
                        </button>
                    ))}
                </div>

                <textarea 
                    value={profile.physicalLimitations}
                    onChange={e => setProfile({...profile, physicalLimitations: e.target.value})}
                    className="w-full bg-input/50 border border-white/5 rounded-lg p-3 text-secondary focus:border-red-400 outline-none h-24 resize-none text-sm placeholder-gray-600"
                    placeholder="Descreva aqui qualquer lesão ou limitação física que a IA deve considerar ao montar seu treino..."
                />
             </div>

             <div className="flex gap-3">
                <Button variant="secondary" onClick={handleBack} className="flex-1">Voltar</Button>
                <Button onClick={handleNext} className="flex-1">Continuar</Button>
             </div>
           </div>
        )}

        {step === 5 && (
          <div className="space-y-6 animate-slide-up">
            <h2 className="text-2xl font-bold text-secondary">Equipamento e Finalização</h2>
            
            {/* Seleção de Local de Treino */}
            <div className="space-y-4">
                <label className="block text-xs font-bold text-muted uppercase">Onde você vai treinar?</label>
                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={() => setTrainingLocation('gym')}
                        className={`p-4 rounded-xl border-2 text-center transition-all ${trainingLocation === 'gym' ? 'border-primary bg-primary/10 text-white' : 'border-white/5 bg-input text-gray-500'}`}
                    >
                        <Dumbbell className="w-6 h-6 mx-auto mb-2" />
                        <span className="font-bold text-sm">Academia</span>
                    </button>
                    <button 
                        onClick={() => setTrainingLocation('home')}
                        className={`p-4 rounded-xl border-2 text-center transition-all ${trainingLocation === 'home' ? 'border-primary bg-primary/10 text-white' : 'border-white/5 bg-input text-gray-500'}`}
                    >
                        <Home className="w-6 h-6 mx-auto mb-2" />
                        <span className="font-bold text-sm">Em Casa</span>
                    </button>
                </div>
            </div>

            {/* Opções específicas se for Em Casa */}
            {trainingLocation === 'home' && (
                <div className="bg-surface border border-white/10 rounded-xl p-4 animate-fade-in">
                    <p className="text-xs font-bold text-muted uppercase mb-3">Marque o que você possui:</p>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                         <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-white/5 rounded-lg border border-transparent hover:border-white/5">
                            <input type="checkbox" checked={homeEquipment.dumbbells} onChange={() => setHomeEquipment({...homeEquipment, dumbbells: !homeEquipment.dumbbells})} className="accent-primary w-4 h-4" />
                            <span className="text-xs text-secondary">Halteres</span>
                         </label>
                         <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-white/5 rounded-lg border border-transparent hover:border-white/5">
                            <input type="checkbox" checked={homeEquipment.bands} onChange={() => setHomeEquipment({...homeEquipment, bands: !homeEquipment.bands})} className="accent-primary w-4 h-4" />
                            <span className="text-xs text-secondary">Elásticos</span>
                         </label>
                         <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-white/5 rounded-lg border border-transparent hover:border-white/5">
                            <input type="checkbox" checked={homeEquipment.jumpRope} onChange={() => setHomeEquipment({...homeEquipment, jumpRope: !homeEquipment.jumpRope})} className="accent-primary w-4 h-4" />
                            <span className="text-xs text-secondary">Corda</span>
                         </label>
                         <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-white/5 rounded-lg border border-transparent hover:border-white/5">
                            <input type="checkbox" checked={homeEquipment.bar} onChange={() => setHomeEquipment({...homeEquipment, bar: !homeEquipment.bar})} className="accent-primary w-4 h-4" />
                            <span className="text-xs text-secondary">Barra Fixa</span>
                         </label>
                         <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-white/5 rounded-lg border border-transparent hover:border-white/5">
                            <input type="checkbox" checked={homeEquipment.kettlebell} onChange={() => setHomeEquipment({...homeEquipment, kettlebell: !homeEquipment.kettlebell})} className="accent-primary w-4 h-4" />
                            <span className="text-xs text-secondary">Kettlebell</span>
                         </label>
                         <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-white/5 rounded-lg border border-transparent hover:border-white/5">
                            <input type="checkbox" checked={homeEquipment.bench} onChange={() => setHomeEquipment({...homeEquipment, bench: !homeEquipment.bench})} className="accent-primary w-4 h-4" />
                            <span className="text-xs text-secondary">Banco</span>
                         </label>
                         <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-white/5 rounded-lg border border-transparent hover:border-white/5">
                            <input type="checkbox" checked={homeEquipment.ankleWeights} onChange={() => setHomeEquipment({...homeEquipment, ankleWeights: !homeEquipment.ankleWeights})} className="accent-primary w-4 h-4" />
                            <span className="text-xs text-secondary">Caneleiras</span>
                         </label>
                         <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-white/5 rounded-lg border border-transparent hover:border-white/5">
                            <input type="checkbox" checked={homeEquipment.barbell} onChange={() => setHomeEquipment({...homeEquipment, barbell: !homeEquipment.barbell})} className="accent-primary w-4 h-4" />
                            <span className="text-xs text-secondary">Barra/Anilhas</span>
                         </label>
                    </div>
                    
                    <div className="mt-2">
                        <label className="block text-[10px] font-bold text-muted uppercase mb-1">Outros Equipamentos (Opcional)</label>
                        <input 
                            type="text" 
                            value={otherEquipment}
                            onChange={e => setOtherEquipment(e.target.value)}
                            className="w-full bg-input border border-white/10 rounded-lg p-2 text-xs text-secondary focus:border-primary outline-none placeholder-gray-600"
                            placeholder="Ex: Saco de pancada, Roda abdominal..."
                        />
                    </div>
                    <p className="text-[10px] text-muted mt-2 italic">*Se não marcar nada, montaremos um treino apenas com o peso do corpo.</p>
                </div>
            )}

            <div className="space-y-4 pt-2 border-t border-white/5">
                 {/* Foto Inicial */}
                 <div>
                    <label className="block text-xs font-bold text-muted uppercase mb-2">Foto Atual (Opcional)</label>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-input border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                            {profile.startingPhoto ? (
                                <img src={profile.startingPhoto} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <Camera className="w-6 h-6 text-gray-500" />
                            )}
                        </div>
                        <div className="flex-1">
                            <label className="cursor-pointer bg-white/5 hover:bg-white/10 text-secondary text-xs font-bold py-2 px-4 rounded-lg transition-colors inline-block border border-white/10">
                                Escolher Foto
                                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                            </label>
                            <p className="text-[10px] text-muted mt-1">Registre seu início para comparar depois!</p>
                        </div>
                    </div>
                 </div>

                {/* Restrições */}
                <div>
                    <label className="block text-xs font-bold text-muted uppercase mb-2">Restrições Alimentares</label>
                    <textarea 
                        value={profile.dietaryRestrictions}
                        onChange={e => setProfile({...profile, dietaryRestrictions: e.target.value})}
                        className="w-full bg-input border border-white/5 rounded-xl p-3 text-secondary focus:border-primary outline-none h-20 resize-none text-sm"
                        placeholder="Ex: Vegetariano, Intolerante a lactose..."
                    />
                </div>

                {/* Checkbox Suplementos */}
                <div className="flex items-center justify-between cursor-pointer" onClick={() => setProfile({...profile, wantsSupplements: !profile.wantsSupplements})}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full transition-colors ${profile.wantsSupplements ? 'bg-primary/20 text-primary' : 'bg-white/5 text-gray-500'}`}>
                            <Beaker className="w-4 h-4" />
                        </div>
                        <p className="text-sm font-bold text-secondary">Deseja incluir Suplementos?</p>
                    </div>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${profile.wantsSupplements ? 'bg-primary border-primary' : 'border-gray-600'}`}>
                        {profile.wantsSupplements && <Check className="w-3 h-3 text-black" />}
                    </div>
                </div>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={handleBack} className="flex-1">Voltar</Button>
              <Button onClick={handleSubmit} className="flex-1">Gerar Plano IA</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
