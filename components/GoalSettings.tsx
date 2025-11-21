import React, { useState } from 'react';
import { UserProfile, UserGoal } from '../types';
import { Button } from './Button';
import { Target, Calendar, Bell, Weight, ArrowLeft, Save, Trophy } from 'lucide-react';

interface GoalSettingsProps {
  currentProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
  onCancel: () => void;
}

export const GoalSettings: React.FC<GoalSettingsProps> = ({ currentProfile, onSave, onCancel }) => {
  const [formData, setFormData] = useState<UserProfile>({ ...currentProfile });
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.goal || !formData.weight || !formData.targetWeight) {
        setError('Por favor, preencha todas as informações antes de continuar.');
        return;
    }

    onSave(formData);
    setShowSuccess(true);
    setTimeout(() => {
        onCancel();
    }, 1500);
  };

  if (showSuccess) {
      return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
              <div className="bg-surface p-8 rounded-3xl shadow-soft text-center border border-primary/20 max-w-sm w-full">
                  <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 text-primary shadow-glow">
                      <Trophy className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-secondary mb-2">Metas Salvas!</h3>
                  <p className="text-muted">Metas definidas com sucesso! 🏆</p>
              </div>
          </div>
      )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto">
      <div className="bg-surface w-full max-w-lg rounded-3xl shadow-soft border border-white/10 flex flex-col my-auto animate-slide-up">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
            <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
                <Target className="text-primary" /> Definir Metas
            </h2>
            <button onClick={onCancel} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
            </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
                <div className="bg-red-500/10 text-red-400 p-3 rounded-xl text-sm text-center border border-red-500/20">
                    {error}
                </div>
            )}

            {/* Objetivo */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-muted uppercase flex items-center gap-2">
                    <Target className="w-4 h-4" /> Objetivo Principal
                </label>
                <select 
                    value={formData.goal}
                    onChange={e => setFormData({...formData, goal: e.target.value as UserGoal})}
                    className="w-full bg-input border border-white/5 rounded-xl p-4 text-secondary focus:border-primary outline-none cursor-pointer"
                >
                    {Object.values(UserGoal).map(g => (
                        <option key={g} value={g}>{g}</option>
                    ))}
                </select>
            </div>

            {/* Pesos */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-muted uppercase flex items-center gap-2">
                        <Weight className="w-4 h-4" /> Peso Atual (kg)
                    </label>
                    <input 
                        type="number" 
                        value={formData.weight}
                        onChange={e => setFormData({...formData, weight: Number(e.target.value)})}
                        className="w-full bg-input border border-white/5 rounded-xl p-4 text-secondary focus:border-primary outline-none"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-primary uppercase flex items-center gap-2">
                        <Target className="w-4 h-4" /> Peso Meta (kg)
                    </label>
                    <input 
                        type="number" 
                        value={formData.targetWeight || ''}
                        onChange={e => setFormData({...formData, targetWeight: Number(e.target.value)})}
                        placeholder="Ex: 70"
                        className="w-full bg-input border border-white/5 rounded-xl p-4 text-secondary focus:border-primary outline-none placeholder-gray-600"
                    />
                </div>
            </div>

            {/* Prazo */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-muted uppercase flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Prazo para alcançar
                </label>
                <select 
                    value={formData.deadline || 12}
                    onChange={e => setFormData({...formData, deadline: Number(e.target.value)})}
                    className="w-full bg-input border border-white/5 rounded-xl p-4 text-secondary focus:border-primary outline-none cursor-pointer"
                >
                    <option value={4}>4 Semanas (1 Mês)</option>
                    <option value={8}>8 Semanas (2 Meses)</option>
                    <option value={12}>12 Semanas (3 Meses)</option>
                    <option value={24}>24 Semanas (6 Meses)</option>
                </select>
            </div>

            {/* Lembrete */}
            <div className="bg-input rounded-xl p-4 flex items-center justify-between border border-white/5 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full transition-colors ${formData.reminders ? 'bg-primary/20 text-primary' : 'bg-white/5 text-gray-500'}`}>
                        <Bell className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-bold text-secondary">Lembretes Diários</p>
                        <p className="text-xs text-muted">Receber notificações de progresso</p>
                    </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={formData.reminders || false}
                        onChange={e => setFormData({...formData, reminders: e.target.checked})}
                        className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
                    Voltar
                </Button>
                <Button type="submit" className="flex-1">
                    <Save className="w-4 h-4" /> Salvar Metas
                </Button>
            </div>
        </form>
      </div>
    </div>
  );
};