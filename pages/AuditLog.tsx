import React, { useState } from 'react';

const AuditLog: React.FC = () => {
  const [logs] = useState([
    { id: '1', user: 'Admin Nexus', action: 'Atualização de Salário', target: 'João Silva', date: '2026-03-16 14:30', status: 'Success' },
    { id: '2', user: 'Admin Nexus', action: 'Inclusão de Colaborador', target: 'Maria Souza', date: '2026-03-16 11:15', status: 'Success' },
    { id: '3', user: 'Sistema', action: 'Sincronização eSocial', target: 'Lote #442', date: '2026-03-16 09:00', status: 'Warning' },
    { id: '4', user: 'Admin Nexus', action: 'Aprovação de Férias', target: 'Carlos Lima', date: '2026-03-15 16:45', status: 'Success' },
    { id: '5', user: 'Sistema', action: 'Processamento Folha', target: 'Março/2026', date: '2026-03-15 00:05', status: 'Success' },
  ]);

  return (
    <div className="space-y-8 animate-fadeIn pb-20">
      {/* Banner de Auditoria Estilizado */}
      <div className="bg-slate-900 border border-slate-200 relative min-h-[200px] flex items-center px-10 overflow-hidden">
         <img 
            src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1200" 
            className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale"
            alt="Audit"
         />
         <div className="relative z-10 w-full flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="text-center lg:text-left">
               <h1 className="text-3xl font-bold text-white tracking-tight">Registro de Auditoria</h1>
               <p className="text-sm text-slate-400 mt-2 max-w-md font-medium italic">Rastreabilidade total de manifestações, alterações sistêmicas e logs de integridade.</p>
            </div>
            
            <div className="flex gap-4">
               <div className="bg-white/5 border border-white/10 p-4 text-center min-w-[140px]">
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1">Eventos Logs</p>
                  <p className="text-2xl font-bold text-white tracking-tighter">1.248</p>
               </div>
               <div className="bg-white/5 border border-white/10 p-4 text-center min-w-[140px]">
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1">Alertas Fluxo</p>
                  <p className="text-2xl font-bold text-amber-500 tracking-tighter">3</p>
               </div>
            </div>
         </div>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[9px] uppercase font-bold tracking-[0.2em] border-b border-slate-100 italic">
                <th className="px-8 py-5">Timestamp</th>
                <th className="px-8 py-5">Agente</th>
                <th className="px-8 py-5">Ação Executada</th>
                <th className="px-8 py-5">Alvo da Manifestação</th>
                <th className="px-8 py-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-6 text-xs font-mono text-slate-400 tracking-tighter italic">{log.date}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold italic">
                          {log.user[0]}
                       </div>
                       <span className="text-xs font-bold text-slate-900 uppercase italic">{log.user}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-tight group-hover:text-blue-600 transition-colors">{log.action}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[9px] font-bold text-slate-500 bg-slate-50 px-3 py-1 border border-slate-100 uppercase tracking-widest">{log.target}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 text-[8px] font-bold uppercase tracking-widest border ${
                      log.status === 'Success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-amber-50 border-amber-100 text-amber-600'
                    }`}>
                       <span className={`w-1 h-1 rounded-full ${log.status === 'Success' ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`}></span>
                       {log.status === 'Success' ? 'Estável' : 'Alerta'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-8 border-t border-slate-50 text-center bg-slate-50/30">
           <button className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] hover:text-blue-600 transition-all italic">
              Carregar Redes Históricas Adicionais
           </button>
        </div>
      </div>
    </div>
  );
};

export default AuditLog;
