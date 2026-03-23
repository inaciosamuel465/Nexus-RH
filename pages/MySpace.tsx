import React, { useState, useEffect, useMemo } from 'react';
import { useHR } from '../context/HRContext';
import { TimeRecordType } from '../types';

const VacationRequestModal: React.FC<{ isOpen: boolean; onClose: () => void; balance: number; onSubmit: (data: any) => void; }> = ({ isOpen, onClose, balance, onSubmit }) => {
  const [days, setDays] = useState(0);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  useEffect(() => {
    if (start && end) {
      const s = new Date(start + 'T00:00:00');
      const e = new Date(end + 'T00:00:00');
      const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      setDays(diff > 0 ? diff : 0);
    }
  }, [start, end]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 w-full max-w-lg shadow-2xl relative overflow-hidden animate-slideIn">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>
        <div className="p-10 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase italic tracking-tight">Provisionar Descanso</h3>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 mt-1 uppercase tracking-[0.3em] leading-none italic">Disponibilidade Nexus: {balance} Ciclos</p>
          </div>
          <button onClick={onClose} className="p-2 transition-colors text-slate-400 dark:text-slate-600 hover:text-slate-900 dark:hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form className="p-10 space-y-8" onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ startDate: start, endDate: end, days, sellTenDays: false, type: 'Individual' });
          onClose();
        }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1 italic">Protocolo de Início</label>
                <input type="date" required value={start} onChange={e => setStart(e.target.value)} className="w-full border-b border-slate-200 dark:border-slate-800 py-3 text-sm text-slate-900 dark:text-white font-bold outline-none focus:border-blue-600 transition-colors bg-transparent cursor-pointer italic" />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1 italic">Manifestação de Retorno</label>
                <input type="date" required value={end} onChange={e => setEnd(e.target.value)} className="w-full border-b border-slate-200 dark:border-slate-800 py-3 text-sm text-slate-900 dark:text-white font-bold outline-none focus:border-blue-600 transition-colors bg-transparent cursor-pointer italic" />
             </div>
          </div>
          <div className="p-10 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-center group hover:bg-white dark:hover:bg-slate-900 transition-all duration-700 shadow-inner">
             <p className="text-4xl font-black text-slate-900 dark:text-white italic tracking-tighter tabular-nums">{days} <span className="text-blue-600 dark:text-blue-400 text-sm font-bold uppercase tracking-[0.3em] ml-4 italic">Days Off</span></p>
          </div>
          <button type="submit" disabled={days <= 0 || days > balance} className="w-full py-5 bg-slate-900 dark:bg-blue-600 text-white text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-blue-700 dark:hover:bg-blue-500 shadow-[0_20px_50px_rgba(37,99,235,0.3)] transition-all duration-500 disabled:opacity-20 italic">Encaminhar Protocolo Nexus</button>
        </form>
      </div>
    </div>
  );
};

