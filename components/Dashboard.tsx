import React, { useState, useEffect } from 'react';
import { UserProfile, GeneratedPlan } from '../types';
import { WorkoutView } from './WorkoutView';
import { MealView } from './MealView';
import { Challenges } from './Challenges';
import { GoalSettings } from './GoalSettings';
import { Diagnostics } from './Diagnostics';
import { ProgressView } from './ProgressView';
import { Supplements } from './Supplements';
import { RecipeView } from './RecipeView';
import { SettingsView } from './SettingsView'; 
import { Dumbbell, UtensilsCrossed, Trophy, Download, LogOut, Target, Menu, ChefHat, TrendingUp, Bell, Settings, X, Activity, Beaker, FileText } from 'lucide-react';
import { generateDailyQuote } from '../services/geminiService';
import { Logo } from './Logo';
import { ErrorBoundary } from './ErrorBoundary';
import { Toast } from './Toast';

interface DashboardProps {
  profile: UserProfile;
  plan: GeneratedPlan;
  onReset: (user: null) => void;
  onUpdateProfile: (profile: UserProfile) => void;
}

type ViewType = 'workout' | 'diet' | 'challenges' | 'recipes' | 'progress' | 'notifications' | 'settings' | 'diagnostics' | 'supplements';

// Placeholder Component for under-construction views
const PlaceholderView: React.FC<{ title: string; icon: React.ReactNode; desc: string }> = ({ title, icon, desc }) => (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center mb-6 shadow-glow border border-white/5">
            <div className="text-primary scale-150">{icon}</div>
        </div>
        <h2 className="text-2xl font-bold text-secondary mb-2">{title}</h2>
        <p className="text-muted max-w-md mx-auto">{desc}</p>
        <button className="mt-8 px-6 py-2 bg-white/5 hover:bg-white/10 rounded-full text-sm font-bold text-secondary border border-white/10 transition-all">
            Em breve
        </button>
    </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ profile, plan, onReset, onUpdateProfile }) => {
  const [activeView, setActiveView] = useState<ViewType>('workout');
  const [quote, setQuote] = useState("Carregando dose de motivação...");
  const [showGoals, setShowGoals] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false); // Novo estado para o modal de exportação
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    generateDailyQuote().then(setQuote);
    showToast("App FitLifePro carregado com sucesso 🚀", "success");
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  // Função para gerenciar a exportação específica
  const handleSpecificExport = (type: 'workout' | 'diet') => {
      setShowExportModal(false); // Fecha o modal
      setIsMenuOpen(false); // Fecha o menu se estiver aberto
      
      // Muda para a visualização correta
      setActiveView(type);
      
      showToast(`Preparando ${type === 'workout' ? 'Treino' : 'Dieta'} para PDF...`, 'info');

      // Aguarda a renderização da tela e chama o print
      setTimeout(() => {
          window.print();
      }, 800);
  };

  // Função de Navegação Segura
  const safeNavigate = (view: ViewType | 'goals' | 'export') => {
    setIsMenuOpen(false);
    try {
        if (view === 'goals') {
            setShowGoals(true);
        } else if (view === 'export') {
            setShowExportModal(true); // Abre o modal em vez de imprimir direto
        } else {
            if (!['workout', 'diet', 'challenges', 'recipes', 'progress', 'notifications', 'settings', 'diagnostics', 'supplements'].includes(view)) {
                throw new Error("Rota inválida");
            }
            setActiveView(view as ViewType);
        }
    } catch (error) {
        console.error(error);
        showToast("Ops! Houve um problema ao abrir esta seção. Voltando...", "error");
        setActiveView('workout');
    }
  };

  const handleLogout = () => {
     onReset(null);
  };

  // Menu Items Configuration
  const menuItems = [
      { id: 'workout', label: 'Treinos Personalizados', icon: <Dumbbell className="w-5 h-5" />, action: () => safeNavigate('workout') },
      { id: 'diet', label: 'Plano Alimentar', icon: <UtensilsCrossed className="w-5 h-5" />, action: () => safeNavigate('diet') },
      { id: 'supplements', label: 'Suplementos & IA', icon: <Beaker className="w-5 h-5" />, action: () => safeNavigate('supplements') },
      { id: 'challenges', label: 'Desafios Extras', icon: <Trophy className="w-5 h-5" />, action: () => safeNavigate('challenges') },
      { id: 'recipes', label: 'Receitas Saudáveis', icon: <ChefHat className="w-5 h-5" />, action: () => safeNavigate('recipes') },
      { id: 'progress', label: 'Monitoramento e Progresso', icon: <TrendingUp className="w-5 h-5" />, action: () => safeNavigate('progress') },
      { id: 'goals', label: 'Definir Metas', icon: <Target className="w-5 h-5" />, action: () => safeNavigate('goals') },
      { id: 'settings', label: 'Configurações', icon: <Settings className="w-5 h-5" />, action: () => safeNavigate('settings') },
      { id: 'diagnostics', label: 'Diagnóstico do App', icon: <Activity className="w-5 h-5" />, action: () => safeNavigate('diagnostics') },
      { id: 'export', label: 'Baixar PDF / Imprimir', icon: <Download className="w-5 h-5" />, action: () => safeNavigate('export') },
  ];

  return (
    <div className="min-h-screen bg-accent print:bg-white font-sans text-secondary flex flex-col relative overflow-x-hidden">
      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header - Hidden on Print */}
      <header className="bg-surface sticky top-0 z-30 border-b border-white/5 px-6 py-4 flex justify-between items-center no-print shadow-soft">
        <div className="flex items-center gap-4">
            <button 
                onClick={() => setIsMenuOpen(true)}
                className="p-2 -ml-2 text-muted hover:text-white hover:bg-white/10 rounded-xl transition-all md:hidden"
            >
                <Menu className="w-6 h-6" />
            </button>
            <Logo size="sm" showText={false} className="hidden md:flex" />
            <div className="flex flex-col">
                <h1 className="text-lg font-bold text-secondary leading-tight">Olá, <span className="text-primary">{profile.name.split(' ')[0]}</span></h1>
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider">{profile.goal}</span>
            </div>
        </div>
        <div className="flex gap-2">
           <button onClick={() => safeNavigate('goals')} className="p-2 text-primary hover:text-white hover:bg-primary/20 rounded-full transition-all hidden md:block" title="Definir Metas">
             <Target className="w-5 h-5" />
           </button>
           <button onClick={() => safeNavigate('export')} className="p-2 text-muted hover:text-secondary hover:bg-white/5 rounded-full transition-all hidden md:block" title="Salvar PDF">
             <Download className="w-5 h-5" />
           </button>
           <button onClick={handleLogout} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-full transition-all" title="Sair">
             <LogOut className="w-5 h-5" />
           </button>
        </div>
      </header>

      {/* Side Menu (Mobile & Desktop Drawer) - Hidden on Print */}
      {isMenuOpen && (
          <div className="fixed inset-0 z-[60] flex animate-fade-in no-print">
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
              <div className="relative w-[85%] max-w-xs bg-surface h-full shadow-2xl border-r border-white/10 flex flex-col animate-slide-up md:animate-none">
                  <div className="p-6 flex justify-between items-center border-b border-white/5 bg-accent/50">
                      <Logo size="sm" />
                      <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-white/10 rounded-full text-muted hover:text-white">
                          <X className="w-5 h-5" />
                      </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-1">
                      {menuItems.map((item) => (
                          <button 
                            key={item.id}
                            onClick={item.action}
                            className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all text-sm font-bold ${
                                ((activeView as string) === item.id) 
                                ? 'bg-primary text-white shadow-glow' 
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                          >
                              {item.icon}
                              {item.label}
                          </button>
                      ))}
                  </div>
                  <div className="p-4 border-t border-white/5 bg-accent/50">
                      <button onClick={handleLogout} className="w-full flex items-center gap-4 p-4 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-sm font-bold">
                          <LogOut className="w-5 h-5" />
                          Sair da Conta
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Quote Banner - Hidden on Print */}
      <div className="bg-surface border-b border-white/5 p-6 text-center relative overflow-hidden no-print shadow-[inset_0_10px_20px_rgba(0,0,0,0.2)]">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <p className="text-secondary italic text-sm md:text-base relative z-10 opacity-90">"{quote}"</p>
      </div>

      {/* Main Content Area */}
      <main className="p-4 md:p-6 max-w-4xl mx-auto w-full flex-1 pb-32">
        
        {/* PRINT ONLY HEADER with LOGO */}
        <div className="hidden print:flex flex-col items-center mb-8 print-only border-b-2 border-gray-300 pb-4">
            <div className="mb-4 scale-125 grayscale">
                <Logo size="xl" showText={true} className="text-black" />
            </div>
            <h1 className="text-2xl font-bold text-black mt-2">Plano Personalizado FitLifePro</h1>
            <div className="flex gap-8 mt-2 text-sm text-gray-600">
                <p>Aluno: <span className="font-bold">{profile.name}</span></p>
                <p>Data: {new Date().toLocaleDateString()}</p>
            </div>
        </div>

        <ErrorBoundary onReset={() => setActiveView('workout')}>
            <div className="transition-all duration-300 ease-in-out">
                {activeView === 'workout' && (
                    <WorkoutView 
                        plan={plan} 
                        onExport={() => handleSpecificExport('workout')}
                    />
                )}
                {activeView === 'diet' && (
                    <MealView 
                        plan={plan} 
                        onExport={() => handleSpecificExport('diet')}
                    />
                )}
                {activeView === 'challenges' && <Challenges />}
                {activeView === 'diagnostics' && <Diagnostics />}
                {activeView === 'progress' && <ProgressView profile={profile} />} 
                {activeView === 'supplements' && <Supplements />}
                {activeView === 'recipes' && <RecipeView profile={profile} />}
                
                {activeView === 'settings' && (
                    <SettingsView 
                        profile={profile} 
                        onUpdateProfile={onUpdateProfile} 
                        onLogout={handleLogout} 
                    />
                )}
                
                {/* Placeholder Views */}
                {activeView === 'notifications' && (
                    <PlaceholderView 
                        title="Notificações" 
                        icon={<Bell className="w-full h-full" />} 
                        desc="Configure seus lembretes de água, treino e refeições para manter a disciplina."
                    />
                )}
            </div>
        </ErrorBoundary>
      </main>

      {/* EXPORT MODAL */}
      {showExportModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in modal-overlay">
            <div className="bg-surface w-full max-w-md rounded-3xl shadow-2xl border border-white/10 overflow-hidden relative">
                <button onClick={() => setShowExportModal(false)} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full text-muted hover:text-white z-10">
                    <X className="w-5 h-5" />
                </button>
                
                <div className="p-8 text-center bg-gradient-to-b from-primary/10 to-transparent">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow text-white">
                        <Download className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-secondary mb-2">Baixar PDF</h3>
                    <p className="text-muted text-sm">Selecione o que você deseja exportar ou imprimir.</p>
                </div>

                <div className="p-6 space-y-3">
                    <button 
                        onClick={() => handleSpecificExport('workout')}
                        className="w-full p-4 rounded-xl bg-black/20 border border-white/5 hover:bg-primary hover:text-white hover:border-primary hover:shadow-lg transition-all flex items-center gap-4 group"
                    >
                        <div className="p-3 bg-white/5 rounded-lg group-hover:bg-white/20">
                            <Dumbbell className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-base">Baixar Treino</p>
                            <p className="text-xs text-muted group-hover:text-white/80">Salvar rotina de exercícios</p>
                        </div>
                    </button>

                    <button 
                        onClick={() => handleSpecificExport('diet')}
                        className="w-full p-4 rounded-xl bg-black/20 border border-white/5 hover:bg-primary hover:text-white hover:border-primary hover:shadow-lg transition-all flex items-center gap-4 group"
                    >
                        <div className="p-3 bg-white/5 rounded-lg group-hover:bg-white/20">
                            <UtensilsCrossed className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-base">Baixar Dieta</p>
                            <p className="text-xs text-muted group-hover:text-white/80">Salvar plano alimentar</p>
                        </div>
                    </button>
                </div>
                
                <div className="p-4 bg-black/30 text-center">
                    <p className="text-[10px] text-gray-500">O arquivo será gerado pelo seu navegador.</p>
                </div>
            </div>
        </div>
      )}

      {/* Goals Modal */}
      {showGoals && (
        <GoalSettings 
            currentProfile={profile} 
            onSave={(p) => {
                onUpdateProfile(p);
                showToast("Metas atualizadas com sucesso! 🏆", "success");
            }} 
            onCancel={() => setShowGoals(false)} 
        />
      )}

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 w-full bg-surface/95 backdrop-blur-lg border-t border-white/5 pb-safe pt-2 px-6 flex justify-around items-center z-50 no-print shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.3)] md:hidden">
        <button 
          onClick={() => safeNavigate('workout')}
          className={`flex flex-col items-center p-3 rounded-2xl transition-all ${activeView === 'workout' ? 'text-primary bg-primary/10 transform -translate-y-2 shadow-glow' : 'text-muted hover:bg-white/5'}`}
        >
          <Dumbbell className={`w-6 h-6 ${activeView === 'workout' ? 'fill-current' : ''}`} />
        </button>

        <button 
          onClick={() => safeNavigate('diet')}
          className={`flex flex-col items-center p-3 rounded-2xl transition-all ${activeView === 'diet' ? 'text-primary bg-primary/10 transform -translate-y-2 shadow-glow' : 'text-muted hover:bg-white/5'}`}
        >
          <UtensilsCrossed className={`w-6 h-6 ${activeView === 'diet' ? 'fill-current' : ''}`} />
        </button>
        
         <button 
          onClick={() => setIsMenuOpen(true)}
          className={`flex flex-col items-center p-3 rounded-2xl transition-all text-muted hover:bg-white/5`}
        >
          <Menu className="w-6 h-6" />
        </button>
      </nav>
    </div>
  );
};