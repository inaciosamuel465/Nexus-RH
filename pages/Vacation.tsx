import React, { useState, useMemo, useEffect } from 'react';
import { useHR } from '../context/HRContext';
import { Employee } from '../types';

const CollectiveVacationModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  employees: Employee[];
  onSchedule: (employeeIds: string[], start: string, end: string) => void;
}> = ({ isOpen, onClose, employees, onSchedule }) => {
  const [selectedDept, setSelectedDept] = useState('Todos');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const depts = useMemo(() => ['Todos', ...Array.from(new Set(employees.map(e => e.department)))], [employees]);
  
  const filteredEmployees = useMemo(() => {
    return selectedDept === 'Todos' ? employees : employees.filter(e => e.department === selectedDept);
  }, [employees, selectedDept]);

  useEffect(() => {
    setSelectedEmployees([]);
  }, [selectedDept]);

  const toggleEmployee = (id: string) => {
    setSelectedEmployees(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const selectAllFiltered = () => {
    const allIds = filteredEmployees.map(e => e.id);
    setSelectedEmployees(allIds);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 w-full max-w-2xl shadow-2xl animate-slideIn flex flex-col max-h-[90vh] relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase italic tracking-tight">Agendar Férias Coletivas</h3>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 mt-1 uppercase tracking-[0.3em] italic">Protocolo de Operação Estratégica</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 dark:text-slate-600 hover:text-slate-900 dark:hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] italic ml-1">Início da Jornada de Descanso</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full border-b border-slate-200 dark:border-slate-800 py-3 text-sm text-slate-900 dark:text-white font-bold outline-none focus:border-blue-600 transition-colors bg-transparent italic" />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] italic ml-1">Retorno Programado</label>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full border-b border-slate-200 dark:border-slate-800 py-3 text-sm text-slate-900 dark:text-white font-bold outline-none focus:border-blue-600 transition-colors bg-transparent italic" />
             </div>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
               <div className="space-y-2 flex-1 w-full">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] italic ml-1">Segmentação por Unidade</label>
                  <select value={selectedDept} onChange={e => setSelectedDept(e.target.value)} className="w-full border-b border-slate-200 dark:border-slate-800 py-3 text-sm text-slate-900 dark:text-white font-bold outline-none focus:border-blue-600 transition-colors bg-transparent italic">
                    {depts.map(d => <option key={d} value={d} className="dark:bg-slate-900">{d}</option>)}
                  </select>
               </div>
               <button type="button" onClick={selectAllFiltered} className="px-8 py-3 border border-slate-200 dark:border-slate-800 text-[9px] font-bold uppercase tracking-[0.3em] italic hover:bg-slate-900 dark:hover:bg-blue-600 hover:text-white transition-all shadow-sm">Selecionar Grupo</button>
            </div>

            <div className="border border-slate-100 dark:border-slate-800 max-h-72 overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-slate-900/50">
               {filteredEmployees.map(emp => (
                 <label key={emp.id} className={`flex items-center justify-between p-5 cursor-pointer transition-all border-b border-slate-100 dark:border-slate-800 last:border-0 ${selectedEmployees.includes(emp.id) ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-white dark:hover:bg-slate-900'}`}>
                    <div className="flex items-center gap-5">
                       <div className={`w-10 h-10 rounded-none flex items-center justify-center font-bold text-[11px] italic transition-all ${selectedEmployees.includes(emp.id) ? 'bg-blue-600 text-white shadow-[0_5px_15px_rgba(37,99,235,0.4)]' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                          {emp.name[0]}
                       </div>
                       <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white uppercase italic truncate max-w-[180px]">{emp.name}</p>
                          <p className="text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase italic tracking-widest">{emp.role}</p>
                       </div>
                    </div>
                    <input 
                     type="checkbox" 
                     className="hidden" 
                     checked={selectedEmployees.includes(emp.id)}
                     onChange={() => toggleEmployee(emp.id)} 
                    />
                    <div className={`w-5 h-5 border transition-all flex items-center justify-center ${selectedEmployees.includes(emp.id) ? 'bg-slate-900 dark:bg-blue-600 border-transparent shadow-md' : 'border-slate-300 dark:border-slate-700'}`}>
                       {selectedEmployees.includes(emp.id) && <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>}
                    </div>
                 </label>
               ))}
            </div>
          </div>

          <div className="p-6 bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-400 flex gap-5 items-start">
             <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center shrink-0">
               <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </div>
             <p className="text-[10px] text-amber-800 dark:text-amber-200/70 font-bold uppercase italic leading-relaxed tracking-tight">
                COMPLIANCE: Férias coletivas exigem período mínimo de 10 dias corridos. O cronograma Nexus ajustará os saldos automaticamente após validação.
             </p>
          </div>
        </div>

        <div className="p-10 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex gap-6">
           <button onClick={onClose} className="flex-1 py-5 border border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-600 hover:bg-white dark:hover:bg-slate-900 transition-all italic">Cancelar</button>
           <button 
            disabled={selectedEmployees.length === 0 || !startDate || !endDate}
            onClick={() => onSchedule(selectedEmployees, startDate, endDate)}
            className="flex-[2] py-5 bg-slate-900 dark:bg-blue-600 text-white text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-blue-700 dark:hover:bg-blue-500 transition-all disabled:opacity-30 shadow-[0_15px_40px_rgba(37,99,235,0.3)] italic"
           >
              Validar e Agendar para {selectedEmployees.length} Talentos
           </button>
        </div>
      </div>
    </div>
  );
};

const RequestVacationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { startDate: string; endDate: string; sellTenDays: boolean }) => void;
  employeeBalance: number;
}> = ({ isOpen, onClose, onSubmit, employeeBalance }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sellTenDays, setSellTenDays] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 w-full max-w-lg shadow-2xl animate-slideIn flex flex-col relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase italic tracking-tight">Solicitar Férias</h3>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 mt-1 uppercase tracking-[0.3em] italic">Protocolo de Descanso</p>
          </div>
        </div>

        <div className="p-8 space-y-8">
           <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 flex justify-between items-center">
             <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest italic">Saldo Disponível</span>
             <span className="text-xl font-bold text-slate-900 dark:text-white italic">{employeeBalance} dias</span>
           </div>

           <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] italic">Data de Início</label>
                 <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full border-b border-slate-200 dark:border-slate-800 py-3 text-sm text-slate-900 dark:text-white font-bold outline-none bg-transparent" />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] italic">Data Final</label>
                 <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full border-b border-slate-200 dark:border-slate-800 py-3 text-sm text-slate-900 dark:text-white font-bold outline-none bg-transparent" />
              </div>
           </div>

           {employeeBalance >= 30 && (
             <label className="flex items-center gap-4 cursor-pointer p-4 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
               <input type="checkbox" checked={sellTenDays} onChange={e => setSellTenDays(e.target.checked)} className="w-5 h-5 accent-blue-600" />
               <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white uppercase italic">Abono Pecuniário (Vender 10 dias)</p>
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-1">Converte 1/3 do período em valor pecuniário.</p>
               </div>
             </label>
           )}
        </div>

        <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex gap-4">
           <button onClick={onClose} className="flex-1 py-4 border border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-600 hover:bg-white dark:hover:bg-slate-900 transition-all italic">Cancelar</button>
           <button 
            disabled={!startDate || !endDate}
            onClick={() => onSubmit({ startDate, endDate, sellTenDays })}
            className="flex-[2] py-4 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-blue-500 transition-all disabled:opacity-30 italic"
           >
              Validar Protocolo
           </button>
        </div>
      </div>
    </div>
  );
};

const Vacation: React.FC = () => {
  const { employees, vacationRequests, approveVacation, rejectVacation, scheduleCollectiveVacation, authenticatedUser, requestVacation } = useHR();
  const isAdmin = authenticatedUser?.userRole === 'ADMIN' || authenticatedUser?.userRole === 'LIDER';

  const [activeTab, setActiveTab] = useState<'calendar' | 'pending'>('calendar');
  const [isCollectiveModalOpen, setIsCollectiveModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('Todos');

  const departments = useMemo(() => ['Todos', ...Array.from(new Set(employees.map(e => e.department)))], [employees]);
  const pendingRequests = useMemo(() => vacationRequests.filter(r => r.status === 'Pendente' && (isAdmin || r.employeeId === authenticatedUser?.id)), [vacationRequests, isAdmin, authenticatedUser]);
  
  const filteredEmployeesForGrid = useMemo(() => {
    if (!isAdmin) return employees.filter(e => e.id === authenticatedUser?.id);
    return selectedDeptFilter === 'Todos' ? employees : employees.filter(e => e.department === selectedDeptFilter);
  }, [employees, selectedDeptFilter, isAdmin, authenticatedUser]);

  const handleRequestVacation = (data: { startDate: string; endDate: string; sellTenDays: boolean }) => {
     if (!authenticatedUser) return;
     const days = Math.floor((new Date(data.endDate).getTime() - new Date(data.startDate).getTime()) / (1000 * 60 * 60 * 24));
     requestVacation({
       employeeId: authenticatedUser.id,
       startDate: data.startDate,
       endDate: data.endDate,
       days,
       status: 'Pendente',
       type: 'Individual',
       sellTenDays: data.sellTenDays
     });
     setIsRequestModalOpen(false);
     alert('Protocolo de férias enviado para aprovação!');
  };


  return (
    <div className="space-y-6 md:space-y-8 animate-fadeIn pb-20">
      <div className="bg-slate-900 border border-slate-200 dark:border-slate-800 relative min-h-[180px] md:min-h-[220px] flex items-center px-6 md:px-10 overflow-hidden shadow-2xl">
         <img 
            src="https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&q=80&w=1200" 
            className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale"
            alt="Vacation"
         />
         <div className="relative z-10 w-full flex flex-col lg:flex-row justify-between items-center gap-6 md:gap-8 animate-slideDown text-center lg:text-left">
            <div>
               <h1 className="text-2xl md:text-4xl font-bold text-white tracking-tighter uppercase italic">Engenharia de Descanso</h1>
               <p className="text-[10px] md:text-sm text-slate-400 mt-2 max-w-lg font-medium italic leading-relaxed">Arquitetando o equilíbrio entre performance e bem-estar organizacional.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 w-full lg:w-auto">
              {isAdmin && (
                <button 
                  onClick={() => setIsCollectiveModalOpen(true)} 
                  className="w-full sm:w-auto px-6 md:px-10 py-4 md:py-5 bg-white text-slate-900 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-blue-600 hover:text-white transition-all duration-500 shadow-2xl italic shrink-0"
                >
                   Acionar Coletivas
                </button>
              )}
              {!isAdmin && (
                <button 
                  onClick={() => setIsRequestModalOpen(true)} 
                  className="w-full sm:w-auto px-6 md:px-10 py-4 md:py-5 bg-white text-slate-900 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-blue-600 hover:text-white transition-all duration-500 shadow-2xl italic shrink-0"
                >
                   Solicitar Férias
                </button>
              )}
              <div className="bg-white/5 backdrop-blur-xl p-1 border border-white/10 flex shadow-2xl w-full sm:w-auto">
                <button onClick={() => setActiveTab('calendar')} className={`flex-1 sm:flex-none px-4 md:px-6 py-3 text-[8px] md:text-[9px] font-bold uppercase tracking-[0.3em] italic transition-all duration-500 ${activeTab === 'calendar' ? 'bg-white text-slate-900 shadow-xl' : 'text-white/40 hover:text-white'}`}>Cronograma</button>
                <button onClick={() => setActiveTab('pending')} className={`flex-1 sm:flex-none px-4 md:px-6 py-3 text-[8px] md:text-[9px] font-bold uppercase tracking-[0.3em] italic transition-all duration-500 relative ${activeTab === 'pending' ? 'bg-white text-slate-900 shadow-xl' : 'text-white/40 hover:text-white'}`}>
                   Protocolos
                   {pendingRequests.length > 0 && <span className="absolute -top-2 -right-2 w-4 h-4 md:w-5 md:h-5 bg-blue-600 text-white text-[8px] flex items-center justify-center rounded-none font-bold shadow-lg animate-pulse">{pendingRequests.length}</span>}
                </button>
              </div>
            </div>
         </div>
      </div>

      {activeTab === 'calendar' ? (
        <div className="nexus-card p-6 md:p-10 animate-fadeIn mx-4 md:mx-0">
           <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12 pb-8 border-b border-slate-50 dark:border-slate-800">
              <div className="flex items-center gap-4">
                 <div className="w-1.5 h-8 bg-slate-900 dark:bg-blue-600"></div>
                 <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-[0.3em] italic">
                    Timeline de Disponibilidade
                 </h3>
              </div>
              {isAdmin && (
                <div className="flex items-center gap-6 bg-slate-50 dark:bg-slate-900/50 px-6 py-3 border border-slate-100 dark:border-slate-800">
                   <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase italic tracking-widest">Unidade Operacional</span>
                   <select value={selectedDeptFilter} onChange={e => setSelectedDeptFilter(e.target.value)} className="bg-transparent border-none text-[10px] font-bold uppercase text-slate-900 dark:text-white outline-none cursor-pointer italic">
                      {departments.map(d => <option key={d} value={d} className="dark:bg-slate-900">{d}</option>)}
                   </select>
                </div>
              )}
           </div>

           <div className="overflow-x-auto no-scrollbar">
              <div className="min-w-[1000px]">
                 <div className="flex items-center px-10 pb-6 mb-8 border-b border-slate-50 dark:border-slate-800/50">
                    <div className="w-80 text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.4em] italic leading-none">Capital Humano</div>
                    <div className="flex-1 grid grid-cols-4 gap-8 text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.4em] italic text-center leading-none">
                       <span>Nov 24</span>
                       <span>Dez 24</span>
                       <span>Jan 25</span>
                       <span>Fev 25</span>
                    </div>
                    <div className="w-40 text-right text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.4em] italic leading-none">Reservas</div>
                 </div>
                 
                 <div className="space-y-4">
                    {filteredEmployeesForGrid.map(emp => {
                      const myRequests = vacationRequests.filter(r => r.employeeId === emp.id && r.status === 'Aprovado');
                      return (
                        <div key={emp.id} className="flex items-center p-4 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all group border-b border-slate-50/50 dark:border-slate-800 last:border-0 relative">
                           <div className="w-80 pr-10 flex items-center gap-5">
                              <div className="w-12 h-12 rounded-none bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[12px] font-bold text-slate-400 uppercase italic transition-all group-hover:bg-slate-900 group-hover:text-white">{emp.name[0]}</div>
                              <div className="min-w-0">
                                 <p className="text-sm font-bold text-slate-900 dark:text-white uppercase italic tracking-tight leading-none mb-2 truncate">{emp.name}</p>
                                 <p className="text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase italic tracking-widest">{emp.department}</p>
                              </div>
                           </div>
                           <div className="flex-1 h-14 bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 relative overflow-hidden flex items-center px-6 shadow-inner">
                              {myRequests.map(r => (
                                <div 
                                 key={r.id} 
                                 className={`h-8 rounded-none absolute flex items-center justify-center px-4 border shadow-xl transition-all hover:scale-105 z-10 ${r.type === 'Coletiva' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white'}`}
                                 style={{ left: r.startDate.includes('2024-11') ? '5%' : r.startDate.includes('2024-12') ? '30%' : r.startDate.includes('2025-01') ? '55%' : '80%', width: '20%' }}
                                >
                                   <span className="text-[8px] font-bold uppercase tracking-[0.3em] truncate italic">{r.type === 'Coletiva' ? 'MÉTODO COLETIVO' : 'RECESSO MÉRITO'}</span>
                                </div>
                              ))}
                              <div className="absolute inset-0 flex justify-between pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
                                {[1,2,3,4,5].map(i => <div key={i} className="w-px h-full bg-slate-900 dark:bg-white"></div>)}
                              </div>
                           </div>
                           <div className="w-40 text-right pl-10">
                              <span className={`text-2xl font-bold tabular-nums italic tracking-tighter transition-all group-hover:text-blue-600 ${emp.vacationBalance < 10 ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>{emp.vacationBalance} <span className="text-[9px] uppercase not-italic text-slate-400 dark:text-slate-600 ml-1 font-bold">dias</span></span>
                           </div>
                        </div>
                      );
                    })}
                 </div>
              </div>
           </div>
        </div>
      ) : (
        <div className="space-y-8 animate-fadeIn">
           <div className="flex justify-between items-center px-4">
              <h3 className="text-[11px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.4em] italic border-l-4 border-blue-600 pl-6">Protocolos Pendentes de Aprovação</h3>
           </div>
           
           {pendingRequests.length === 0 ? (
             <div className="nexus-card py-48 text-center border-dashed border-2 dark:border-slate-800 flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900/50 rounded-full flex items-center justify-center mb-8 border border-slate-100 dark:border-slate-800">
                  <svg className="w-10 h-10 text-slate-200 dark:text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                </div>
                <p className="text-slate-400 dark:text-slate-600 font-bold uppercase tracking-[0.4em] text-[10px] italic">Fila de aprovaçãoNexus zerada. Operação em dia.</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 gap-6">
               {pendingRequests.map(req => {
                 const emp = employees.find(e => e.id === req.employeeId);
                 return (
                   <div key={req.id} className="nexus-card p-6 md:p-10 flex flex-col lg:flex-row justify-between items-center gap-6 md:gap-10 hover:border-slate-900 dark:hover:border-blue-600 transition-all duration-700 group relative overflow-hidden text-center lg:text-left">
                      <div className="absolute top-0 right-0 w-40 h-40 bg-slate-50 dark:bg-slate-900/50 -mr-20 -mt-20 rotate-45 group-hover:bg-blue-600/5 transition-all"></div>
                      <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-8 flex-1 relative z-10 w-full lg:w-auto">
                         <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 dark:text-slate-600 text-xl md:text-2xl font-bold border border-slate-200 dark:border-slate-800 italic transition-all group-hover:bg-slate-900 dark:group-hover:bg-blue-600 group-hover:text-white group-hover:border-transparent shrink-0">
                            {emp?.name[0]}
                         </div>
                         <div>
                            <h4 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white uppercase italic tracking-tighter mb-1 md:mb-2 group-hover:text-blue-600 transition-colors">{emp?.name}</h4>
                            <p className="text-[9px] md:text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase italic tracking-[0.2em]">{emp?.department} &bull; {emp?.vacationBalance} dias</p>
                         </div>
                      </div>
                      
                      <div className="flex-1 lg:border-x lg:border-slate-800 px-4 md:px-10 text-center relative z-10 w-full lg:w-auto">
                         <p className="text-[9px] md:text-[10px] font-bold text-slate-300 dark:text-slate-700 uppercase tracking-[0.3em] mb-2 md:mb-4 italic">Período de Afastamento</p>
                         <p className="text-lg md:text-xl font-bold text-slate-900 dark:text-white italic tracking-tight">{new Date(req.startDate + 'T00:00:00').toLocaleDateString('pt-BR')} <span className="text-blue-600 mx-2 md:mx-4 tracking-normal">&rarr;</span> {new Date(req.endDate + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
                         <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mt-4 md:mt-6">
                            <span className="px-4 md:px-5 py-2 bg-blue-600 text-white text-[8px] md:text-[9px] font-bold uppercase tracking-widest italic shadow-xl">{req.days} NOITES NEXUS</span>
                            {req.sellTenDays && <span className="px-4 md:px-5 py-2 bg-emerald-500 text-white text-[8px] md:text-[9px] font-bold uppercase tracking-widest italic shadow-xl">ABONO EXECUTIVO</span>}
                         </div>
                      </div>

                      <div className="flex sm:flex-row gap-4 md:gap-6 relative z-10 w-full sm:w-auto justify-center">
                         {isAdmin ? (
                           <>
                             <button onClick={() => rejectVacation(req.id)} className="w-12 h-12 md:w-14 md:h-14 bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-300 hover:text-red-500 border border-slate-100 dark:border-slate-800 hover:border-red-500 transition-all group/btn shadow-sm shrink-0">
                                <svg className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover/btn:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                             </button>
                             <button onClick={() => approveVacation(req.id)} className="flex-1 sm:flex-none px-6 md:px-12 py-3 md:py-4 bg-slate-900 dark:bg-blue-600 text-white text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-blue-700 dark:hover:bg-blue-500 transition-all shadow-[0_15_40px_rgba(37,99,235,0.3)] italic">
                                Validar
                             </button>
                           </>
                         ) : (
                           <span className="w-full text-center px-12 py-4 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] italic shadow-sm">
                               Aguardando Validação
                            </span>
                         )}
                      </div>
                   </div>
                 );
               })}
             </div>
           )}
        </div>
      )}

      <CollectiveVacationModal 
        isOpen={isCollectiveModalOpen} 
        onClose={() => setIsCollectiveModalOpen(false)} 
        employees={employees}
        onSchedule={(ids, s, e) => { scheduleCollectiveVacation(ids, s, e); setIsCollectiveModalOpen(false); }}
      />

      <RequestVacationModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSubmit={handleRequestVacation}
        employeeBalance={authenticatedUser?.vacationBalance || 0}
      />
    </div>
  );
};

export default Vacation;
