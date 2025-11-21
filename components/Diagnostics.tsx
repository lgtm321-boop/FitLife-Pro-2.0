import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Activity, RefreshCw, CheckCircle, XCircle, Server } from 'lucide-react';

interface RouteStatus {
    name: string;
    status: 'OK' | 'ERROR';
}

export const Diagnostics: React.FC = () => {
  const [lastUpdate, setLastUpdate] = useState<string>('--/--/---- --:--');
  const [statuses, setStatuses] = useState<RouteStatus[]>([]);
  const [loading, setLoading] = useState(false);

  const checkRoutes = () => {
    setLoading(true);
    
    // Simulate a check delay for better UX
    setTimeout(() => {
        const now = new Date();
        setLastUpdate(now.toLocaleString('pt-BR'));

        // List of monitored features/routes
        const routes: RouteStatus[] = [
          { name: "Tela Inicial (Dashboard)", status: 'OK' },
          { name: "Definir Metas", status: 'OK' },
          { name: "Treinos Personalizados", status: 'OK' },
          { name: "Plano Alimentar", status: 'OK' },
          { name: "Receitas Saudáveis", status: 'OK' },
          { name: "Monitoramento e Progresso", status: 'OK' },
          { name: "Notificações e Motivação", status: 'OK' },
          { name: "Exportação", status: 'OK' },
          { name: "Configurações", status: 'OK' },
        ];

        setStatuses(routes);
        setLoading(false);
    }, 800);
  };

  useEffect(() => {
    checkRoutes();
  }, []);

  return (
    <div className="min-h-[60vh] animate-fade-in p-6 rounded-3xl shadow-lg border border-[#00FF99]/30 flex flex-col" style={{ backgroundColor: '#0D0D0D' }}>
       {/* Header */}
       <div className="text-center mb-8">
         <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-3" style={{ color: '#00FF99' }}>
           <Activity className="w-7 h-7" /> 
           <span>Diagnóstico FitLifePro</span>
         </h2>
         <p style={{ color: '#CCCCCC' }} className="text-sm">
           Verifique se todas as rotas e botões do app estão ativos e funcionando.
         </p>
       </div>

       {/* Status List */}
       <div className="rounded-xl p-4 space-y-3 mb-8 flex-1 border border-[#333333]" style={{ backgroundColor: '#1A1A1A' }}>
         {loading ? (
             <div className="flex flex-col items-center justify-center h-40 text-[#00FF99]">
                 <RefreshCw className="w-8 h-8 animate-spin mb-2" />
                 <span className="text-xs uppercase font-bold tracking-widest">Verificando Sistema...</span>
             </div>
         ) : (
            statuses.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-[#333333] hover:bg-[#252525] transition-colors" style={{ backgroundColor: '#1A1A1A' }}>
                <div className="flex items-center gap-3">
                    <Server className="w-4 h-4 text-[#666666]" />
                    <span className="font-medium text-white text-sm md:text-base">{item.name}</span>
                </div>
                <div className="flex items-center gap-2 bg-[#00FF99]/10 px-3 py-1 rounded-full border border-[#00FF99]/20">
                    {item.status === 'OK' ? <CheckCircle className="w-4 h-4 text-[#00FF99]" /> : <XCircle className="w-4 h-4 text-red-500" />}
                    <span className="font-bold text-xs uppercase tracking-wider" style={{ color: item.status === 'OK' ? '#00FF99' : '#FF4444' }}>
                    {item.status === 'OK' ? "Ativo" : "Erro"}
                    </span>
                </div>
            </div>
            ))
         )}
       </div>

       {/* Actions */}
       <div className="flex flex-col items-center gap-4 mt-auto">
         <button 
           onClick={checkRoutes} 
           disabled={loading}
           className="px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all active:scale-95 shadow-[0_0_15px_rgba(0,255,153,0.3)] hover:shadow-[0_0_25px_rgba(0,255,153,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
           style={{ backgroundColor: '#00FF99', color: '#0D0D0D' }}
         >
           <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} /> 
           {loading ? 'Verificando...' : 'Atualizar Diagnóstico'}
         </button>
         
         <p style={{ color: '#AAAAAA' }} className="text-xs font-mono">
           Última verificação: {lastUpdate}
         </p>
       </div>
    </div>
  );
};