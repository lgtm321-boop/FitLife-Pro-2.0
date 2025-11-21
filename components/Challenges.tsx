
import React, { useState, useEffect } from 'react';
import { Challenge } from '../types';
import { Trophy, Timer, X, Play, Flame, Zap, Target, Swords, Activity, CheckCircle2, Square, CheckSquare, RotateCcw } from 'lucide-react';

const CHALLENGE_MODULES: Challenge[] = [
  {
    id: 'abs',
    title: 'O Chamado do Tanquinho',
    description: 'Um circuito abdominal intenso para esculpir o core e queimar gordura visceral.',
    difficulty: 'Difícil',
    duration: '15 min',
    color: 'from-orange-600 to-red-700',
    exercises: [
      { name: 'Prancha Isométrica', sets: '3', reps: '45s', notes: 'Mantenha a coluna reta e abdômen contraído' },
      { name: 'Abdominal Bicicleta', sets: '3', reps: '20 cada lado', notes: 'Gire bem o tronco tocando cotovelo no joelho' },
      { name: 'Mountain Climbers', sets: '3', reps: '30s', notes: 'Acelere o movimento como se estivesse correndo' },
      { name: 'Elevação de Pernas', sets: '3', reps: '15', notes: 'Controle a descida, não deixe encostar no chão' }
    ]
  },
  {
    id: 'chest',
    title: 'Peitoral de Vibranium',
    description: 'Construa uma caixa torácica blindada com variações de empurrar.',
    difficulty: 'Médio',
    duration: '20 min',
    color: 'from-slate-600 to-slate-800',
    exercises: [
      { name: 'Flexão de Braços (Clássica)', sets: '4', reps: '12-15', notes: 'Peito no chão, cotovelos a 45 graus' },
      { name: 'Flexão Diamante', sets: '3', reps: '10', notes: 'Mãos unidas formando um diamante (foco miolo/tríceps)' },
      { name: 'Flexão Inclinada', sets: '3', reps: '15', notes: 'Pés no chão, mãos em um banco ou sofá' },
      { name: 'Crucifixo (Halteres/Elástico)', sets: '3', reps: '12', notes: 'Abra bem os braços alongando o peitoral' }
    ]
  },
  {
    id: 'legs',
    title: 'Pernas de Titã',
    description: 'Volume alto para quadríceps e posteriores. Prepare-se para não conseguir andar amanhã.',
    difficulty: 'Insano',
    duration: '45 min',
    color: 'from-blue-600 to-indigo-700',
    exercises: [
      { name: 'Agachamento Búlgaro', sets: '4', reps: '10 cada', notes: 'Foco no calcanhar da perna da frente' },
      { name: 'Leg Press 45 (ou Agach. Livre)', sets: '4', reps: '15', notes: 'Amplitude máxima sem tirar lombar do apoio' },
      { name: 'Passada (Lunges)', sets: '3', reps: '20 passos', notes: 'Passos largos para ativar glúteo e posterior' },
      { name: 'Cadeira Extensora', sets: '3', reps: 'Até a falha', notes: 'Drop-set na última série' }
    ]
  },
  {
    id: 'back',
    title: 'Asas de Dragão',
    description: 'Expanda suas dorsais e melhore sua postura com foco em puxadas.',
    difficulty: 'Difícil',
    duration: '30 min',
    color: 'from-violet-600 to-purple-800',
    exercises: [
      { name: 'Barra Fixa (ou Graviton)', sets: '4', reps: '8-12', notes: 'Puxe até o queixo passar a barra' },
      { name: 'Remada Curvada', sets: '4', reps: '12', notes: 'Tronco inclinado, coluna neutra' },
      { name: 'Superman', sets: '3', reps: '15', notes: 'Deitado, levante braços e pernas simultaneamente' },
      { name: 'Serrote (Remada Unilateral)', sets: '3', reps: '12 cada', notes: 'Concentre em puxar com o cotovelo' }
    ]
  },
  {
    id: 'hiit_ragnarok',
    title: 'Ragnarok Metabólico',
    description: 'O juízo final para as calorias. Protocolo Tabata brutal para secar gordura.',
    difficulty: 'Insano',
    duration: '12 min',
    color: 'from-red-600 to-orange-500',
    exercises: [
      { name: 'Sprint Estacionário (High Knees)', sets: '8', reps: '20s ON / 10s OFF', notes: 'Joelhos na altura do peito, velocidade máxima' },
      { name: 'Sprawl (Burpee s/ flexão)', sets: '8', reps: '20s ON / 10s OFF', notes: 'Jogue as pernas para trás e fique de pé rápido' },
      { name: 'Agachamento com Salto', sets: '4', reps: '30s', notes: 'Exploda na subida, amorteça na descida' },
      { name: 'Prancha Jack', sets: '4', reps: '30s', notes: 'Posição de prancha abrindo e fechando as pernas' }
    ]
  },
  {
    id: 'glutes',
    title: 'Glúteos Galácticos',
    description: 'Exercícios isolados e compostos para máxima ativação e modelagem.',
    difficulty: 'Médio',
    duration: '30 min',
    color: 'from-pink-600 to-rose-700',
    exercises: [
      { name: 'Elevação Pélvica', sets: '4', reps: '12', notes: 'Segure 2s no topo contraindo o glúteo' },
      { name: 'Abdutora (ou Elástico)', sets: '3', reps: '20', notes: 'Corpo inclinado levemente para frente' },
      { name: 'Coice na Polia/Caneleira', sets: '3', reps: '15', notes: 'Movimento controlado, sem girar quadril' },
      { name: 'Agachamento Sumô', sets: '3', reps: '12', notes: 'Pés afastados, pontas para fora' }
    ]
  },
  {
    id: 'arms',
    title: 'Braços de Hércules',
    description: 'Bíceps e Tríceps em supersérie para um pump lendário.',
    difficulty: 'Médio',
    duration: '25 min',
    color: 'from-yellow-600 to-amber-700',
    exercises: [
      { name: 'Rosca Direta', sets: '3', reps: '12', notes: 'Não balance o tronco' },
      { name: 'Tríceps Banco (Mergulho)', sets: '3', reps: '15', notes: 'Desça até 90 graus' },
      { name: 'Rosca Martelo', sets: '3', reps: '12', notes: 'Pegada neutra, foca no braquial' },
      { name: 'Tríceps Corda/Testa', sets: '3', reps: '12', notes: 'Cotovelos fechados e fixos' }
    ]
  },
  {
    id: 'shoulders',
    title: 'Ombros de Atlas',
    description: 'Construa ombros 3D com foco em todas as cabeças do deltoide.',
    difficulty: 'Difícil',
    duration: '25 min',
    color: 'from-teal-600 to-emerald-700',
    exercises: [
      { name: 'Desenvolvimento Arnold', sets: '4', reps: '10', notes: 'Rotação completa dos punhos na subida' },
      { name: 'Elevação Lateral', sets: '4', reps: '15', notes: 'Cotovelos levemente flexionados, foque no deltoide lateral' },
      { name: 'Face Pull', sets: '3', reps: '15', notes: 'Puxe a corda em direção à testa (foco posterior)' },
      { name: 'Elevação Frontal', sets: '3', reps: '12', notes: 'Sem impulso, controle a descida' }
    ]
  },
  {
    id: 'fullbody',
    title: 'Guerreiro Espartano',
    description: 'Full Body metabólico. Recrute cada fibra muscular em um treino único.',
    difficulty: 'Insano',
    duration: '35 min',
    color: 'from-red-800 to-orange-900',
    exercises: [
      { name: 'Burpees', sets: '4', reps: '15', notes: 'Peito no chão e salto no topo' },
      { name: 'Thrusters (Agachamento + Desenv.)', sets: '4', reps: '12', notes: 'Use o impulso da perna para subir o peso' },
      { name: 'Renegade Row', sets: '3', reps: '10 cada', notes: 'Prancha com remada unilateral' },
      { name: 'Kettlebell/Halter Swing', sets: '3', reps: '20', notes: 'Explosão de quadril, não use os ombros' }
    ]
  },
  {
    id: 'cardio',
    title: 'Protocolo Supernova',
    description: 'HIIT explosivo para acelerar o metabolismo e queimar calorias pós-treino.',
    difficulty: 'Insano',
    duration: '20 min',
    color: 'from-rose-600 to-pink-900',
    exercises: [
      { name: 'Burpees', sets: '4', reps: '30s', notes: 'O máximo que conseguir' },
      { name: 'Polichinelos', sets: '4', reps: '45s', notes: 'Mantenha o ritmo constante' },
      { name: 'Agachamento com Salto', sets: '4', reps: '20s', notes: 'Amorteça a queda' },
      { name: 'Corrida Estacionária Alta', sets: '4', reps: '30s', notes: 'Joelhos lá em cima!' }
    ]
  },
  {
    id: 'mobility',
    title: 'Fluxo de Bambu',
    description: 'Mobilidade e alongamento para recuperação ativa e prevenção de lesões.',
    difficulty: 'Leve',
    duration: '15 min',
    color: 'from-green-600 to-emerald-800',
    exercises: [
      { name: 'Gato e Vaca', sets: '2', reps: '1 min', notes: 'Mobilize a coluna respirando fundo' },
      { name: 'Posição de Criança', sets: '2', reps: '45s', notes: 'Relaxe a lombar e alongue os braços' },
      { name: 'World\'s Greatest Stretch', sets: '2', reps: '10 cada', notes: 'Rotação torácica com afundo' },
      { name: 'Alongamento de Isquiotibiais', sets: '2', reps: '30s', notes: 'Tente alcançar a ponta dos pés sem dor' }
    ]
  }
];