const MySpace: React.FC = () => {
  const { authenticatedUser, timeRecords, vacationRequests, employeeBenefits, benefits, punchTime, requestVacation } = useHR();
  const [now, setNow] = useState(new Date());
  const [showVacationModal, setShowVacationModal] = useState(false);
  const [location, setLocation] = useState('Capturando Bio-Métrica...');

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation(`LAT: ${pos.coords.latitude.toFixed(4)} &bull; LON: ${pos.coords.longitude.toFixed(4)}`),
        () => setLocation('Nexus Safe Node: 0.1')
      );
    }
    return () => clearInterval(timer);
  }, []);

  const myActiveBenefits = useMemo(() => {
    if (!authenticatedUser) return [];
    return employeeBenefits
      .filter(eb => eb.employeeId === authenticatedUser.id && eb.status === 'Ativo')
      .map(eb => ({ ...eb, detail: benefits.find(b => b.id === eb.benefitId) }));
  }, [employeeBenefits, benefits, authenticatedUser]);

  if (!authenticatedUser) return null;

  return (
    <div className="space-y-8 animate-fadeIn pb-20">
      <div className="bg-slate-900 border border-slate-200 dark:border-slate-800 relative min-h-[220px] flex items-center px-10 overflow-hidden shadow-2xl">
         <img 
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200" 
            className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale"
            alt="MySpace"
         />
         <div className="relative z-10 w-full flex flex-col lg:flex-row justify-between items-center gap-8 animate-slideDown">
            <div className="flex items-center gap-10">
               <div className="w-24 h-24 bg-white text-slate-900 flex items-center justify-center text-4xl font-black italic shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative group cursor-pointer overflow-hidden">
                  <div className="absolute inset-0 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                  <span className="relative z-10 group-hover:text-white transition-colors">{authenticatedUser.name[0]}</span>
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 border-4 border-slate-900 z-20"></div>
               </div>
               <div className="text-left">
                  <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase leading-none mb-3">{authenticatedUser.name}</h1>
                  <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.5rem] italic">ID Protocolo: #{authenticatedUser.registration} &bull; {authenticatedUser.role}</p>
               </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 px-12 py-8 text-right min-w-[320px] group shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-1 h-full bg-blue-500"></div>
               <p className="text-5xl font-mono font-black text-white tracking-tighter tabular-nums italic leading-none mb-3 group-hover:text-blue-400 transition-colors">{now.toLocaleTimeString('pt-BR')}</p>
               <div className="flex items-center justify-end gap-3 text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] italic">
                  <span className="w-2 h-2 rounded-none bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                  <span dangerouslySetInnerHTML={{ __html: location }} />
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <section className="xl:col-span-3 space-y-8">
          <div className="nexus-card p-12 group">
            <div className="flex justify-between items-center mb-12 pb-6 border-b border-slate-100 dark:border-slate-800 relative overflow-hidden">
               <div className="absolute bottom-0 left-0 w-24 h-[2px] bg-blue-600"></div>
               <div className="flex items-center gap-6">
                  <div className="w-3 h-3 bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
                  <h3 className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-[0.4em] italic">Registro de Presença Nexus Bio-Secure</h3>
               </div>
               <div className="px-6 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em] italic animate-pulse shadow-inner">
                  Gateway v4.0 Active
               </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { type: 'Entrada' as const, label: 'Bio Auth In', icon: 'M11 16l-4-4m0 0l4-4m-4 4h14', color: 'hover:bg-emerald-50 dark:hover:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30' },
                { type: 'Intervalo Início' as const, label: 'Break Protocol', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'hover:bg-amber-50 dark:hover:bg-amber-950/20 border-amber-100 dark:border-amber-900/30' },
                { type: 'Intervalo Fim' as const, label: 'Resume Sync', icon: 'M13 5l7 7-7 7M5 5l7 7-7 7', color: 'hover:bg-blue-50 dark:hover:bg-blue-950/20 border-blue-100 dark:border-blue-900/30' },
                { type: 'Saída' as const, label: 'Bio Auth Out', icon: 'M17 16l4-4m0 0l-4-4m4 4H7', color: 'hover:bg-red-50 dark:hover:bg-red-950/20 border-red-100 dark:border-red-900/30' }
              ].map(p => (
                <button 
                  key={p.type} 
                  onClick={() => punchTime(p.type, location)} 
                  className={`flex flex-col p-10 border transition-all duration-500 text-left group/punch relative overflow-hidden ${p.color}`}
                >
                  <div className="absolute top-0 right-0 w-2 h-full bg-slate-900 dark:bg-slate-800 transform translate-x-full group-hover/punch:translate-x-0 transition-transform"></div>
                  <div className="mb-8 p-4 bg-slate-900 dark:bg-blue-600 text-white w-fit shadow-2xl group-hover/punch:scale-110 group-hover/punch:rotate-6 transition-all duration-500">
                     <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={p.icon} /></svg>
                  </div>
                  <p className="text-[9px] font-bold uppercase text-slate-400 dark:text-slate-600 tracking-[0.3em] mb-2 italic">{p.label}</p>
                  <p className="font-black text-2xl text-slate-900 dark:text-white italic tracking-tighter uppercase group-hover/punch:text-blue-600 dark:group-hover/punch:text-blue-400 transition-colors">{p.type}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="nexus-card p-10 flex flex-col group overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                <div className="flex items-center gap-6 border-b border-slate-100 dark:border-slate-800 pb-6 mb-10 relative z-10">
                   <div className="w-3 h-3 bg-slate-900 dark:bg-white shadow-[0_0_10px_rgba(0,0,0,0.3)] dark:shadow-[0_0_10px_rgba(255,255,255,0.3)]"></div>
                   <h3 className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-[0.4em] italic">Protocolos de Incentivo</h3>
                </div>
                <div className="space-y-6 max-h-[350px] overflow-y-auto pr-4 custom-scrollbar relative z-10">
                   {myActiveBenefits.length === 0 ? (
                     <div className="py-24 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 italic group-hover:border-blue-600 transition-colors duration-500">
                        <p className="text-slate-400 dark:text-slate-700 font-bold uppercase tracking-[0.5em] text-[10px]">Arquitetura Vazia</p>
                     </div>
                   ) : (
                     myActiveBenefits.map(eb => (
                       <div key={eb.id} className="p-8 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-blue-600 dark:hover:border-blue-500 transition-all duration-500 group/ben shadow-sm hover:shadow-xl relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600 transform -translate-x-full group-hover/ben:translate-x-0 transition-transform"></div>
                          <p className="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em] mb-4 italic border-b border-slate-50 dark:border-slate-800 pb-2 w-fit">{eb.detail?.provider}</p>
                          <p className="text-lg font-black text-slate-900 dark:text-white italic tracking-tighter uppercase leading-none group-hover/ben:translate-x-2 transition-transform">{eb.detail?.name}</p>
                       </div>
                     ))
                   )}
                </div>
             </div>

             <div className="nexus-card p-10 flex flex-col group overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-6 mb-10 relative z-10">
                   <div className="flex items-center gap-6">
                      <div className="w-3 h-3 bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.3)]"></div>
                      <h3 className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-[0.4em] italic">Linha do Tempo Delta</h3>
                   </div>
                   <button onClick={() => setShowVacationModal(true)} className="w-10 h-10 bg-slate-900 dark:bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 dark:hover:bg-blue-500 transition-all duration-500 shadow-xl group/btn overflow-hidden relative">
                      <span className="relative z-10 font-black">+</span>
                      <div className="absolute inset-0 bg-white scale-y-0 group-hover/btn:scale-y-100 transition-transform origin-bottom duration-300 opacity-20"></div>
                   </button>
                </div>
                <div className="space-y-6 relative z-10">
                   {vacationRequests.filter(r => r.employeeId === authenticatedUser.id).slice(0, 3).map(v => (
                     <div key={v.id} className="p-8 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex justify-between items-center hover:border-indigo-600 dark:hover:border-indigo-400 transition-all duration-500 group/vac shadow-sm hover:shadow-xl">
                        <div>
                           <span className="text-lg font-black text-slate-900 dark:text-white italic tracking-tighter uppercase leading-none">{new Date(v.startDate + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                           <span className="text-[10px] font-bold text-slate-400 dark:text-slate-700 uppercase tracking-[0.3em] ml-6 italic group-hover/vac:text-indigo-600 transition-colors">Audit In</span>
                        </div>
                        <div className={`px-6 py-2 text-[10px] font-bold uppercase tracking-[0.3em] italic border transition-all duration-500 ${v.status === 'Aprovado' ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30 text-amber-600 dark:text-amber-400'}`}>
                           {v.status}
                        </div>
                     </div>
                   ))}
                   {vacationRequests.filter(r => r.employeeId === authenticatedUser.id).length === 0 && (
                     <div className="py-24 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 italic">
                        <p className="text-slate-400 dark:text-slate-700 font-bold uppercase tracking-[0.5em] text-[10px]">Ciclo Estacionário</p>
                     </div>
                   )}
                </div>
             </div>
          </div>
        </section>

        <aside className="space-y-8 animate-slideLeft">
           <div className="bg-slate-950 p-12 text-white shadow-2xl flex flex-col justify-between h-[550px] border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 -mr-40 -mt-40 rounded-full blur-3xl group-hover:bg-blue-600/20 transition-all duration-1000"></div>
              <div className="space-y-16 relative z-10">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.5rem] text-blue-500 mb-12 border-b border-white/5 pb-6 italic">Bio-Saldos Nexus v1</h4>
                <div className="space-y-16">
                   <div className="group/item hover:translate-x-3 transition-transform duration-500">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-4 italic">Malha de Tempo (Delta +)</p>
                      <p className="text-6xl font-black italic tracking-tighter leading-none group-hover/item:text-blue-500 transition-colors">+ 04:12 <span className="text-sm text-blue-500 font-bold uppercase ml-2 italic tracking-[0.2em]">hours</span></p>
                   </div>
                   <div className="group/item hover:translate-x-3 transition-transform duration-500">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-4 italic">Potencial de Descanso</p>
                      <p className="text-7xl font-black text-emerald-400 italic tracking-tighter leading-none group-hover/item:text-emerald-300 transition-colors">{authenticatedUser.vacationBalance} <span className="text-xs text-white/20 font-bold uppercase ml-4 tracking-[0.3em] italic">Cycles</span></p>
                   </div>
                </div>
              </div>

              <div className="pt-12 border-t border-white/5 relative z-10">
                 <div className="bg-white/5 p-8 border-l-2 border-blue-600 italic backdrop-blur-md">
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.4em] mb-4 italic">Nexus AI Engine:</p>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-bold uppercase tracking-[0.15em] italic">
                       Provisione seu ciclo de descanso com <span className="text-white">45 dias</span> de antecedência para desbloquear o <span className="text-blue-500">Nexus Bio-Bônus</span>.
                    </p>
                 </div>
              </div>
           </div>
        </aside>
      </div>

      <VacationRequestModal isOpen={showVacationModal} onClose={() => setShowVacationModal(false)} balance={authenticatedUser.vacationBalance} onSubmit={requestVacation} />
    </div>
  );
};

export default MySpace;
