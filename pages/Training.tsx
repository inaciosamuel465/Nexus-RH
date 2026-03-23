import React, { useState, useMemo } from 'react';
import { useHR } from '../context/HRContext';
import type { Training as TrainingType, Employee } from '../types';

const AssignTrainingModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  onAssign: (trainingId: string, target: any) => void; 
  trainings: TrainingType[]; 
  employees: Employee[]; 
}> = ({ isOpen, onClose, onAssign, trainings, employees }) => {
  const [selectedTrainingId, setSelectedTrainingId] = useState('');
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-none w-full max-w-xl shadow-2xl overflow-hidden animate-slideIn">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Atribuir Capacitação</h3>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">Nexus Learning Matrix</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l18 18" /></svg>
          </button>
        </div>
        <div className="p-8 space-y-8">
           <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Módulo de Conhecimento</label>
              <select 
                value={selectedTrainingId} 
                onChange={e => setSelectedTrainingId(e.target.value)} 
                className="w-full border-b border-slate-200 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 transition-colors bg-transparent font-medium"
              >
                 <option value="">Selecione na biblioteca...</option>
                 {trainings.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
           </div>
           
           <div className="p-6 bg-blue-50 border border-blue-100 text-blue-800 italic">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1">Atenção</p>
              <p className="text-[11px] font-medium leading-relaxed">A atribuição deste módulo liberará acesso imediato no terminal do colaborador e registrará a vigência no histórico de competências.</p>
           </div>

           <button 
            disabled={!selectedTrainingId}
            onClick={() => { onAssign(selectedTrainingId, {}); onClose(); }}
            className="w-full py-4 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-slate-900/10 hover:bg-blue-600 transition-all disabled:opacity-50"
           >
              Liberar Fluxo de Acesso
           </button>
        </div>
      </div>
    </div>
  );
};

