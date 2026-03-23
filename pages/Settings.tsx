import React, { useState } from 'react';
import { useHR } from '../context/HRContext';

const Settings: React.FC = () => {
  const { authenticatedUser } = useHR();
  const [companySettings, setCompanySettings] = useState({
    name: 'Nexus RH Enterprise',
    logo: '',
    primaryColor: '#2563eb',
    notifications: true,
    aiInsights: true
  });

  const [activeTab, setActiveTab] = useState('ent');

  return (
    <div className="space-y-8 animate-fadeIn pb-20">
      {/* Banner de Configurações Estilizado */}
      <div className="bg-slate-900 border border-slate-200 relative min-h-[200px] flex items-center px-10 overflow-hidden">
         <img 
            src="https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&q=80&w=1200" 
            className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale"
            alt="Settings"
         />
         <div className="relative z-10 w-full flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="text-center lg:text-left">
               <h1 className="text-3xl font-bold text-white tracking-tight">Preferências do Sistema</h1>
               <p className="text-sm text-slate-400 mt-2 max-w-md font-medium italic">Parametrização do Core Nexus, segurança de dados e protocolos de automação.</p>
            </div>
            
            <div className="px-8 py-3 bg-white/5 border border-white/10 text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">
               Ambiente: Produção v2.4
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="space-y-2">
           {[
             { id: 'ent', label: 'Empresarial' },
             { id: 'sec', label: 'Segurança' },
             { id: 'not', label: 'Notificações' },
             { id: 'usr', label: 'Usuário' }
           ].map(item => (
             <button 
               key={item.id}
               onClick={() => setActiveTab(item.id)}
               className={`w-full text-left px-8 py-4 border transition-all text-[10px] font-bold uppercase tracking-widest italic
                 ${activeTab === item.id 
                   ? 'bg-slate-900 text-white border-slate-900 shadow-xl scale-[1.02]' 
                   : 'bg-white border-slate-100 text-slate-400 hover:border-slate-900 hover:text-slate-900'}
               `}
             >
               {item.label}
             </button>
           ))}
        </aside>

        <main className="lg:col-span-3 space-y-8">
           <section className="bg-white border border-slate-200 p-10 shadow-sm space-y-10 group">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                 <div className="w-1.5 h-1.5 bg-blue-600"></div>
                 <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest italic">Dados da Organização</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-1.5 col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 italic">Razão Social / Nome Fantasia</label>
                    <input 
                       type="text" 
                       value={companySettings.name}
                       onChange={(e) => setCompanySettings({...companySettings, name: e.target.value})}
                       className="w-full border-b border-slate-200 py-2 text-sm text-slate-900 font-bold outline-none focus:border-blue-600 transition-colors bg-transparent"
                    />
                 </div>
                 
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 italic">Idioma do Core</label>
                    <select className="w-full border-b border-slate-200 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 transition-colors bg-transparent">
                       <option>Português (Brasil)</option>
                       <option>Inglês (Global Standard)</option>
                    </select>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 italic">Moeda de Referência</label>
                    <select className="w-full border-b border-slate-200 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 transition-colors bg-transparent">
                       <option>BRL (R$ Reais)</option>
                       <option>USD ($ Dólar)</option>
                    </select>
                 </div>
              </div>
           </section>

           <section className="bg-white border border-slate-200 p-10 shadow-sm space-y-10 group">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                 <div className="w-1.5 h-1.5 bg-slate-900"></div>
                 <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest italic">Protocolos de Funcionalidade</h3>
              </div>
              
              <div className="space-y-6">
                 {[
                   { id: 'ai', label: 'Insights Cognitivos Nexus AI', desc: 'Análise neural de talentos e clima.', active: companySettings.aiInsights },
                   { id: 'not', label: 'Sincronização de Notificações', desc: 'Alertas bio-metricos em tempo real.', active: companySettings.notifications }
                 ].map((opt, i) => (
                   <div key={i} className="flex items-center justify-between p-6 border border-slate-50 hover:border-slate-200 transition-all bg-slate-50/30">
                      <div className="flex items-center gap-6">
                         <div className={`w-10 h-10 border flex items-center justify-center transition-all ${opt.active ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-200 border-slate-100'}`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={opt.id === 'ai' ? "M13 10V3L4 14h7v7l9-11h-7z" : "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"} />
                            </svg>
                         </div>
                         <div>
                            <p className="text-xs font-bold text-slate-900 uppercase italic leading-none">{opt.label}</p>
                            <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest italic">{opt.desc}</p>
                         </div>
                      </div>
                      <button className={`w-12 h-6 border transition-all relative ${opt.active ? 'bg-blue-600 border-blue-600' : 'bg-slate-100 border-slate-200'}`}>
                         <div className={`absolute top-0.5 w-4.5 h-4.5 bg-white shadow-sm transition-all ${opt.active ? 'right-0.5' : 'left-0.5'}`}></div>
                      </button>
                   </div>
                 ))}
              </div>
           </section>

           <div className="pt-6">
              <button className="w-full bg-slate-900 text-white py-5 text-[10px] font-bold uppercase tracking-[0.5rem] hover:bg-blue-600 transition-all shadow-xl italic">
                 Consolidar Configurações
              </button>
           </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
