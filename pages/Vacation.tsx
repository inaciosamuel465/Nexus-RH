
import React, { useState, useMemo, useEffect } from 'react';
import { useHR } from '../context/HRContext';
import { VacationRequest, Employee } from '../types';

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
    // Ao mudar de depto, limpa seleção ou marca todos do depto? Melhor limpar para segurança.
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-slideIn flex flex-col max-h-[90vh]">
        <div className="p-10 border-b border-gray-100 bg-indigo-600 text-white flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tighter italic">Férias Coletivas CLT</h3>
            <p className="text-xs font-bold text-indigo-100 mt-1 uppercase opacity-80">Seleção Dinâmica de Equipe</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l18 18" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
          <div className="grid grid-cols-2 gap-6">
             <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Data de Início</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-indigo-500" />
             </div>
             <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Data de Término</label>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-indigo-500" />
             </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
               <div className="space-y-1 flex-1 pr-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Filtrar Setor</label>
                  <select value={selectedDept} onChange={e => setSelectedDept(e.target.value)} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-indigo-500">
                    {depts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
               </div>
               <button type="button" onClick={selectAllFiltered} className="px-6 py-4 bg-indigo-50 text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100">Marcar Todos</button>
            </div>

            <div className="bg-gray-50 rounded-3xl border border-gray-200 overflow-hidden">
               <div className="max-h-60 overflow-y-auto p-2 space-y-1">
                  {filteredEmployees.map(emp => (
                    <label key={emp.id} className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all ${selectedEmployees.includes(emp.id) ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-white'}`}>
                       <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${selectedEmployees.includes(emp.id) ? 'bg-white/20' : 'bg-indigo-100 text-indigo-600'}`}>
                             {emp.name[0]}
                          </div>
                          <div>
                             <p className="text-xs font-bold leading-none mb-1">{emp.name}</p>
                             <p className={`text-[8px] font-black uppercase ${selectedEmployees.includes(emp.id) ? 'text-indigo-200' : 'text-gray-400'}`}>{emp.role}</p>
                          </div>
                       </div>
                       <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={selectedEmployees.includes(emp.id)}
                        onChange={() => toggleEmployee(emp.id)} 
                       />
                       <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedEmployees.includes(emp.id) ? 'bg-white border-white' : 'border-gray-300'}`}>
                          {selectedEmployees.includes(emp.id) && <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>}
                       </div>
                    </label>
                  ))}
               </div>
            </div>
          </div>

          <div className="p-6 bg-amber-50 rounded-[2rem] border border-amber-100 flex gap-4">
             <div className="w-10 h-10 bg-amber-200 rounded-xl flex items-center justify-center text-amber-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </div>
             <p className="text-[10px] text-amber-800 font-bold leading-relaxed">
                As férias coletivas não podem ser inferiores a 10 dias e podem ser gozadas em até 2 períodos anuais (Art. 139 CLT).
             </p>
          </div>
        </div>

        <div className="p-10 border-t border-gray-100 bg-gray-50 flex gap-4">
           <button onClick={onClose} className="flex-1 py-5 border border-gray-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-white">Cancelar</button>
           <button 
            disabled={selectedEmployees.length === 0 || !startDate || !endDate}
            onClick={() => onSchedule(selectedEmployees, startDate, endDate)}
            className="flex-[2] py-5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
           >
              Agendar para {selectedEmployees.length} Colaboradores
           </button>
        </div>
      </div>
    </div>
  );
};

