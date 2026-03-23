import React, { useState } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Boas-vindas',
      message: 'Bem-vindo ao novo Nexus RH. Explore as novas funcionalidades!',
      type: 'success',
      timestamp: 'Agora',
      read: false
    },
    {
      id: '2',
      title: 'IA Nexus',
      message: 'Novas recomendações estratégicas disponíveis no painel de IA.',
      type: 'info',
      timestamp: 'Há 5 min',
      read: false
    }
  ]);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 bg-white border border-slate-100 rounded-none text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm relative group"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-none border border-white"></span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-4 w-80 md:w-96 bg-white rounded-none shadow-2xl border border-slate-200 z-50 animate-fadeIn overflow-hidden">
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest italic">Alertas de Fluxo</h3>
              <span className="text-[9px] font-bold bg-slate-900 text-white px-2 py-0.5 rounded-none uppercase italic">
                {notifications.filter(n => !n.read).length} Novos
              </span>
            </div>
            
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {notifications.length > 0 ? (
                notifications.map(n => (
                  <div key={n.id} className="p-6 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer group">
                    <div className="flex gap-4">
                      <div className={`w-1.5 h-1.5 mt-1.5 shrink-0 ${
                        n.type === 'success' ? 'bg-emerald-500' : 
                        n.type === 'info' ? 'bg-blue-600' : 
                        n.type === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                      }`}></div>
                      <div className="space-y-1">
                        <p className="text-[11px] font-bold text-slate-900 leading-tight uppercase italic">{n.title}</p>
                        <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{n.message}</p>
                        <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest pt-2 italic">{n.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center">
                  <p className="text-[10px] font-bold text-slate-300 uppercase italic">Nenhuma Manifestação Recente.</p>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-slate-50/30 text-center border-t border-slate-100">
              <button className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] hover:text-slate-900 transition-colors italic">
                Sincronizar Todas
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationCenter;
