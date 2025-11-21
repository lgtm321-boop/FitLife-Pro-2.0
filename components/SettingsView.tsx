
import React, { useState } from 'react';
import { UserProfile, UserGoal, UserLevel } from '../types';
import { Button } from './Button';
import { Settings, User, Bell, Trash2, Save, LogOut, Moon, Sun, ChevronRight, Shield, Activity, Camera } from 'lucide-react';

interface SettingsViewProps {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onLogout: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ profile, onUpdateProfile, onLogout }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<UserProfile>({ ...profile });
  const [notifications, setNotifications] = useState({
      workout: true,
      water: true,
      meal: false
  });

  const handleSave = () => {
      onUpdateProfile(formData);
      setEditMode(false);
      // Aqui poderia adicionar um feedback de sucesso
  };

  const handleResetApp = () => {
      if(window.confirm("Tem certeza? Isso apagará todos os seus dados locais e resetará o app.")) {
          onLogout();
          localStorage.clear();
          window.location.reload();
      }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData({ ...formData, startingPhoto: reader.result as string });
        };
        reader.readAsDataURL(file);
      }
  };

  return (
    <div className="pb-24 animate-fade-in space-y-6">
      {/* Header */}
      <div className="bg-surface p-6 rounded-3xl shadow-soft border border-white/5 relative overflow-hidden">
         <div className="relative z-10">
             <h2 className="text-2xl font-bold text-secondary mb-2 flex items-center gap-2">
               <Settings className="text-gray-400" /> Configurações
             </h2>
             <p className="text-muted text-sm">Gerencie sua conta, preferências e dados.</p>
         </div>
      </div>

      {/* Profile Section */}
      <div className="bg-surface rounded-3xl border border-white/5 overflow-hidden">
          <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
              <h3 className="font-bold text-secondary flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" /> Perfil do Atleta
              </h3>
              {!editMode ? (
                  <button onClick={() => setEditMode(true)} className="text-xs text-primary font-bold hover:text-white transition-colors">
                      EDITAR
                  </button>
              ) : (
                  <div className="flex gap-2">
                       <button onClick={() => {setEditMode(false); setFormData({...profile});}} className="text-xs text-red-400 font-bold hover:text-white transition-colors">
                          CANCELAR
                      </button>
                      <button onClick={handleSave} className="text-xs text-green-400 font-bold hover:text-white transition-colors">
                          SALVAR
                      </button>
                  </div>
              )}
          </div>
          
          <div className="p-6 space-y-4">
              {editMode ? (
                  <div className="animate-fade-in">
                       {/* Photo Upload Area */}
                       <div className="flex justify-center mb-6">
                          <div className="relative group cursor-pointer">
                               <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/10 group-hover:border-primary transition-all bg-input">
                                   {formData.startingPhoto ? (
                                       <img src={formData.startingPhoto} alt="Profile" className="w-full h-full object-cover" />
                                   ) : (
                                       <div className="w-full h-full flex items-center justify-center text-muted">
                                           <User className="w-10 h-10" />
                                       </div>
                                   )}
                               </div>
                               <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 rounded-full transition-all">
                                   <Camera className="w-8 h-8 text-white" />
                                   <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                               </label>
                          </div>
                          <p className="text-[10px] text-muted text-center mt-2">Toque na foto para alterar</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                              <label className="text-xs font-bold text-muted uppercase block mb-1">Nome</label>
                              <input 
                                  type="text" 
                                  value={formData.name} 
                                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                                  className="w-full bg-input p-3 rounded-xl text-white border border-white/10 focus:border-primary outline-none"
                              />
                          </div>
                           <div>
                              <label className="text-xs font-bold text-muted uppercase block mb-1">Idade</label>
                              <input 
                                  type="number" 
                                  value={formData.age} 
                                  onChange={(e) => setFormData({...formData, age: Number(e.target.value)})}
                                  className="w-full bg-input p-3 rounded-xl text-white border border-white/10 focus:border-primary outline-none"
                              />
                          </div>
                           <div>
                              <label className="text-xs font-bold text-muted uppercase block mb-1">Peso (kg)</label>
                              <input 
                                  type="number" 
                                  value={formData.weight} 
                                  onChange={(e) => setFormData({...formData, weight: Number(e.target.value)})}
                                  className="w-full bg-input p-3 rounded-xl text-white border border-white/10 focus:border-primary outline-none"
                              />
                          </div>
                           <div>
                              <label className="text-xs font-bold text-muted uppercase block mb-1">Altura (cm)</label>
                              <input 
                                  type="number" 
                                  value={formData.height} 
                                  onChange={(e) => setFormData({...formData, height: Number(e.target.value)})}
                                  className="w-full bg-input p-3 rounded-xl text-white border border-white/10 focus:border-primary outline-none"
                              />
                          </div>
                      </div>
                  </div>
              ) : (
                  <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-2xl font-bold text-white shadow-glow overflow-hidden border-2 border-white/10 shrink-0">
                          {profile.startingPhoto ? (
                              <img src={profile.startingPhoto} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                              profile.name.charAt(0)
                          )}
                      </div>
                      <div>
                          <h4 className="text-xl font-bold text-white">{profile.name}</h4>
                          <p className="text-muted text-sm">{profile.age} anos • {profile.weight}kg • {profile.height}cm</p>
                          <div className="flex gap-2 mt-2">
                              <span className="bg-white/5 px-2 py-1 rounded text-xs font-bold text-gray-400 uppercase">{profile.level}</span>
                              <span className="bg-white/5 px-2 py-1 rounded text-xs font-bold text-gray-400 uppercase">{profile.goal}</span>
                          </div>
                      </div>
                  </div>
              )}
          </div>
      </div>

      {/* Preferences */}
      <div className="bg-surface rounded-3xl border border-white/5 overflow-hidden">
          <div className="p-4 border-b border-white/5 bg-white/5">
              <h3 className="font-bold text-secondary flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-400" /> Preferências do App
              </h3>
          </div>
          <div className="divide-y divide-white/5">
              <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500"><Bell className="w-5 h-5" /></div>
                      <div>
                          <p className="font-bold text-sm text-gray-200">Notificações de Treino</p>
                          <p className="text-xs text-muted">Lembretes diários para treinar</p>
                      </div>
                  </div>
                  <div onClick={() => setNotifications({...notifications, workout: !notifications.workout})} className={`w-11 h-6 rounded-full relative transition-colors ${notifications.workout ? 'bg-primary' : 'bg-gray-700'}`}>
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications.workout ? 'translate-x-5' : ''}`}></div>
                  </div>
              </div>

               <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><Activity className="w-5 h-5" /></div>
                      <div>
                          <p className="font-bold text-sm text-gray-200">Lembrete de Hidratação</p>
                          <p className="text-xs text-muted">Alertas para beber água</p>
                      </div>
                  </div>
                  <div onClick={() => setNotifications({...notifications, water: !notifications.water})} className={`w-11 h-6 rounded-full relative transition-colors ${notifications.water ? 'bg-primary' : 'bg-gray-700'}`}>
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications.water ? 'translate-x-5' : ''}`}></div>
                  </div>
              </div>
          </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-500/5 rounded-3xl border border-red-500/20 overflow-hidden">
           <div className="p-4 border-b border-red-500/10 bg-red-500/10">
              <h3 className="font-bold text-red-200 flex items-center gap-2">
                  <Shield className="w-5 h-5" /> Zona de Perigo
              </h3>
          </div>
          <div className="p-6">
              <p className="text-xs text-red-300 mb-4">Estas ações são irreversíveis. Tenha cuidado.</p>
              
              <div className="flex flex-col gap-3">
                  <button onClick={onLogout} className="w-full py-3 px-4 rounded-xl bg-surface border border-white/10 text-white font-bold text-sm hover:bg-white/5 flex items-center justify-center gap-2">
                      <LogOut className="w-4 h-4" /> Sair da Conta
                  </button>
                  
                  <button onClick={handleResetApp} className="w-full py-3 px-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-sm hover:bg-red-500/20 flex items-center justify-center gap-2">
                      <Trash2 className="w-4 h-4" /> Resetar Todos os Dados
                  </button>
              </div>
          </div>
      </div>
      
      <div className="text-center pt-4">
          <p className="text-[10px] text-gray-600 font-mono">FitLifePro v1.2.0 (Build 2025.05)</p>
      </div>
    </div>
  );
};
