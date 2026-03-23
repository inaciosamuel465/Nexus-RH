import React, { useState, useMemo } from 'react';
import { useHR } from '../context/HRContext';
import { Employee } from '../types';

const FormalizeModal: React.FC<{ isOpen: boolean; onClose: () => void; employee: Employee; employeesList: Employee[]; onSave: (id: string, data: any) => void }> = ({ isOpen, onClose, employee, employeesList, onSave }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-none w-full max-w-xl shadow-2xl overflow-hidden animate-slideIn">
        <div className="p-10 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Formalizar Admissão</h3>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">Dados Contratuais: {employee.name}</p>
          </div>
          <button onClick={onClose} className="p-2 transition-colors text-slate-400 hover:text-slate-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l18 18" /></svg>
          </button>
        </div>
        <form className="p-10 space-y-8" onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          onSave(employee.id, {
            salary: Number(fd.get('salary')),
            managerId: fd.get('managerId'),
            bank: {
              name: fd.get('bankName'),
              agency: fd.get('agency'),
              account: fd.get('account')
            },
            history: [...employee.history, {
              date: new Date().toISOString().split('T')[0],
              event: 'Formalização Concluída: Dados Contratuais Registrados',
              role: employee.role,
              salary: Number(fd.get('salary'))
            }]
          });
          onClose();
        }}>
          <div className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Salário Base (R$)</label>
              <input name="salary" required type="number" step="0.01" placeholder="0.00" className="w-full border-b border-slate-200 py-2 text-sm text-slate-900 font-bold outline-none focus:border-blue-600 transition-colors bg-transparent" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Gestor Direto</label>
              <select name="managerId" className="w-full border-b border-slate-200 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 transition-colors bg-transparent">
                <option value="">Nenhum / Direção Geral</option>
                {employeesList.filter(e => e.id !== employee.id).map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5 pt-4">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 italic border-b border-slate-50 pb-1">Gateway Bancário</label>
              <div className="space-y-6 pt-4">
                 <div className="space-y-1.5">
                    <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest ml-1">Instituição</label>
                    <input name="bankName" required placeholder="Ex: Banco Itaú" className="w-full border-b border-slate-200 py-1.5 text-xs text-slate-900 outline-none focus:border-blue-600 transition-colors bg-transparent" />
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                       <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest ml-1">Agência</label>
                       <input name="agency" required placeholder="0001" className="w-full border-b border-slate-200 py-1.5 text-xs text-slate-900 outline-none focus:border-blue-600 transition-colors bg-transparent" />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest ml-1">Conta Flow</label>
                       <input name="account" required placeholder="12345-6" className="w-full border-b border-slate-200 py-1.5 text-xs text-slate-900 outline-none focus:border-blue-600 transition-colors bg-transparent" />
                    </div>
                 </div>
              </div>
            </div>
          </div>
          <div className="pt-8 flex gap-4">
             <button type="button" onClick={onClose} className="flex-1 py-4 border border-slate-200 text-slate-400 text-[10px] font-bold uppercase tracking-widest hover:text-slate-900 transition-all">Cancelar</button>
             <button type="submit" className="flex-[2] py-4 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-[0.2rem] hover:bg-blue-600 transition-all shadow-xl">Ativar Registro</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const StepItem: React.FC<{ 
  label: string; 
  completed: boolean; 
  onClick?: () => void 
}> = ({ label, completed, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-5 border transition-all text-left relative overflow-hidden
      ${completed ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-900 hover:text-slate-900'}
    `}
  >
    <div className={`w-4 h-4 rounded-none flex items-center justify-center border transition-all
      ${completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200'}
    `}>
      {completed && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
    </div>
    <span className="text-[9px] font-bold uppercase tracking-widest italic">{label}</span>
  </button>
);

const Lifecycle: React.FC = () => {
  const { employees, addEmployee, updateEmployee } = useHR();
  const [formalizingEmp, setFormalizingEmp] = useState<Employee | null>(null);

  const pendingFormalization = useMemo(() => {
    return employees.filter(e => e.salary === 0 && !e.onboardingCompleted);
  }, [employees]);

  const onboardingList = useMemo(() => {
    return employees.filter(e => e.status !== 'Inativo' && !e.onboardingCompleted && e.onboardingTasks && e.salary > 0);
  }, [employees]);

  const offboardingList = useMemo(() => {
    return employees.filter(e => e.status === 'Inativo' && e.terminationDetails && !e.terminationDetails.completed);
  }, [employees]);

  const toggleOnboardingTask = (empId: string, taskId: string) => {
    const emp = employees.find(e => e.id === empId);
    if (!emp || !emp.onboardingTasks) return;
    const newTasks = emp.onboardingTasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
    updateEmployee(empId, { onboardingTasks: newTasks });
  };

  const finalizeOnboarding = (empId: string) => {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;
    updateEmployee(empId, { 
      onboardingCompleted: true,
      history: [...emp.history, { 
        date: new Date().toISOString().split('T')[0], 
        event: 'Onboarding Concluído: Ciclo de Integração Finalizado', 
        role: emp.role, 
        salary: emp.salary 
      }]
    });
  };

  const calculateProgress = (tasks?: { completed: boolean }[]) => {
    if (!tasks || tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-20">
      {/* Banner de Lifecycle Estilizado */}
      <div className="bg-slate-900 border border-slate-200 relative min-h-[220px] flex items-center px-10 overflow-hidden">
         <img 
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200" 
            className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale"
            alt="Lifecycle"
         />
         <div className="relative z-10 w-full flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="text-center lg:text-left">
               <h1 className="text-3xl font-bold text-white tracking-tight">Ciclagem de Capital Humano</h1>
               <p className="text-sm text-slate-400 mt-2 max-w-md font-medium italic">Monitoria do fluxo vital corporativo: Admissão, Acoplagem Neurossocial e Dissolução Contratual.</p>
            </div>
            
            <div className="flex gap-4">
               <div className="bg-white/5 border border-white/10 p-6 flex items-center gap-6">
                  <div className="text-center">
                     <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1">Aguardando</p>
                     <p className="text-2xl font-bold text-white tracking-tighter leading-none">{pendingFormalization.length}</p>
                  </div>
                  <div className="w-px h-8 bg-white/10"></div>
                  <div className="text-center">
                     <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1">Em Curso</p>
                     <p className="text-2xl font-bold text-white tracking-tighter leading-none">{onboardingList.length}</p>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <section className="space-y-8">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
            <div className="w-1.5 h-1.5 bg-blue-600"></div>
            <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest italic">Esteira de Onboarding</h3>
          </div>
          
          <div className="space-y-8">
            {pendingFormalization.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 p-8 space-y-6">
                 <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic border-b border-slate-100 pb-2">Pendência de Formalização</h4>
                 <div className="grid gap-4">
                    {pendingFormalization.map(emp => (
                      <div key={emp.id} className="bg-white p-6 border border-slate-200 flex justify-between items-center group hover:border-slate-900 transition-all">
                        <div>
                           <p className="text-sm font-bold text-slate-900 uppercase italic tracking-tight">{emp.name}</p>
                           <p className="text-[8px] font-bold text-blue-500 uppercase tracking-widest mt-1">{emp.role}</p>
                        </div>
                        <button 
                          onClick={() => setFormalizingEmp(emp)}
                          className="px-6 py-2 bg-slate-900 text-white text-[8px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-all"
                        >
                          Formalizar
                        </button>
                      </div>
                    ))}
                 </div>
              </div>
            )}

            {onboardingList.length === 0 && pendingFormalization.length === 0 ? (
              <div className="py-24 text-center border-2 border-dashed border-slate-100 bg-white italic">
                 <p className="text-slate-200 font-bold uppercase tracking-widest text-[9px]">Fluxo de Integração Limpo</p>
              </div>
            ) : (
              onboardingList.map(emp => {
                const progress = calculateProgress(emp.onboardingTasks);
                return (
                  <div key={emp.id} className="bg-white border border-slate-200 p-8 shadow-sm group hover:border-slate-900 transition-all flex flex-col">
                     <div className="flex justify-between items-start mb-10">
                        <div className="flex items-center gap-6">
                           <div className="w-16 h-16 bg-slate-900 text-white flex items-center justify-center text-xl font-bold italic">
                              {emp.name[0]}
                           </div>
                           <div>
                              <p className="text-lg font-bold text-slate-900 uppercase tracking-tighter italic leading-none mb-1">{emp.name}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{emp.role} &bull; Unidade Ativa</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className={`text-2xl font-bold tracking-tighter italic leading-none mb-1 ${progress === 100 ? 'text-emerald-600' : 'text-slate-900'}`}>{progress}%</p>
                           <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">Sincronia Pulse</p>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                        {emp.onboardingTasks?.map(task => 
                          <StepItem key={task.id} label={task.label} completed={task.completed} onClick={() => toggleOnboardingTask(emp.id, task.id)} />
                        )}
                     </div>

                     <div className="w-full h-1 bg-slate-50 mb-6 relative overflow-hidden">
                        <div className={`h-full transition-all duration-1000 ${progress === 100 ? 'bg-emerald-500' : 'bg-blue-600'}`} style={{ width: `${progress}%` }}></div>
                     </div>

                     {progress === 100 && (
                       <button onClick={() => finalizeOnboarding(emp.id)} className="w-full py-4 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-[0.4rem] hover:bg-emerald-600 transition-all shadow-xl animate-pulse">Consolidar Unidade</button>
                     )}
                  </div>
                );
              })
            )}
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
            <div className="w-1.5 h-1.5 bg-red-600"></div>
            <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest italic">Dissolução Contratual</h3>
          </div>
          
          <div className="space-y-6">
             {offboardingList.length === 0 ? (
               <div className="py-24 text-center border-2 border-dashed border-slate-100 bg-white italic opacity-50">
                  <p className="text-slate-200 font-bold uppercase tracking-widest text-[9px]">Sem Protocolos de Saída</p>
               </div>
             ) : (
               offboardingList.map(emp => (
                 <div key={emp.id} className="bg-red-50 border border-red-100 p-8 flex flex-col md:flex-row justify-between items-center gap-8 group hover:bg-white transition-all">
                    <div className="text-center md:text-left">
                       <h4 className="font-bold text-xl text-slate-900 italic tracking-tighter uppercase leading-none mb-2">{emp.name}</h4>
                       <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest italic">{emp.terminationDetails?.reason}</p>
                    </div>
                    <button className="px-8 py-3 bg-red-600 text-white text-[9px] font-bold uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-red-500/10">Processar Registro</button>
                 </div>
               ))
             )}
          </div>

          <div className="bg-slate-50 p-8 border border-slate-200">
             <h4 className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-100 pb-2">Status Legislativo eSocial</h4>
             <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <span className="text-[10px] font-bold text-slate-900 uppercase">S-2200 Recibo</span>
                   <span className="text-[10px] font-mono text-emerald-600 font-bold">READY</span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-[10px] font-bold text-slate-900 uppercase">S-2299 Dissolução</span>
                   <span className="text-[10px] font-mono text-blue-500 font-bold">QUEUE_EMPTY</span>
                </div>
                <p className="text-[9px] text-slate-400 leading-relaxed font-bold uppercase italic mt-4 pt-4 border-t border-slate-100">
                  Os eventos de admissão e desligamento são processados de forma assíncrona com o portal do governo federal.
                </p>
             </div>
          </div>
        </section>
      </div>

      {formalizingEmp && (
        <FormalizeModal 
          isOpen={!!formalizingEmp} 
          onClose={() => setFormalizingEmp(null)} 
          employee={formalizingEmp} 
          employeesList={employees} 
          onSave={updateEmployee} 
        />
      )}
    </div>
  );
};

export default Lifecycle;
