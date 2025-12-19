
import React, { useState, useMemo } from 'react';
import { useHR } from '../context/HRContext';
import { Training, TrainingCategory, Employee, ContractType, EmployeeTraining, TrainingRequest } from '../types';

const AssignTrainingModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  onAssign: (trainingId: string, target: any) => void; 
  trainings: Training[]; 
  employees: Employee[]; 
}> = ({ isOpen, onClose, onAssign, trainings, employees }) => {
  const [selectedTrainingId, setSelectedTrainingId] = useState('');
  const [targetType, setTargetType] = useState<'individual' | 'department' | 'contract'>('department');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const departments = useMemo(() => ['Todos', ...Array.from(new Set(employees.map(e => e.department)))], [employees]);
  const contractTypes: ContractType[] = ['CLT', 'PJ', 'Estagiário', 'Temporário'];

  if (!isOpen) return null;

  const handleAssign = () => {
    const target: any = {};
    if (targetType === 'individual') target.employeeIds = selectedIds;
    if (targetType === 'department') target.departments = selectedIds;
    if (targetType === 'contract') target.contractTypes = selectedIds;
    
    onAssign(selectedTrainingId, target);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl overflow-hidden animate-slideIn">
        <div className="p-10 border-b border-gray-100 bg-indigo-50/50 flex justify-between items-center text-indigo-900">
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tighter italic">Atribuir Treinamento Interno</h3>
            <p className="text-xs font-bold text-indigo-400 mt-1 uppercase">Matriz de Competências RH</p>
          </div>
          <button onClick={onClose} className="p-2 text-indigo-300 hover:bg-indigo-100 rounded-full transition-colors"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l18 18" /></svg></button>
        </div>

        <div className="p-10 space-y-8">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">1. Selecione o Treinamento</label>
              <select value={selectedTrainingId} onChange={e => setSelectedTrainingId(e.target.value)} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-indigo-500">
                 <option value="">Escolha um curso da biblioteca...</option>
                 {trainings.map(t => <option key={t.id} value={t.id}>{t.name} ({t.category})</option>)}
              </select>
           </div>

           <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">2. Direcionar para:</label>
              <div className="flex bg-gray-100 p-1.5 rounded-2xl">
                 {(['department', 'contract', 'individual'] as const).map(type => (
                   <button 
                    key={type} 
                    onClick={() => { setTargetType(type); setSelectedIds([]); }}
                    className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${targetType === type ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}
                   >
                      {type === 'department' ? 'Setor' : type === 'contract' ? 'Vínculo' : 'Colaborador'}
                   </button>
                 ))}
              </div>

              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                 {targetType === 'department' && departments.map(d => (
                   <label key={d} className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${selectedIds.includes(d) ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-gray-50 border-gray-100 text-gray-600 hover:bg-white hover:border-gray-200'}`}>
                      <input type="checkbox" className="hidden" checked={selectedIds.includes(d)} onChange={() => setSelectedIds(prev => prev.includes(d) ? prev.filter(i => i !== d) : [...prev, d])} />
                      <span className="text-[10px] font-black uppercase tracking-tight">{d}</span>
                   </label>
                 ))}
                 {targetType === 'contract' && contractTypes.map(c => (
                   <label key={c} className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${selectedIds.includes(c) ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-gray-50 border-gray-100 text-gray-600 hover:bg-white hover:border-gray-200'}`}>
                      <input type="checkbox" className="hidden" checked={selectedIds.includes(c)} onChange={() => setSelectedIds(prev => prev.includes(c) ? prev.filter(i => i !== c) : [...prev, c])} />
                      <span className="text-[10px] font-black uppercase tracking-tight">{c}</span>
                   </label>
                 ))}
                 {targetType === 'individual' && employees.map(e => (
                   <label key={e.id} className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${selectedIds.includes(e.id) ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-gray-50 border-gray-100 text-gray-600 hover:bg-white hover:border-gray-200'}`}>
                      <input type="checkbox" className="hidden" checked={selectedIds.includes(e.id)} onChange={() => setSelectedIds(prev => prev.includes(e.id) ? prev.filter(i => i !== e.id) : [...prev, e.id])} />
                      <span className="text-[10px] font-black uppercase tracking-tight truncate">{e.name}</span>
                   </label>
                 ))}
              </div>
           </div>

           <button 
            disabled={!selectedTrainingId || selectedIds.length === 0}
            onClick={handleAssign}
            className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
           >
              Confirmar Atribuição
           </button>
        </div>
      </div>
    </div>
  );
};

const Training: React.FC = () => {
  const { 
    trainings, employeeTrainings, trainingRequests, employees, currentUser, 
    assignTraining, updateTrainingProgress, requestTraining, handleTrainingRequest 
  } = useHR();
  
  const [activeTab, setActiveTab] = useState<'learning' | 'manager' | 'admin'>('learning');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // Filtros de visualização
  const myLearning = useMemo(() => {
    return employeeTrainings.filter(et => et.employeeId === currentUser.id);
  }, [employeeTrainings, currentUser.id]);

  const stats = useMemo(() => {
    const totalPending = employeeTrainings.filter(et => et.status !== 'Concluído').length;
    const onboardingPending = employees.filter(e => !e.onboardingCompleted).length;
    return { totalPending, onboardingPending, catalogCount: trainings.length };
  }, [employeeTrainings, employees, trainings]);

  // Gestão de Equipe (Para Gestores)
  const teamMembers = employees.filter(e => e.managerId === currentUser.id);
  const teamTrainingData = useMemo(() => {
    return teamMembers.map(m => ({
      member: m,
      trainings: employeeTrainings.filter(et => et.employeeId === m.id)
    }));
  }, [teamMembers, employeeTrainings]);

  return (
    <div className="space-y-10 animate-fadeIn pb-24">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl flex items-center justify-center text-white shadow-xl">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </div>
          <div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter italic uppercase leading-none">Educação Corporativa</h2>
            <p className="text-gray-500 font-medium mt-2">Gerenciamento de trilhas internas e conformidade técnica.</p>
          </div>
        </div>
        <div className="flex bg-gray-100 p-1.5 rounded-2xl">
          <button onClick={() => setActiveTab('learning')} className={`px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'learning' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}>Meus Cursos</button>
          {teamMembers.length > 0 && (
            <button onClick={() => setActiveTab('manager')} className={`px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'manager' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}>Gestão de Equipe</button>
          )}
          <button onClick={() => setActiveTab('admin')} className={`px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'admin' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}>Controle RH</button>
        </div>
      </header>

      {activeTab === 'learning' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <section className="lg:col-span-2 space-y-8">
             <div className="flex items-center justify-between px-4">
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Minha Trilha Atribuída</h3>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{myLearning.filter(l => l.status !== 'Concluído').length} Pendentes</span>
             </div>
             
             <div className="space-y-6">
                {myLearning.length === 0 ? (
                  <div className="p-32 text-center bg-white rounded-[4rem] border-2 border-dashed border-gray-100 flex flex-col items-center gap-6">
                     <p className="text-gray-400 font-bold italic">Nenhum treinamento atribuído no momento.</p>
                  </div>
                ) : (
                  myLearning.map(et => {
                    const t = trainings.find(x => x.id === et.trainingId);
                    return (
                      <div key={et.id} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 group hover:shadow-2xl transition-all">
                         <div className="flex items-center gap-6 flex-1">
                            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-2xl font-black ${t?.isMandatory ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'}`}>
                               {t?.name[0]}
                            </div>
                            <div>
                               <div className="flex items-center gap-3 mb-1">
                                  <h4 className="text-lg font-black text-gray-900 leading-none">{t?.name}</h4>
                                  {t?.isMandatory && <span className="px-2 py-0.5 bg-red-600 text-white rounded text-[8px] font-black uppercase">Obrigatório</span>}
                               </div>
                               <p className="text-[10px] font-bold text-gray-400 uppercase">{t?.category} &bull; Facilitador: {t?.instructor}</p>
                            </div>
                         </div>
                         <div className="w-full md:w-48 space-y-2">
                            <div className="flex justify-between text-[10px] font-black uppercase">
                               <span className="text-indigo-600">{et.status}</span>
                               <span className="text-gray-400">{et.progress}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                               <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${et.progress}%` }}></div>
                            </div>
                         </div>
                         {et.status !== 'Concluído' ? (
                           <button onClick={() => updateTrainingProgress(et.id, 100)} className="px-8 py-3 bg-gray-950 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all">Iniciar Atividade</button>
                         ) : (
                           <span className="px-8 py-3 bg-green-50 text-green-600 rounded-2xl text-[9px] font-black uppercase flex items-center gap-2 font-black"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg> Concluído</span>
                         )}
                      </div>
                    )
                  })
                )}
             </div>
          </section>

          <aside className="space-y-10">
             <div className="bg-indigo-900 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-1000">
                   <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                </div>
                <h4 className="text-[11px] font-black uppercase tracking-widest text-indigo-400 mb-8 border-b border-white/10 pb-4">Status de Qualificação</h4>
                <div className="space-y-8">
                   <div>
                      <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-1">Carga Horária Concluída</p>
                      <p className="text-4xl font-black">12.5 <span className="text-lg opacity-40">horas</span></p>
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-1">Status de Onboarding</p>
                      <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-lg text-[9px] font-black uppercase border border-green-500/20">Finalizado</span>
                   </div>
                </div>
             </div>
          </aside>
        </div>
      )}

      {activeTab === 'manager' && (
        <div className="space-y-10 animate-fadeIn">
           <div className="flex justify-between items-center px-4">
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter flex items-center gap-3">
                 <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
                 Gestão de Aprendizado da Equipe
              </h3>
              <button 
                onClick={() => {
                  const reason = prompt("Justificativa da necessidade:");
                  if(reason) requestTraining({ employeeId: teamMembers[0].id, reason, status: 'Pendente' });
                }}
                className="px-8 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
              >
                 Solicitar Treinamento Extra
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {teamTrainingData.map(({ member, trainings: mTrainings }) => (
                <div key={member.id} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                   <div className="flex items-center gap-4 mb-8">
                      <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center font-black text-gray-600 text-lg shadow-inner">{member.name[0]}</div>
                      <div>
                         <p className="text-base font-black text-gray-900 leading-none mb-1">{member.name}</p>
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{member.role}</p>
                      </div>
                   </div>
                   
                   <div className="space-y-4">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest border-b border-gray-50 pb-2">
                         <span className="text-gray-400">Progresso Geral</span>
                         <span className="text-indigo-600">{Math.round((mTrainings.filter(t => t.status === 'Concluído').length / (mTrainings.length || 1)) * 100)}%</span>
                      </div>
                      <div className="space-y-3">
                         {mTrainings.slice(0, 3).map(et => {
                            const t = trainings.find(x => x.id === et.trainingId);
                            return (
                               <div key={et.id} className="flex justify-between items-center text-[10px] font-bold text-gray-600">
                                  <span className="truncate flex-1 pr-4">{t?.name}</span>
                                  <span className={`px-2 py-0.5 rounded ${et.status === 'Concluído' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{et.status}</span>
                               </div>
                            )
                         })}
                         {mTrainings.length > 3 && <p className="text-[9px] font-black text-indigo-400 uppercase mt-2">+ {mTrainings.length - 3} outros registros</p>}
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'admin' && (
        <div className="space-y-10 animate-fadeIn">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm text-center">
                 <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Total no Catálogo</p>
                 <p className="text-3xl font-black text-gray-900">{stats.catalogCount}</p>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm text-center">
                 <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Adesão Média</p>
                 <p className="text-3xl font-black text-emerald-600">82%</p>
              </div>
              <div className="bg-red-50 p-8 rounded-[2.5rem] border border-red-100 text-center">
                 <p className="text-[10px] font-black text-red-700 uppercase mb-2">Pendente Integração</p>
                 <p className="text-3xl font-black text-red-900">{stats.onboardingPending}</p>
              </div>
              <div className="bg-gray-950 p-8 rounded-[2.5rem] text-center text-white">
                 <p className="text-[10px] font-black text-indigo-400 uppercase mb-2">Pedidos de Líderes</p>
                 <p className="text-3xl font-black">{trainingRequests.filter(r => r.status === 'Pendente').length}</p>
              </div>
           </div>

           <div className="bg-white rounded-[4rem] shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/20">
                 <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Biblioteca e Governança de Treinamento</h3>
                 <div className="flex gap-3">
                    <button onClick={() => setIsAssignModalOpen(true)} className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100">Atribuição em Massa</button>
                    <button className="px-6 py-3 bg-gray-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg">+ Novo Curso Interno</button>
                 </div>
              </div>
              
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest font-black">
                          <th className="px-8 py-6">Programa Interno</th>
                          <th className="px-8 py-6">Tipo</th>
                          <th className="px-8 py-6">Facilitador</th>
                          <th className="px-8 py-6">Status Conclusão</th>
                          <th className="px-8 py-6 text-right">Ações</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                       {trainings.map(t => {
                          const completions = employeeTrainings.filter(et => et.trainingId === t.id && et.status === 'Concluído').length;
                          const total = employeeTrainings.filter(et => et.trainingId === t.id).length;
                          const perc = total > 0 ? Math.round((completions / total) * 100) : 0;
                          return (
                            <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                               <td className="px-8 py-6">
                                  <p className="text-sm font-black text-gray-900">{t.name}</p>
                                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{t.durationHours}h de carga horária</p>
                               </td>
                               <td className="px-8 py-6">
                                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${t.isMandatory ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>{t.category}</span>
                               </td>
                               <td className="px-8 py-6 text-sm font-bold text-gray-600">{t.instructor}</td>
                               <td className="px-8 py-6">
                                  <div className="flex items-center gap-3">
                                     <div className="flex-1 h-1.5 w-24 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-600" style={{ width: `${perc}%` }}></div>
                                     </div>
                                     <span className="text-[10px] font-black text-indigo-600">{perc}%</span>
                                  </div>
                               </td>
                               <td className="px-8 py-6 text-right">
                                  <button className="p-2 text-gray-400 hover:text-indigo-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg></button>
                               </td>
                            </tr>
                          );
                       })}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      )}

      <AssignTrainingModal 
        isOpen={isAssignModalOpen} 
        onClose={() => setIsAssignModalOpen(false)} 
        onAssign={assignTraining}
        trainings={trainings}
        employees={employees}
      />
    </div>
  );
};

export default Training;