const Training: React.FC = () => {
  const { 
    trainings, employeeTrainings, employees, currentUser, 
    updateTrainingProgress, assignTraining 
  } = useHR();
  
  const [activeTab, setActiveTab] = useState<'learning' | 'manager' | 'admin'>('learning');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const myLearning = useMemo(() => {
    return employeeTrainings.filter(et => et.employeeId === currentUser.id);
  }, [employeeTrainings, currentUser.id]);

  const teamMembers = employees.filter(e => e.managerId === currentUser.id);

  const stats = useMemo(() => {
    const totalHours = myLearning.reduce((acc, curr) => {
      const t = trainings.find(x => x.id === curr.trainingId);
      return acc + (curr.status === 'Concluído' ? (t?.durationHours || 0) : 0);
    }, 0);
    return { totalHours, pending: myLearning.filter(l => l.status !== 'Concluído').length };
  }, [myLearning, trainings]);

  const handleSmartAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-20">
      {/* Banner de Desenvolvimento Estilizado */}
      <div className="bg-slate-900 border border-slate-200 relative min-h-[220px] flex items-center px-10 overflow-hidden">
         <img 
            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1200" 
            className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale"
            alt="Learning"
         />
         <div className="relative z-10 w-full flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="text-center lg:text-left">
               <h1 className="text-3xl font-bold text-white tracking-tight">Desenvolvimento & Skills</h1>
               <p className="text-sm text-slate-400 mt-2 max-w-md font-medium">Plataforma integrada de aceleração de competências e gestão de capitais intelectuais.</p>
            </div>
            
            <div className="flex bg-white/5 backdrop-blur-md p-1 border border-white/10">
              {[
                { id: 'learning', label: 'Minha Jornada' },
                { id: 'manager', label: 'Gestão de Time' },
                { id: 'admin', label: 'Biblioteca' }
              ].map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)} 
                  className={`px-6 py-2 text-[9px] font-bold uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3 space-y-8">
          {/* Smart Insights Optimization */}
          <div className="bg-white border border-slate-200 p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-50 -mr-10 -mt-10"></div>
             <div className="flex items-center gap-6 relative z-10">
                <div className="w-12 h-12 bg-slate-900 flex items-center justify-center text-blue-500 shadow-xl">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <div>
                   <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest italic">Nexus Skills Optimizer</h3>
                   <p className="text-[11px] text-slate-500 font-medium">Análise de IA para identificação de gaps técnico-comportamentais em tempo real.</p>
                </div>
             </div>
             <button 
               onClick={handleSmartAnalyze}
               disabled={isAnalyzing}
               className="relative z-10 px-8 py-3 bg-blue-600 text-white text-[9px] font-bold uppercase tracking-widest hover:bg-slate-900 transition-all disabled:opacity-50 shadow-lg shadow-blue-500/10"
             >
               {isAnalyzing ? 'Processando Matriz...' : 'Scan de Gaps'}
             </button>
          </div>

          <div className="min-h-[400px]">
            {activeTab === 'learning' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                {myLearning.length > 0 ? (
                  myLearning.map((et) => {
                    const t = trainings.find(x => x.id === et.trainingId);
                    return (
                      <div key={et.id} className="bg-white border border-slate-200 p-8 shadow-sm group hover:border-blue-600 transition-all flex flex-col justify-between">
                         <div className="flex justify-between items-start mb-10">
                            <div className={`w-12 h-12 bg-slate-50 border border-slate-100 flex items-center justify-center text-lg font-bold ${t?.isMandatory ? 'text-red-600 border-red-100 bg-red-50' : 'text-slate-400'}`}>
                               {t?.name[0]}
                            </div>
                            <span className={`px-2 py-0.5 text-[8px] font-bold uppercase border ${et.status === 'Concluído' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>{et.status}</span>
                         </div>

                         <div className="space-y-8">
                            <div>
                               <h5 className="text-lg font-bold text-slate-900 tracking-tight leading-none mb-2 italic uppercase">{t?.name}</h5>
                               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{t?.category} &bull; {t?.durationHours}h Estimadas</p>
                            </div>

                            <div className="space-y-2">
                               <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-slate-300">
                                  <span>Progresso Absorção</span>
                                  <span className="text-slate-900">{et.progress}%</span>
                               </div>
                               <div className="w-full h-1 bg-slate-50 overflow-hidden">
                                  <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${et.progress}%` }}></div>
                               </div>
                            </div>

                            <button 
                              onClick={() => updateTrainingProgress(et.id, 100)}
                              className={`w-full py-4 text-[9px] font-bold uppercase tracking-widest border transition-all ${et.status === 'Concluído' ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-900 hover:bg-slate-50'}`}
                            >
                              {et.status === 'Concluído' ? 'Ver Certificado Bio' : 'Retomar Conhecimento'}
                            </button>
                         </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full py-32 text-center border-2 border-dashed border-slate-100 bg-slate-50/50">
                     <p className="text-slate-300 font-bold uppercase tracking-widest text-[10px] italic">Sua jornada de aprendizado está vazia no momento.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'manager' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                {teamMembers.map(member => (
                  <div key={member.id} className="bg-white border border-slate-200 p-8 shadow-sm flex flex-col justify-between hover:border-slate-900 transition-all">
                     <div className="flex items-center gap-4 mb-10">
                        <div className="w-10 h-10 bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-slate-400">
                           {member.name[0]}
                        </div>
                        <div>
                           <p className="font-bold text-slate-900 text-sm tracking-tight leading-none mb-1 uppercase italic">{member.name}</p>
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{member.role}</p>
                        </div>
                     </div>
                     
                     <div className="space-y-6">
                        <div className="bg-slate-50 p-4 border border-slate-100">
                           <div className="flex justify-between text-[8px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                              <span>Aquis. de Skills</span>
                              <span className="text-slate-900">78%</span>
                           </div>
                           <div className="w-full h-0.5 bg-white overflow-hidden">
                              <div className="h-full bg-blue-600" style={{ width: '78%' }}></div>
                           </div>
                        </div>
                        <button className="w-full py-3 text-[9px] font-bold uppercase tracking-widest text-slate-400 border border-slate-100 hover:text-slate-900 hover:bg-slate-50 transition-all">
                           Auditar PDI
                        </button>
                     </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'admin' && (
              <div className="bg-white border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
                 <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest italic">Curadoria de Conhecimento</h4>
                    <button 
                      onClick={() => setIsAssignModalOpen(true)}
                      className="px-6 py-2 bg-slate-900 text-white text-[9px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-all"
                    >
                       Atribuir Manual
                    </button>
                 </div>
                 
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead>
                          <tr className="bg-slate-50 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                             <th className="px-8 py-5">Módulo Acadêmico</th>
                             <th className="px-6 py-5">Escopo</th>
                             <th className="px-6 py-5">Facilitador</th>
                             <th className="px-8 py-5 text-right">Métricas Ativas</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                          {trainings.map(t => (
                            <tr key={t.id} className="hover:bg-slate-50 transition-colors group">
                               <td className="px-8 py-6">
                                  <p className="text-sm font-bold text-slate-900 tracking-tight leading-none mb-1 uppercase italic">{t.name}</p>
                                  <p className="text-[8px] font-mono text-slate-300 uppercase mt-0.5 tracking-tighter">NODE: {t.id.toUpperCase()}</p>
                               </td>
                               <td className="px-6 py-6">
                                  <span className={`px-2 py-0.5 text-[8px] font-bold uppercase border ${t.isMandatory ? 'bg-red-50 border-red-100 text-red-600' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
                                     {t.category}
                                  </span>
                               </td>
                               <td className="px-6 py-6 text-xs font-medium text-slate-500">{t.instructor}</td>
                               <td className="px-8 py-6 text-right">
                                  <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Active Level</span>
                               </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-8">
          <div className="bg-white border border-slate-200 p-8 shadow-sm">
             <h4 className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-8 border-b border-slate-50 pb-4 italic">Performance Intel</h4>
             
             <div className="space-y-12">
                <div className="text-center group">
                   <p className="text-[9px] font-bold text-slate-300 uppercase mb-2 tracking-widest">Conhecimento Sincronizado</p>
                   <p className="text-6xl font-bold text-slate-900 tracking-tighter italic group-hover:text-blue-600 transition-colors leading-none">{stats.totalHours}</p>
                   <p className="text-[10px] font-bold text-slate-400 uppercase mt-2 tracking-tighter italic">Horas Acumuladas</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 border border-slate-100">
                     <p className="text-2xl font-bold text-slate-900 tracking-tighter leading-none mb-1 italic">{stats.pending}</p>
                     <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Gaps Pendentes</p>
                  </div>
                  
                  <div className="p-4 bg-slate-50 border border-slate-100">
                     <p className="text-2xl font-bold text-slate-900 tracking-tighter leading-none mb-1 italic">TOP 3%</p>
                     <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Global Rank</p>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-50">
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-4 italic">Matriz de Validação</p>
                   <div className="flex gap-1.5 h-1">
                      {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className={`flex-1 transition-all duration-700 ${i <= 4 ? 'bg-blue-600' : 'bg-slate-100'}`}></div>
                      ))}
                   </div>
                </div>
             </div>
          </div>

          <div className="bg-slate-900 p-8 text-white shadow-lg shadow-slate-900/10 relative overflow-hidden group">
             <div className="absolute top-[-20%] left-[-20%] w-32 h-32 bg-blue-600 rounded-full blur-3xl opacity-10"></div>
             <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-6 relative z-10">Insignias de Skills</h4>
             <div className="grid grid-cols-2 gap-4 relative z-10">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={`aspect-square border flex items-center justify-center transition-all ${i === 1 ? 'border-blue-500/30 bg-blue-500/10 text-blue-500' : 'border-white/5 bg-white/5 text-white/10'}`}>
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697l12-8" /></svg>
                  </div>
                ))}
             </div>
          </div>
        </aside>
      </div>

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