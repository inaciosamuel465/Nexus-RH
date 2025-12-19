
import React, { useState, useMemo } from 'react';
import { useHR } from '../context/HRContext';
import { Employee } from '../types';

// Removed non-existent import DEFAULT_OFFBOARDING_STEPS as it was not used and causing errors

const FormalizeModal: React.FC<{ isOpen: boolean; onClose: () => void; employee: Employee; employeesList: Employee[]; onSave: (id: string, data: any) => void }> = ({ isOpen, onClose, employee, employeesList, onSave }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl overflow-hidden animate-slideIn">
        <div className="p-10 border-b border-gray-100 bg-indigo-50/50 text-indigo-900">
          <h3 className="text-2xl font-black uppercase tracking-tighter italic">Formalizar Admissão</h3>
          <p className="text-xs font-bold text-indigo-400 mt-1 uppercase">Defina os detalhes finais para {employee.name}</p>
        </div>
        <form className="p-10 space-y-6" onSubmit={(e) => {
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Salário Final Acordado</label>
              <input name="salary" required type="number" placeholder="Ex: 8500.00" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold" />
            </div>
            <div className="space-y-1 col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Gestor Imediato</label>
              <select name="managerId" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold">
                <option value="">Nenhum / Diretor</option>
                {employeesList.filter(e => e.id !== employee.id).map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </div>
            <div className="space-y-1 col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Banco</label>
              <input name="bankName" required placeholder="Ex: Itaú Unibanco" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Agência</label>
              <input name="agency" required placeholder="0001" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Conta</label>
              <input name="account" required placeholder="12345-6" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold" />
            </div>
          </div>
          <div className="pt-6 flex gap-4">
             <button type="button" onClick={onClose} className="flex-1 py-5 border border-gray-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500">Cancelar</button>
             <button type="submit" className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Ativar Onboarding</button>
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
    className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition-all text-left group
      ${completed ? 'bg-green-50 border-green-100 text-green-700' : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-blue-200 hover:bg-white hover:text-gray-600'}
    `}
  >
    <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-colors
      ${completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 group-hover:border-blue-400'}
    `}>
      {completed && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
    </div>
    <span className="text-[11px] font-black uppercase tracking-tight">{label}</span>
  </button>
);

const Lifecycle: React.FC = () => {
  const { employees, addEmployee, updateEmployee } = useHR();
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false);
  const [isOffboardingOpen, setIsOffboardingOpen] = useState(false);
  const [selectedTermId, setSelectedTermId] = useState('');
  const [termReason, setTermReason] = useState('Pedido de Demissão');
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
    <div className="space-y-10 animate-fadeIn pb-24">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </div>
          <div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter">Nexus Lifecycle</h2>
            <p className="text-gray-500 font-medium">Entrada estratégica e saída humanizada de talentos.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setIsAdmissionOpen(true)} className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-blue-700 transition-all">+ Admissão Manual</button>
          <button onClick={() => setIsOffboardingOpen(true)} className="px-10 py-5 bg-red-50 text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-red-100 hover:bg-red-100 transition-all">- Iniciar Offboarding</button>
        </div>
      </header>

      {/* NOVO: Fila de Formalização */}
      {pendingFormalization.length > 0 && (
        <section className="bg-indigo-900 p-10 rounded-[3rem] shadow-2xl shadow-indigo-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
             <svg className="w-32 h-32" fill="white" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>
          </div>
          <div className="flex items-center gap-3 mb-8">
            <span className="w-3 h-8 bg-indigo-400 rounded-full"></span>
            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Aguardando Formalização ({pendingFormalization.length})</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingFormalization.map(emp => (
              <div key={emp.id} className="bg-white/10 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/20 flex flex-col justify-between">
                <div>
                   <h4 className="text-lg font-black text-white">{emp.name}</h4>
                   <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">{emp.role} • {emp.department}</p>
                   <p className="mt-4 text-[10px] text-indigo-200 italic">Vindo do Pipeline de Recrutamento Nexus AI</p>
                </div>
                <button 
                  onClick={() => setFormalizingEmp(emp)}
                  className="mt-6 w-full py-4 bg-white text-indigo-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-all"
                >
                  Formalizar Contrato
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        <section className="space-y-8">
          <div className="flex items-center gap-3 px-4">
            <span className="w-3 h-8 bg-blue-600 rounded-full"></span>
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Esteira de Onboarding</h3>
          </div>
          <div className="grid gap-8">
            {onboardingList.length === 0 ? (
              <div className="p-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                <p className="text-gray-400 font-bold italic">Nenhum processo de integração ativo.</p>
              </div>
            ) : (
              onboardingList.map(emp => {
                const progress = calculateProgress(emp.onboardingTasks);
                return (
                  <div key={emp.id} className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 hover:shadow-2xl transition-all">
                    <div className="flex justify-between items-start mb-8">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xl">{emp.name[0]}</div>
                        <div>
                          <p className="text-lg font-black text-gray-900">{emp.name}</p>
                          <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{emp.role} • Salário R$ {emp.salary.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-[11px] font-black uppercase mb-2 ${progress === 100 ? 'text-green-600' : 'text-blue-600'}`}>{progress}% Concluído</p>
                        <div className="w-32 h-2.5 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full transition-all duration-700 ${progress === 100 ? 'bg-green-500' : 'bg-blue-600'}`} style={{ width: `${progress}%` }}></div></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      {emp.onboardingTasks?.map(task => <StepItem key={task.id} label={task.label} completed={task.completed} onClick={() => toggleOnboardingTask(emp.id, task.id)} />)}
                    </div>
                    {progress === 100 && (
                      <button onClick={() => finalizeOnboarding(emp.id)} className="w-full py-5 bg-green-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl hover:bg-green-700 transition-all">Finalizar Onboarding</button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex items-center gap-3 px-4">
            <span className="w-3 h-8 bg-red-500 rounded-full"></span>
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Fluxo de Desligamento</h3>
          </div>
          <div className="grid gap-8">
             {offboardingList.length === 0 ? (
               <div className="p-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                 <p className="text-gray-400 font-bold italic">Sem desligamentos pendentes.</p>
               </div>
             ) : (
               offboardingList.map(emp => (
                 <div key={emp.id} className="bg-white p-10 rounded-[3rem] border border-red-100 shadow-sm">
                   <h4 className="font-black text-lg text-gray-900">{emp.name}</h4>
                   <p className="text-xs font-bold text-red-500 uppercase tracking-widest">{emp.terminationDetails?.reason}</p>
                 </div>
               ))
             )}
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