export const Challenges: React.FC = () => {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [isActive, setIsActive] = useState(false); // Modo ativo (cronometro + lista)
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<boolean[]>([]);

  useEffect(() => {
      let interval: any;
      if (isTimerRunning) {
          interval = setInterval(() => {
              setTimer(t => t + 1);
          }, 1000);
      }
      return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (sec: number) => {
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const startChallenge = () => {
      setIsActive(true);
      setIsTimerRunning(true);
      setTimer(0);
      setCompletedExercises(new Array(selectedChallenge?.exercises.length).fill(false));
  };

  const stopChallenge = () => {
      setIsActive(false);
      setIsTimerRunning(false);
      setCompletedExercises([]);
      setSelectedChallenge(null);
  };

  const toggleExercise = (index: number) => {
      const newCompleted = [...completedExercises];
      newCompleted[index] = !newCompleted[index];
      setCompletedExercises(newCompleted);
  };

  return (
    <div className="pb-20 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-secondary flex items-center gap-2">
          <Trophy className="text-yellow-500 fill-yellow-500" /> Desafios Especiais
        </h2>
        <p className="text-muted text-sm md:text-right max-w-md">
          Escolha um módulo para complementar seu treino ou desafiar seus limites em dias livres.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {CHALLENGE_MODULES.map((challenge) => (
          <div 
            key={challenge.id}
            onClick={() => setSelectedChallenge(challenge)}
            className={`cursor-pointer rounded-3xl p-6 bg-gradient-to-br ${challenge.color} text-white transform transition-all hover:scale-[1.02] hover:shadow-glow shadow-lg relative overflow-hidden group border border-white/10`}
          >
             {/* Background Icon */}
             <div className="absolute -top-2 -right-2 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform rotate-12">
                {challenge.id === 'cardio' || challenge.id === 'fullbody' || challenge.id === 'hiit_ragnarok' ? <Flame className="w-32 h-32" /> : 
                 challenge.id === 'abs' || challenge.id === 'mobility' ? <Zap className="w-32 h-32" /> :
                 challenge.id === 'legs' || challenge.id === 'arms' ? <Activity className="w-32 h-32" /> :
                 <Swords className="w-32 h-32" />
                }
             </div>
             
             <div className="relative z-10 flex flex-col h-full justify-between">
               <div>
                 <h3 className="font-extrabold text-xl mb-2 shadow-sm leading-tight">{challenge.title}</h3>
                 <p className="text-white/80 text-xs mb-4 font-medium leading-relaxed">{challenge.description}</p>
               </div>
               
               <div className="flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-wider">
                 <span className="bg-black/20 backdrop-blur-md px-2 py-1.5 rounded flex items-center gap-1">
                   <Timer className="w-3 h-3" /> {challenge.duration}
                 </span>
                 <span className={`bg-black/20 backdrop-blur-md px-2 py-1.5 rounded border border-white/20 ${
                    challenge.difficulty === 'Insano' ? 'text-red-200 border-red-400/30' : 'text-white'
                 }`}>
                   {challenge.difficulty}
                 </span>
               </div>
             </div>
          </div>
        ))}
      </div>

      {/* Modal for Details & ACTIVE MODE */}
      {selectedChallenge && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="bg-surface w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[90vh] relative">
            
            {/* HEADER */}
            <div className={`p-6 bg-gradient-to-r ${selectedChallenge.color} text-white relative shrink-0`}>
              <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-2xl font-extrabold leading-tight">{selectedChallenge.title}</h3>
                        {isActive && <span className="bg-red-600 px-2 py-1 rounded text-xs font-bold animate-pulse mt-1 inline-block">EM ANDAMENTO</span>}
                    </div>
                    {!isActive && (
                        <button onClick={() => setSelectedChallenge(null)} className="bg-black/20 p-2 rounded-full hover:bg-black/40 text-white transition-colors backdrop-blur-sm">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
                {!isActive && <p className="text-white/90 font-medium text-sm">{selectedChallenge.description}</p>}
                
                {isActive && (
                    <div className="flex justify-center py-4">
                        <div className="text-5xl font-mono font-bold tracking-wider drop-shadow-md">
                            {formatTime(timer)}
                        </div>
                    </div>
                )}
              </div>
            </div>
            
            {/* CONTENT */}
            <div className="p-6 overflow-y-auto bg-surface">
              {!isActive && (
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-primary font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                        <Target className="w-4 h-4" /> Circuito
                    </h4>
                    <span className="text-xs text-muted bg-white/5 px-2 py-1 rounded-lg">
                        Descanse 45s entre séries
                    </span>
                  </div>
              )}

              <div className="space-y-3">
                {selectedChallenge.exercises.map((ex, i) => (
                  <div 
                    key={i} 
                    onClick={() => isActive && toggleExercise(i)}
                    className={`flex items-start gap-4 p-3 rounded-xl border transition-all group ${
                        isActive 
                        ? 'cursor-pointer ' + (completedExercises[i] ? 'bg-green-500/10 border-green-500/30' : 'bg-white/[0.02] border-white/5 hover:bg-white/5')
                        : 'bg-white/[0.02] border-white/5 hover:bg-white/5'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition-colors mt-1 shrink-0 ${
                        isActive && completedExercises[i] 
                        ? 'bg-green-500 text-white' 
                        : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-surface'
                    }`}>
                      {isActive ? (completedExercises[i] ? <CheckCircle2 className="w-5 h-5" /> : <Square className="w-5 h-5" />) : i + 1}
                    </div>
                    <div className="flex-1">
                      <p className={`font-bold text-sm mb-1 ${isActive && completedExercises[i] ? 'text-green-400 line-through' : 'text-secondary'}`}>{ex.name}</p>
                      <div className="flex gap-3 text-xs text-muted mb-1">
                          <span className="bg-black/30 px-1.5 py-0.5 rounded text-gray-300">{ex.sets} séries</span>
                          <span className="bg-black/30 px-1.5 py-0.5 rounded text-gray-300">{ex.reps}</span>
                      </div>
                      {ex.notes && !completedExercises[i] && (
                        <p className="text-[10px] text-primary/80 italic flex items-center gap-1">
                            <span className="w-1 h-1 bg-primary rounded-full"></span> {ex.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FOOTER ACTIONS */}
            <div className="p-4 border-t border-white/5 bg-black/20 shrink-0">
              {!isActive ? (
                  <button onClick={startChallenge} className="w-full bg-primary text-surface font-extrabold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#00B587] transition-all shadow-glow hover:scale-[1.02] active:scale-95">
                    <Play className="w-5 h-5 fill-current" /> INICIAR DESAFIO
                  </button>
              ) : (
                  <div className="flex gap-3">
                      <button onClick={() => { setIsTimerRunning(!isTimerRunning) }} className="flex-1 bg-white/10 text-white font-bold py-4 rounded-2xl hover:bg-white/20 transition-all">
                          {isTimerRunning ? 'Pausar' : 'Continuar'}
                      </button>
                      <button onClick={stopChallenge} className="flex-1 bg-red-500 text-white font-bold py-4 rounded-2xl hover:bg-red-600 transition-all flex items-center justify-center gap-2">
                          <RotateCcw className="w-5 h-5" /> Finalizar
                      </button>
                  </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
