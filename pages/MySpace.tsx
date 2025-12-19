
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 md:p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-[2rem] md:rounded-[3rem] w-full max-w-lg shadow-2xl overflow-hidden animate-slideIn">
        <div className="p-6 md:p-10 border-b border-gray-100 bg-blue-50/50 flex justify-between items-center">
          <div>
            <h3 className="text-lg md:text-xl font-black text-blue-900 uppercase tracking-tighter">Solicitar Férias</h3>
            <p className="text-[9px] md:text-[10px] font-black text-blue-400 uppercase tracking-widest mt-1">Saldo: {balance} dias</p>
          </div>
          <button onClick={onClose} className="p-2 text-blue-300 hover:bg-blue-100 rounded-full"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l18 18" /></svg></button>
        </div>
        <form className="p-6 md:p-10 space-y-6" onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ startDate: start, endDate: end, days, sellTenDays: (e.currentTarget.elements.namedItem('sell') as HTMLInputElement).checked, type: 'Individual' });
          onClose();
        }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase px-2">Início</label>
                <input type="date" required value={start} onChange={e => setStart(e.target.value)} className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold" />
             </div>
             <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase px-2">Retorno</label>
                <input type="date" required value={end} onChange={e => setEnd(e.target.value)} className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold" />
             </div>
          </div>
          <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 text-center">
             <p className="text-lg font-black text-gray-900">{days} Dias Calculados</p>
          </div>
          <button type="submit" disabled={days <= 0 || days > balance} className="w-full py-4 md:py-5 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl disabled:opacity-50">Protocolar Pedido</button>
        </form>
      </div>
    </div>
  );
};

const MySpace: React.FC = () => {
  const { authenticatedUser, timeRecords, vacationRequests, employeeBenefits, benefits, punchTime, requestVacation } = useHR();
  const [now, setNow] = useState(new Date());
  const [showVacationModal, setShowVacationModal] = useState(false);
  const [location, setLocation] = useState('Localizando...');

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation(`${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}`),
        () => setLocation('GPS Inativo')
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
    <div className="space-y-6 md:space-y-10 animate-fadeIn pb-12">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="w-14 h-14 md:w-20 md:h-20 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl text-2xl md:text-4xl font-black">
             {authenticatedUser.name[0]}
          </div>
          <div>
            <h2 className="text-xl md:text-3xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">Meu Portal</h2>
            <p className="text-[10px] md:text-xs text-gray-500 font-medium mt-1">Acesso exclusivo: <span className="font-bold text-indigo-600">{authenticatedUser.name}</span></p>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 md:px-10 md:py-5 rounded-2xl md:rounded-[2.5rem] border border-gray-100 text-center sm:text-right w-full sm:w-auto">
          <p className="text-3xl md:text-5xl font-mono font-black text-gray-900 tracking-tighter tabular-nums">{now.toLocaleTimeString('pt-BR')}</p>
          <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 flex items-center justify-center sm:justify-end gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            {location}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-10">
        <section className="xl:col-span-2 space-y-6 md:space-y-10">
          <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[4rem] border border-gray-100 shadow-sm">
            <h3 className="text-lg md:text-xl font-black text-gray-900 uppercase tracking-tighter mb-8 flex items-center gap-3">
              <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
              Ponto Digital
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { type: 'Entrada' as const, color: 'from-green-500 to-emerald-600', label: 'Check-In' },
                { type: 'Intervalo Início' as const, color: 'from-amber-400 to-orange-500', label: 'Almoço' },
                { type: 'Intervalo Fim' as const, color: 'from-blue-400 to-indigo-500', label: 'Retorno' },
                { type: 'Saída' as const, color: 'from-red-500 to-rose-600', label: 'Check-Out' }
              ].map(p => (
                <button 
                  key={p.type} 
                  onClick={() => punchTime(p.type, location)} 
                  className={`bg-gradient-to-br ${p.color} p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] text-white shadow-lg hover:scale-[1.02] transition-all active:scale-95 text-left relative overflow-hidden`}
                >
                  <p className="text-[8px] font-black uppercase opacity-70 mb-1">{p.label}</p>
                  <p className="font-black text-lg md:text-xl leading-none">{p.type}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
             <div className="bg-white p-8 md:p-10 rounded-[2rem] md:rounded-[4rem] border border-gray-100 shadow-sm">
                <h3 className="text-lg font-black text-gray-900 uppercase mb-8">Benefícios</h3>
                <div className="space-y-3">
                   {myActiveBenefits.length === 0 ? (
                     <div className="py-12 text-center text-gray-400 italic text-xs border-2 border-dashed border-gray-100 rounded-3xl">Vazio.</div>
                   ) : (
                     myActiveBenefits.map(eb => (
                       <div key={eb.id} className="p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-indigo-100 transition-all">
                          <p className="text-[8px] font-black text-indigo-600 uppercase mb-1">{eb.detail?.provider}</p>
                          <p className="text-xs font-black text-gray-900 truncate">{eb.detail?.name}</p>
                       </div>
                     ))
                   )}
                </div>
             </div>

             <div className="bg-white p-8 md:p-10 rounded-[2rem] md:rounded-[4rem] border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                   <h3 className="text-lg font-black text-gray-900 uppercase">Férias</h3>
                   <button onClick={() => setShowVacationModal(true)} className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                   </button>
                </div>
                <div className="space-y-3">
                   {vacationRequests.filter(r => r.employeeId === authenticatedUser.id).slice(0, 3).map(v => (
                     <div key={v.id} className="p-4 bg-gray-50 rounded-2xl flex justify-between items-center">
                        <span className="text-xs font-bold">{new Date(v.startDate + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                        <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase ${v.status === 'Aprovado' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{v.status}</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </section>

        <aside className="space-y-6 md:space-y-10">
           <div className="bg-gray-900 p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] text-white shadow-2xl relative overflow-hidden">
              <h4 className="text-[10px] font-black uppercase text-indigo-400 mb-10 pb-4 border-b border-white/5">Saldos Atuais</h4>
              <div className="space-y-8">
                 <div>
                    <p className="text-[9px] font-black text-gray-500 uppercase mb-1">Horas Acumuladas</p>
                    <p className="text-3xl font-black tabular-nums">+ 04:12h</p>
                 </div>
                 <div>
                    <p className="text-[9px] font-black text-gray-500 uppercase mb-1">Saldo Férias</p>
                    <p className="text-3xl font-black tabular-nums text-emerald-400">{authenticatedUser.vacationBalance} dias</p>
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
