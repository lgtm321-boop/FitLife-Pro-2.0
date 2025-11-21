
import React, { useMemo, useState } from 'react';
import { UserProfile, UserGoal } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingDown, TrendingUp, Target, Scale, Calendar, ArrowRight, Info, Camera, ImageIcon } from 'lucide-react';

interface ProgressViewProps {
  profile: UserProfile;
}

export const ProgressView: React.FC<ProgressViewProps> = ({ profile }) => {
  const [currentPhoto, setCurrentPhoto] = useState<string>('');

  const data = useMemo(() => {
    if (profile.weightHistory && profile.weightHistory.length > 1) {
      return profile.weightHistory;
    }

    // Gerar dados simulados para demonstração se não houver histórico
    const current = profile.weight;
    const target = profile.targetWeight || current;
    const isLosing = profile.goal === UserGoal.LoseWeight;
    
    // Cria um histórico fictício
    return [
      { date: 'Semana 1', weight: isLosing ? current + 3 : current - 2 },
      { date: 'Semana 2', weight: isLosing ? current + 2 : current - 1.5 },
      { date: 'Semana 3', weight: isLosing ? current + 1 : current - 0.8 },
      { date: 'Atual', weight: current },
    ];
  }, [profile]);

  const handleCurrentPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setCurrentPhoto(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
  };

  const startWeight = data[0].weight;
  const currentWeight = profile.weight;
  const targetWeight = profile.targetWeight || currentWeight;
  
  const difference = currentWeight - startWeight;
  const isPositiveTrend = profile.goal === UserGoal.GainMuscle 
    ? difference > 0 
    : difference < 0;

  // Cores baseadas no tema
  const strokeColor = isPositiveTrend ? "#00C896" : "#FB923C"; 

  return (
    <div className="space-y-6 animate-fade-in pb-24">
      {/* Header Card */}
      <div className="bg-surface p-6 rounded-3xl shadow-soft border border-white/5 relative overflow-hidden">
         <div className="absolute right-0 top-0 w-40 h-40 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full -mr-10 -mt-10 z-0"></div>
         <div className="relative z-10">
             <h2 className="text-xl font-bold text-secondary mb-1 flex items-center gap-2">
               <Scale className="text-primary" /> Evolução Corporal
             </h2>
             <p className="text-muted text-sm">Acompanhe sua jornada rumo ao objetivo.</p>
         </div>
      </div>

      {/* Transformation Photos Section */}
      <div className="bg-surface p-6 rounded-3xl shadow-soft border border-white/5">
          <div className="flex items-center gap-2 mb-4">
              <Camera className="text-primary w-5 h-5" />
              <h3 className="text-lg font-bold text-secondary">Transformação Visual</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
              {/* Before Photo */}
              <div className="space-y-2">
                  <p className="text-xs font-bold text-muted uppercase text-center">Início</p>
                  <div className="aspect-[3/4] rounded-2xl bg-black/30 border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden relative group">
                      {profile.startingPhoto ? (
                          <img src={profile.startingPhoto} alt="Foto Inicial" className="w-full h-full object-cover" />
                      ) : (
                          <div className="text-center p-4">
                              <ImageIcon className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                              <span className="text-[10px] text-gray-500">Sem foto inicial</span>
                          </div>
                      )}
                  </div>
              </div>

              {/* After/Current Photo */}
              <div className="space-y-2">
                  <p className="text-xs font-bold text-muted uppercase text-center">Atual</p>
                  <div className="aspect-[3/4] rounded-2xl bg-black/30 border-2 border-dashed border-primary/30 flex items-center justify-center overflow-hidden relative group hover:border-primary transition-colors cursor-pointer">
                      {currentPhoto ? (
                          <img src={currentPhoto} alt="Foto Atual" className="w-full h-full object-cover" />
                      ) : (
                          <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer p-4">
                              <div className="bg-primary/10 p-3 rounded-full mb-2 group-hover:scale-110 transition-transform">
                                <Camera className="w-6 h-6 text-primary" />
                              </div>
                              <span className="text-[10px] text-primary font-bold uppercase">Adicionar Foto</span>
                              <input type="file" accept="image/*" className="hidden" onChange={handleCurrentPhotoUpload} />
                          </label>
                      )}
                      {/* Se já tem foto, permite trocar clicando em cima (overlay) */}
                      {currentPhoto && (
                          <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                              <span className="text-xs font-bold text-white border border-white rounded-full px-3 py-1">Alterar</span>
                              <input type="file" accept="image/*" className="hidden" onChange={handleCurrentPhotoUpload} />
                          </label>
                      )}
                  </div>
              </div>
          </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Peso Atual */}
        <div className="bg-surface p-5 rounded-3xl border border-white/5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-muted uppercase mb-1 tracking-wider">Peso Atual</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-white">{currentWeight}</span>
              <span className="text-sm text-muted">kg</span>
            </div>
          </div>
          <div className={`p-3 rounded-2xl ${isPositiveTrend ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
            {isPositiveTrend ? <TrendingDown className="w-6 h-6" /> : <TrendingUp className="w-6 h-6" />}
          </div>
        </div>

        {/* Meta Final */}
        <div className="bg-surface p-5 rounded-3xl border border-white/5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-muted uppercase mb-1 tracking-wider">Meta Final</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-white">{targetWeight}</span>
              <span className="text-sm text-muted">kg</span>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
            <Target className="w-6 h-6" />
          </div>
        </div>

        {/* Diferença */}
        <div className="bg-surface p-5 rounded-3xl border border-white/5 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-[10px] font-bold text-muted uppercase mb-1 tracking-wider">Diferença</p>
             <div className="flex items-baseline gap-1">
               <span className="text-3xl font-bold text-white">{Math.abs(targetWeight - currentWeight).toFixed(1)}</span>
               <span className="text-sm text-muted">kg</span>
             </div>
           </div>
           <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500">
             <Calendar className="w-6 h-6" />
           </div>
        </div>
      </div>

      {/* Line Chart Section */}
      <div className="bg-surface p-6 rounded-3xl shadow-soft border border-white/5">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-secondary pl-3 border-l-4 border-primary">Histórico de Peso</h3>
            <div className="bg-white/5 p-2 rounded-full text-muted hover:text-white transition-colors">
                <Info className="w-4 h-4" />
            </div>
        </div>
        
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.5} />
              <XAxis 
                dataKey="date" 
                stroke="#94A3B8" 
                fontSize={12} 
                tickLine={false}
                axisLine={false}
                dy={15}
              />
              <YAxis 
                stroke="#94A3B8" 
                fontSize={12} 
                tickLine={false}
                axisLine={false}
                domain={['dataMin - 2', 'dataMax + 2']}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0E1E2E', border: '1px solid #334155', borderRadius: '12px', color: '#fff', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}
                itemStyle={{ color: strokeColor, fontWeight: 'bold' }}
                formatter={(value: number) => [`${value} kg`, 'Peso']}
                labelStyle={{ color: '#94A3B8', marginBottom: '8px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}
                cursor={{ stroke: '#ffffff', strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.3 }}
              />
              <ReferenceLine y={targetWeight} stroke="#3B82F6" strokeDasharray="3 3" label={{ position: 'insideTopRight',  value: 'Meta', fill: '#3B82F6', fontSize: 12, fontWeight: 'bold', dy: -10 }} />
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke={strokeColor} 
                strokeWidth={4}
                dot={{ r: 6, fill: '#152238', stroke: strokeColor, strokeWidth: 3 }}
                activeDot={{ r: 8, fill: strokeColor, stroke: '#fff', strokeWidth: 3 }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <p className="text-center text-xs text-muted mt-6 bg-black/20 py-2 rounded-lg mx-auto max-w-xs">
           Dados atualizados semanalmente
        </p>
      </div>

      {/* Insights Footer */}
      <div className="bg-gradient-to-r from-primary/5 to-blue-500/5 p-6 rounded-3xl border border-white/5 flex items-start gap-4">
          <div className="bg-surface p-3 rounded-full shrink-0 shadow-sm border border-white/5">
              <ArrowRight className="w-5 h-5 text-primary" />
          </div>
          <div>
              <h4 className="text-secondary font-bold text-sm mb-1">Análise de Tendência</h4>
              <p className="text-muted text-xs leading-relaxed">
                  {isPositiveTrend 
                    ? "Ótimo trabalho! Sua linha de tendência indica progresso consistente em direção ao seu objetivo." 
                    : "Pequenas variações são normais. Ajuste sua dieta se a tendência persistir por mais de 2 semanas."}
              </p>
          </div>
      </div>
    </div>
  );
};
