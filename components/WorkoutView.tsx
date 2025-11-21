import React, { useState } from 'react';
import { GeneratedPlan, Exercise } from '../types';
import { Dumbbell, AlertCircle, PlayCircle, X, Youtube, CheckCircle2, ExternalLink, Info, FileWarning, Download } from 'lucide-react';

interface WorkoutViewProps {
  plan: GeneratedPlan;
  onExport?: () => void; // Callback para exportar
}

export const WorkoutView: React.FC<WorkoutViewProps> = ({ plan, onExport }) => {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  // Verificação de segurança para dados inválidos
  if (!plan || !plan.workoutRoutine || !Array.isArray(plan.workoutRoutine) || plan.workoutRoutine.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center h-64 bg-surface rounded-3xl border border-white/5 animate-fade-in">
            <div className="bg-red-500/10 p-4 rounded-full mb-4">
                <FileWarning className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-secondary mb-2">Erro ao carregar treino</h3>
            <p className="text-muted text-sm max-w-xs">
                Não foi possível ler os dados do treino gerado. Isso pode ocorrer se a IA sofreu uma interrupção.
            </p>
            <p className="text-xs text-gray-500 mt-4">Por favor, tente gerar o plano novamente nas configurações.</p>
        </div>
    );
  }

  const handleOpenTutorial = (exercise: Exercise) => {
    setSelectedExercise(exercise);
  };

  const handleCloseModal = () => {
    setSelectedExercise(null);
  };

  const openYouTube = (exerciseName: string) => {
    const query = encodeURIComponent(`como fazer exercicio ${exerciseName} execução correta`);
    window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20 print:pb-0">
      {/* Header Section */}
      <div className="bg-surface p-6 rounded-3xl shadow-soft border border-white/5 relative overflow-hidden print:border print:border-gray-300 print:bg-white print:text-black print:shadow-none">
        <div className="absolute right-0 top-0 w-32 h-32 bg-primary/10 rounded-bl-full -mr-10 -mt-10 z-0 print:hidden"></div>
        <div className="relative z-10 flex justify-between items-start">
            <div>
                <h3 className="text-primary font-bold uppercase tracking-widest text-xs mb-2 print:text-black">Foco da Rotina</h3>
                <p className="text-secondary text-xl font-semibold italic leading-relaxed print:text-black">"{plan.motivation || 'Sua jornada começa hoje.'}"</p>
            </div>
            {/* Botão de Download visível no Mobile */}
            {onExport && (
                <button 
                    onClick={onExport}
                    className="bg-white/10 p-2 rounded-xl text-white hover:bg-primary hover:text-white transition-all shadow-lg no-print"
                    title="Baixar PDF do Treino"
                >
                    <Download className="w-5 h-5" />
                </button>
            )}
        </div>
      </div>

      <div className="grid gap-6">
        {plan.workoutRoutine.map((day, index) => (
          <div key={index} className="bg-surface rounded-3xl p-6 shadow-soft border border-white/5 print:bg-white print:border-gray-300 print:break-inside-avoid print:shadow-none">
            <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-4 print:border-gray-300">
              <div>
                <h4 className="text-2xl font-bold text-secondary print:text-black">{day.dayName}</h4>
                <p className="text-primary font-medium text-sm print:text-gray-600">{day.focus}</p>
              </div>
              <div className="bg-white/5 p-3 rounded-2xl text-secondary print:hidden">
                <Dumbbell className="w-6 h-6" />
              </div>
            </div>

            <div className="space-y-4">
              {day.exercises && day.exercises.map((ex, idx) => (
                <div key={idx} className="bg-black/20 hover:bg-white/5 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 group border border-transparent transition-all duration-300 print:bg-white print:border-gray-200 print:shadow-none print:break-inside-avoid">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h5 className="text-secondary font-bold text-lg print:text-black">{ex.name}</h5>
                    </div>
                    {ex.notes && (
                      <p className="text-muted text-sm flex items-start gap-1 print:text-gray-600">
                        <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" /> {ex.notes}
                      </p>
                    )}
                  </div>
                  
                  {/* Controls - Hidden on Print */}
                  <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto print:hidden">
                    <div className="flex gap-3 text-sm font-mono text-muted">
                        <div className="bg-input shadow-sm px-3 py-2 rounded-xl flex flex-col items-center min-w-[60px] border border-white/5">
                            <span className="text-[10px] text-primary uppercase font-bold">Séries</span>
                            <span className="font-bold text-secondary">{ex.sets}</span>
                        </div>
                        <div className="bg-input shadow-sm px-3 py-2 rounded-xl flex flex-col items-center min-w-[60px] border border-white/5">
                            <span className="text-[10px] text-primary uppercase font-bold">Reps</span>
                            <span className="font-bold text-secondary">{ex.reps}</span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {/* Botão Ver Tutorial no YouTube */}
                        <button 
                             onClick={() => openYouTube(ex.name)}
                             className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-4 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-red-900/20 hover:scale-105 active:scale-95"
                             title="Ver vídeo tutorial no YouTube"
                        >
                            <Youtube className="w-4 h-4 fill-current" />
                            <span className="hidden sm:inline">Ver Tutorial</span>
                            <span className="sm:hidden">Vídeo</span>
                        </button>
                        
                        {/* Details Modal Button */}
                        <button 
                            onClick={() => handleOpenTutorial(ex)}
                            className="bg-white/5 text-primary border border-primary/20 p-2 px-3 rounded-xl hover:bg-primary hover:text-white transition-all flex items-center justify-center shadow-sm"
                            title="Ver mais detalhes"
                        >
                            <Info className="w-5 h-5" />
                        </button>
                    </div>
                  </div>

                  {/* Print Only Info */}
                  <div className="hidden print:flex gap-6 mt-2 text-sm font-mono text-gray-800">
                      <span><strong>Séries:</strong> {ex.sets}</span>
                      <span><strong>Repetições:</strong> {ex.reps}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Tutorial - Hidden on Print */}
      {selectedExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in print:hidden">
            <div className="bg-surface w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-white/10">
                
                {/* Modal Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-start bg-white/5">
                    <div>
                        <h3 className="text-xl font-bold text-secondary pr-8">{selectedExercise.name}</h3>
                        <p className="text-primary text-sm font-medium">Execução e Detalhes</p>
                    </div>
                    <button onClick={handleCloseModal} className="bg-white/10 p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/20 shadow-sm">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-y-auto">
                    {/* Video Placeholder / Action */}
                    <div 
                        onClick={() => openYouTube(selectedExercise.name)}
                        className="bg-black/40 rounded-2xl p-8 text-center border-2 border-dashed border-white/10 mb-6 cursor-pointer hover:bg-black/60 hover:border-red-500/50 transition-all group"
                    >
                        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                             <Youtube className="w-8 h-8 text-red-500" />
                        </div>
                        <h4 className="text-secondary font-bold mb-2 group-hover:text-red-400 transition-colors">Assistir Tutorial no YouTube</h4>
                        <p className="text-muted text-sm mb-4 max-w-xs mx-auto">
                            Clique para abrir uma busca com os melhores vídeos de execução para este exercício.
                        </p>
                        <div className="flex items-center justify-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider">
                            <span>Abrir Vídeo</span> <ExternalLink className="w-3 h-3" />
                        </div>
                    </div>

                    {/* Tips Section */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-secondary flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                            Dicas de Execução
                        </h4>
                        <div className="bg-primary/5 p-4 rounded-xl text-secondary/80 text-sm leading-relaxed border border-primary/10">
                            {selectedExercise.notes}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mt-4">
                             <div className="bg-input p-4 rounded-2xl text-center border border-white/5">
                                 <span className="block text-muted text-[10px] uppercase font-bold mb-1">Séries</span>
                                 <span className="text-2xl font-bold text-secondary">{selectedExercise.sets}</span>
                             </div>
                             <div className="bg-input p-4 rounded-2xl text-center border border-white/5">
                                 <span className="block text-muted text-[10px] uppercase font-bold mb-1">Reps</span>
                                 <span className="text-2xl font-bold text-secondary">{selectedExercise.reps}</span>
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