const Vacation: React.FC = () => {
  const { employees, vacationRequests, approveVacation, rejectVacation, scheduleCollectiveVacation } = useHR();
  const [activeTab, setActiveTab] = useState<'calendar' | 'pending'>('calendar');
  const [isCollectiveModalOpen, setIsCollectiveModalOpen] = useState(false);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('Todos');

  const departments = useMemo(() => ['Todos', ...Array.from(new Set(employees.map(e => e.department)))], [employees]);
  const pendingRequests = useMemo(() => vacationRequests.filter(r => r.status === 'Pendente'), [vacationRequests]);
  
  const filteredEmployeesForGrid = useMemo(() => {
    return selectedDeptFilter === 'Todos' ? employees : employees.filter(e => e.department === selectedDeptFilter);
  }, [employees, selectedDeptFilter]);

  return (
    <div className="space-y-10 animate-fadeIn pb-24">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-3xl flex items-center justify-center text-white shadow-xl">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter italic leading-none uppercase">Central de Descanso</h2>
            <p className="text-gray-500 font-medium mt-2">Planejamento e conformidade de ausências.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setIsCollectiveModalOpen(true)} className="px-10 py-5 bg-gray-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-black transition-all">
             Agendar Coletivas
          </button>
          <div className="bg-gray-100 p-1.5 rounded-2xl flex">
            <button onClick={() => setActiveTab('calendar')} className={`px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'calendar' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}>Calendário</button>
            <button onClick={() => setActiveTab('pending')} className={`px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'pending' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}>
              Solicitações
              {pendingRequests.length > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[9px] flex items-center justify-center rounded-full border-2 border-white">{pendingRequests.length}</span>}
            </button>
          </div>
        </div>
      </header>

      {activeTab === 'calendar' ? (
        <div className="space-y-8">
           <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-10">
                 <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter flex items-center gap-3">
                   <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
                   Linha do Tempo de Disponibilidade
                 </h3>
                 <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-gray-400 uppercase">Setor:</span>
                    <select value={selectedDeptFilter} onChange={e => setSelectedDeptFilter(e.target.value)} className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-xs outline-none">
                       {departments.map(d => <option key={d}>{d}</option>)}
                    </select>
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="flex border-b border-gray-100 pb-2 mb-2">
                    <div className="w-48 text-[9px] font-black text-gray-400 uppercase">Colaborador</div>
                    <div className="flex-1 grid grid-cols-4 gap-2 text-[9px] font-black text-gray-400 uppercase text-center">
                       <span>Nov 24</span>
                       <span>Dez 24</span>
                       <span>Jan 25</span>
                       <span>Fev 25</span>
                    </div>
                 </div>
                 
                 {filteredEmployeesForGrid.map(emp => {
                   const myRequests = vacationRequests.filter(r => r.employeeId === emp.id && r.status === 'Aprovado');
                   return (
                     <div key={emp.id} className="flex items-center group">
                        <div className="w-48 pr-4">
                           <p className="text-xs font-black text-gray-900 truncate">{emp.name}</p>
                           <p className="text-[8px] font-bold text-gray-400 uppercase">{emp.department}</p>
                        </div>
                        <div className="flex-1 h-12 bg-gray-50 rounded-2xl relative overflow-hidden flex items-center px-4">
                           {/* Renderização Mock de Timeline baseada nos dados */}
                           {myRequests.map(r => (
                             <div 
                              key={r.id} 
                              className={`h-8 rounded-xl absolute flex items-center justify-center px-4 border shadow-sm ${r.type === 'Coletiva' ? 'bg-indigo-100 border-indigo-200 text-indigo-700' : 'bg-blue-100 border-blue-200 text-blue-700'}`}
                              style={{ left: r.startDate.includes('2024-11') ? '5%' : r.startDate.includes('2024-12') ? '30%' : '55%', width: '25%' }}
                             >
                                <span className="text-[8px] font-black uppercase truncate">{r.type === 'Coletiva' ? 'Coletivas' : 'Férias'}</span>
                             </div>
                           ))}
                           {/* Grid Lines */}
                           <div className="absolute inset-0 flex justify-between pointer-events-none opacity-5">
                              {[1,2,3].map(i => <div key={i} className="w-px h-full bg-black"></div>)}
                           </div>
                        </div>
                        <div className="w-20 text-right pl-4">
                           <span className={`text-[10px] font-black ${emp.vacationBalance < 10 ? 'text-red-500' : 'text-indigo-600'}`}>{emp.vacationBalance}d</span>
                        </div>
                     </div>
                   );
                 })}
              </div>
           </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-6">
           <div className="flex justify-between items-center px-4">
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Fila de Aprovação</h3>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{pendingRequests.length} pedidos pendentes</span>
           </div>
           
           {pendingRequests.length === 0 ? (
             <div className="p-32 text-center bg-white rounded-[4rem] border-2 border-dashed border-gray-100 flex flex-col items-center gap-6">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                   <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                </div>
                <p className="text-gray-400 font-bold italic">Sem novas solicitações para analisar.</p>
             </div>
           ) : (
             pendingRequests.map(req => {
               const emp = employees.find(e => e.id === req.employeeId);
               return (
                 <div key={req.id} className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8 hover:shadow-2xl transition-all animate-fadeIn">
                    <div className="flex items-center gap-6 flex-1">
                       <div className="w-20 h-20 rounded-[2rem] bg-indigo-50 flex items-center justify-center text-indigo-600 text-2xl font-black shadow-inner">
                          {emp?.name[0]}
                       </div>
                       <div>
                          <h4 className="text-xl font-black text-gray-900 leading-none mb-2">{emp?.name}</h4>
                          <div className="flex items-center gap-3">
                             <span className="px-3 py-1 bg-gray-100 rounded-lg text-[9px] font-black text-gray-500 uppercase">{emp?.department}</span>
                             <span className="text-[10px] font-bold text-indigo-400">Saldo: {emp?.vacationBalance} dias</span>
                          </div>
                       </div>
                    </div>
                    
                    <div className="flex-1 border-x border-gray-50 px-8 py-2 text-center">
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Período Solicitado</p>
                       <p className="text-base font-black text-gray-900">{new Date(req.startDate + 'T00:00:00').toLocaleDateString('pt-BR')} a {new Date(req.endDate + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
                       <p className="text-[11px] font-black text-indigo-600 uppercase mt-1 italic">{req.days} dias de descanso</p>
                       {req.sellTenDays && <span className="mt-2 inline-block px-3 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-full text-[8px] font-black uppercase">Venda de 10 dias</span>}
                    </div>

                    <div className="flex gap-3">
                       <button onClick={() => rejectVacation(req.id)} className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                       </button>
                       <button onClick={() => approveVacation(req.id)} className="w-14 h-14 bg-green-500 text-white rounded-2xl flex items-center justify-center hover:bg-green-600 transition-all shadow-xl shadow-green-100">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                       </button>
                    </div>
                 </div>
               );
             })
           )}
        </div>
      )}

      <CollectiveVacationModal 
        isOpen={isCollectiveModalOpen} 
        onClose={() => setIsCollectiveModalOpen(false)} 
        employees={employees}
        onSchedule={(ids, s, e) => { scheduleCollectiveVacation(ids, s, e); setIsCollectiveModalOpen(false); alert('Férias coletivas agendadas com sucesso!'); }}
      />
    </div>
  );
};

export default Vacation;
