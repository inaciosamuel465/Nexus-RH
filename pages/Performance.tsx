import React, { useState, useMemo } from 'react';
import { useHR } from '../context/HRContext';
import { 
  ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, 
  CartesianGrid, Tooltip, Cell, LabelList, RadarChart, PolarGrid, 
  PolarAngleAxis, Radar, PieChart, Pie
} from 'recharts';
import { PerformanceEvaluation, Employee } from '../types';

const QUADRANTS = [
  { x: [0, 3.3], y: [6.6, 10], label: 'Especialista Técnico', color: 'bg-blue-50', border: 'border-blue-100', text: 'Alto desempenho, mas baixo potencial de promoção imediata.' },
  { x: [3.3, 6.6], y: [6.6, 10], label: 'Forte Desempenho', color: 'bg-slate-50', border: 'border-slate-200', text: 'Pilar da equipe. Focar em retenção e novos desafios.' },
  { x: [6.6, 10], y: [6.6, 10], label: 'Talento Chave', color: 'bg-emerald-50', border: 'border-emerald-100', text: 'Estrela da organização. Sucessor imediato para liderança.' },
  { x: [0, 3.3], y: [3.3, 6.6], label: 'Questionável', color: 'bg-slate-50', border: 'border-slate-100', text: 'Desempenho mediano com baixo potencial. Reavaliar fit.' },
  { x: [3.3, 6.6], y: [3.3, 6.6], label: 'Mantenedor Eficaz', color: 'bg-white', border: 'border-slate-200', text: 'Contribuição consistente. Manter motivado.' },
  { x: [6.6, 10], y: [3.3, 6.6], label: 'Enigma', color: 'bg-purple-50', border: 'border-purple-100', text: 'Alto potencial, mas entrega inconsistente. Precisa de coaching.' },
  { x: [0, 3.3], y: [0, 3.3], label: 'Baixo Desempenho', color: 'bg-red-50', border: 'border-red-100', text: 'Risco de desligamento. Plano de Recuperação (PIP) urgente.' },
  { x: [3.3, 6.6], y: [0, 3.3], label: 'Dilema', color: 'bg-orange-50', border: 'border-orange-100', text: 'Potencial moderado, mas entrega insuficiente. Falta motivação.' },
  { x: [6.6, 10], y: [0, 3.3], label: 'Potencial a Lapidar', color: 'bg-amber-50', border: 'border-amber-100', text: 'Diamante bruto. Investir pesado em treinamento técnico.' },
];

const ScorecardModal: React.FC<{ isOpen: boolean; onClose: () => void; evaluation: PerformanceEvaluation; employee: Employee }> = ({ isOpen, onClose, evaluation, employee }) => {
  if (!isOpen) return null;

  const radarData = [
    { subject: 'Liderança', A: (evaluation.performanceScore || 0) * 10 },
    { subject: 'Técnica', A: (evaluation.potentialScore || 0) * 10 },
    { subject: 'Cultura', A: 85 },
    { subject: 'Entrega', A: (evaluation.performanceScore || 0) * 9 },
    { subject: 'Comunicação', A: 70 },
  ];

  const quadrant = QUADRANTS.find(q => 
    evaluation.potentialScore >= q.x[0] && evaluation.potentialScore <= q.x[1] &&
    evaluation.performanceScore >= q.y[0] && evaluation.performanceScore <= q.y[1]
  ) || QUADRANTS[4];

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-none w-full max-w-5xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col animate-slideIn">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-none bg-slate-900 text-white flex items-center justify-center text-2xl font-bold italic">{employee.name[0]}</div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase italic">{employee.name}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">{employee.role} &bull; {employee.department}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l18 18" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-12 space-y-12 no-scrollbar">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-1 space-y-8">
                 <div className={`p-8 border shadow-sm ${quadrant.border} ${quadrant.color}`}>
                    <p className="text-[9px] font-bold uppercase tracking-widest mb-2 text-slate-400 italic">Classificação 9-Box</p>
                    <h4 className="text-xl font-bold text-slate-900 leading-tight mb-4 uppercase italic">{quadrant.label}</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-bold uppercase tracking-wide italic">{quadrant.text}</p>
                 </div>
                 
                 <div className="bg-white border border-slate-200 p-8 shadow-sm">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-6 italic">Métricas Atuais</p>
                    <div className="grid grid-cols-2 gap-6">
                       <div>
                          <p className="text-4xl font-bold text-slate-900 tabular-nums italic">{evaluation.performanceScore}<span className="text-sm text-slate-300 ml-1">/10</span></p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Desempenho</p>
                       </div>
                       <div>
                          <p className="text-4xl font-bold text-blue-600 tabular-nums italic">{evaluation.potentialScore}<span className="text-sm text-blue-200 ml-1">/10</span></p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Potencial</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="lg:col-span-2 bg-slate-50 border border-slate-100 p-10">
                 <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-8 text-center italic">Radar de Competências Mentais</h4>
                 <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                       <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                          <PolarGrid stroke="#e2e8f0" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                          <Radar name="Score" dataKey="A" stroke="#2563eb" fill="#2563eb" fillOpacity={0.1} />
                       </RadarChart>
                    </ResponsiveContainer>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pt-8 border-t border-slate-50">
              <div className="space-y-6">
                 <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em] border-b border-slate-100 pb-2 italic text-left">Plano de Desenvolvimento (PDI)</h4>
                 <div className="bg-slate-50 p-8 border border-slate-100 italic text-slate-500 text-xs leading-relaxed uppercase font-bold tracking-widest">
                    "{evaluation.pdi || 'Nenhum plano traçado para este ciclo.'}"
                 </div>
              </div>
              <div className="space-y-6">
                 <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em] border-b border-slate-100 pb-2 italic text-left">Status de Metas Nexus</h4>
                 <div className="space-y-4">
                    {[
                      { t: 'Entrega do Projeto Alpha', p: 85, color: 'bg-blue-600' },
                      { t: 'Redução de Bugs em Produção', p: 100, color: 'bg-slate-900' },
                      { t: 'Mentoria de Novos Devs', p: 40, color: 'bg-slate-300' }
                    ].map(meta => (
                      <div key={meta.t} className="flex justify-between items-center bg-white p-5 border border-slate-100 shadow-sm">
                         <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest italic">{meta.t}</span>
                         <div className="flex items-center gap-6">
                            <div className="w-24 h-1 bg-slate-100">
                               <div className={`h-full ${meta.color}`} style={{ width: `${meta.p}%` }}></div>
                            </div>
                            <span className="text-[9px] font-bold text-slate-900 tabular-nums italic">{meta.p}%</span>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const EvaluationModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  employees: Employee[]; 
  onSave: (data: any) => void;
  evaluatorId: string;
}> = ({ isOpen, onClose, employees, onSave, evaluatorId }) => {
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [perf, setPerf] = useState(5);
  const [pot, setPot] = useState(5);
  const [pdi, setPdi] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-none w-full max-w-2xl shadow-2xl overflow-hidden animate-slideIn">
        <div className="p-10 border-b border-slate-100 bg-slate-50">
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight uppercase italic">Ciclo de Avaliação</h3>
          <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest italic">Protocolo de Manifestação de Desempenho v2.4</p>
        </div>
        
        <form className="p-10 space-y-10" onSubmit={(e) => {
          e.preventDefault();
          onSave({
            employeeId: selectedEmpId,
            evaluatorId: evaluatorId,
            period: '2024-S1',
            performanceScore: Number(perf),
            potentialScore: Number(pot),
            status: 'Finalizada',
            competencies: [],
            goals: [],
            pdi: pdi || 'Manutenção do plano atual.'
          });
          onClose();
        }}>
          <div className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 italic">Colaborador em Análise</label>
              <select value={selectedEmpId} onChange={e => setSelectedEmpId(e.target.value)} required className="w-full border-b border-slate-200 py-3 text-sm text-slate-900 font-bold outline-none focus:border-blue-600 transition-colors bg-transparent uppercase italic">
                <option value="">Selecione...</option>
                {employees.map(e => <option key={e.id} value={e.id}>{e.name} — {e.role}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
              <div className="space-y-6">
                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block text-center italic">Score de Entrega (1-10)</label>
                 <div className="flex flex-col items-center gap-6">
                    <span className="text-6xl font-bold text-slate-900 tabular-nums italic">{perf}</span>
                    <input type="range" min="1" max="10" step="0.5" value={perf} onChange={e => setPerf(Number(e.target.value))} className="w-full h-1 bg-slate-100 accent-slate-900 cursor-pointer" />
                 </div>
              </div>
              <div className="space-y-6">
                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block text-center italic">Score de Potencial (1-10)</label>
                 <div className="flex flex-col items-center gap-6">
                    <span className="text-6xl font-bold text-blue-600 tabular-nums italic">{pot}</span>
                    <input type="range" min="1" max="10" step="0.5" value={pot} onChange={e => setPot(Number(e.target.value))} className="w-full h-1 bg-slate-100 accent-blue-600 cursor-pointer" />
                 </div>
              </div>
            </div>

            <div className="space-y-2 pt-4">
               <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 italic">Manifestação de Feedback / PDI</label>
               <textarea 
                  value={pdi}
                  onChange={e => setPdi(e.target.value)}
                  placeholder="Quais as próximas etapas para aceleração deste talento?" 
                  className="w-full h-32 border border-slate-100 p-6 text-xs text-slate-900 font-medium outline-none focus:border-blue-600 transition-colors resize-none bg-slate-50 italic uppercase tracking-wider"
               />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400 border border-slate-100 hover:bg-slate-50 transition-all italic">Cancelar</button>
            <button type="submit" disabled={!selectedEmpId} className="flex-[2] py-5 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-blue-600 transition-all disabled:opacity-50 shadow-xl italic">Sincronizar Ciclo</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Performance: React.FC = () => {
  const { employees, evaluations, authenticatedUser, saveEvaluation } = useHR();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterDept, setFilterDept] = useState('Todos');
  const [selectedEval, setSelectedEval] = useState<{ ev: PerformanceEvaluation, emp: Employee } | null>(null);

  const depts = useMemo(() => ['Todos', ...Array.from(new Set(employees.map(e => e.department)))], [employees]);

  const chartData = useMemo(() => {
    return evaluations
      .filter(ev => {
        const emp = employees.find(e => e.id === ev.employeeId);
        return filterDept === 'Todos' || emp?.department === filterDept;
      })
      .map(ev => {
        const emp = employees.find(e => e.id === ev.employeeId);
        return {
          id: ev.id,
          name: emp?.name.split(' ')[0],
          fullName: emp?.name,
          x: ev.potentialScore,
          y: ev.performanceScore,
          role: emp?.role,
          dept: emp?.department,
          original: ev,
          employee: emp
        };
      });
  }, [evaluations, employees, filterDept]);

  const stats = useMemo(() => {
    const total = employees.length;
    const evaluated = new Set(evaluations.map(ev => ev.employeeId)).size;
    const keyTalents = chartData.filter(d => d.x >= 6.6 && d.y >= 6.6).length;
    const risks = chartData.filter(d => d.y < 3.3).length;
    return { total, evaluated, keyTalents, risks, perc: total > 0 ? Math.round((evaluated / total) * 100) : 0 };
  }, [employees, evaluations, chartData]);

  const quadrantStats = useMemo(() => {
     const counts: Record<string, number> = {};
     chartData.forEach(d => {
        const q = QUADRANTS.find(q => d.x >= q.x[0] && d.x <= q.x[1] && d.y >= q.y[0] && d.y <= q.y[1])?.label || 'Outros';
        counts[q] = (counts[q] || 0) + 1;
     });
     return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [chartData]);

  const COLORS = ['#2563eb', '#1e293b', '#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0', '#0f172a'];

  return (
    <div className="space-y-8 animate-fadeIn pb-20">
      {/* Banner de Performance Estilizado */}
      <div className="bg-slate-900 border border-slate-200 relative min-h-[220px] flex items-center px-10 overflow-hidden">
         <img 
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200" 
            className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale"
            alt="Performance"
         />
         <div className="relative z-10 w-full flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="text-center lg:text-left">
               <h1 className="text-4xl font-bold text-white tracking-tighter uppercase italic">Gestão de Performance</h1>
               <p className="text-sm text-slate-400 mt-2 max-w-xl font-medium italic">Matriz 9-Box de sucessão e análise neural de competências. Identificando os pilares e as estrelas da organização Nexus.</p>
            </div>
            
            <div className="flex gap-4">
               <div className="bg-white/5 border border-white/10 flex items-center px-4 py-2">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-3 italic">Departamento:</span>
                  <select value={filterDept} onChange={e => setFilterDept(e.target.value)} className="bg-transparent text-[10px] font-bold uppercase text-white outline-none cursor-pointer py-1 italic">
                     {depts.map(d => <option key={d} className="bg-slate-900 font-sans uppercase">{d}</option>)}
                  </select>
               </div>
               <button 
                 onClick={() => setIsModalOpen(true)}
                 className="px-10 py-4 bg-white text-slate-900 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-blue-600 hover:text-white shadow-xl transition-all italic"
               >
                 Iniciar Ciclo
               </button>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
         <div className="xl:col-span-3 bg-white border border-slate-200 p-10 shadow-sm relative">
            <div className="flex justify-between items-center mb-12 border-b border-slate-50 pb-6">
               <div className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 bg-blue-600"></div>
                  <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest italic">Análise de Potencial vs Desempenho</h3>
               </div>
               <div className="flex gap-6 text-[9px] font-bold uppercase tracking-widest text-slate-400 italic">
                  <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500"></div> Talento Chave</span>
                  <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-600"></div> Nominal</span>
               </div>
            </div>

            <div className="relative h-[550px]">
               <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 border border-slate-100 bg-slate-50/20">
                  {QUADRANTS.map((q, i) => (
                    <div key={i} className={`border border-slate-50 flex flex-col p-4 ${q.color} opacity-40 group hover:opacity-100 transition-opacity`}>
                       <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest italic">{q.label}</span>
                    </div>
                  ))}
               </div>
               
               <div className="absolute -left-16 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-bold text-slate-300 uppercase tracking-[0.5em] italic">Desempenho</div>
               <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-300 uppercase tracking-[0.5em] italic">Potencial</div>

               <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                     <XAxis type="number" dataKey="x" domain={[0, 10]} hide />
                     <YAxis type="number" dataKey="y" domain={[0, 10]} hide />
                     <ZAxis type="number" range={[150, 150]} />
                     <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-slate-900 p-5 shadow-2xl border border-slate-800 animate-fadeIn">
                                 <p className="font-bold text-xs text-white uppercase mb-2 italic tracking-tight">{data.fullName}</p>
                                 <p className="text-[8px] font-bold text-blue-500 uppercase tracking-widest mb-3 italic">{data.role}</p>
                                 <div className="flex gap-6 border-t border-white/5 pt-3">
                                    <div className="flex flex-col">
                                       <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest italic mb-1">Score:</span>
                                       <p className="text-xl font-bold text-white tabular-nums italic">{data.y}<span className="text-[8px] text-slate-600 ml-1">PER</span></p>
                                    </div>
                                    <div className="flex flex-col">
                                       <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest italic mb-1">Delta:</span>
                                       <p className="text-xl font-bold text-blue-500 tabular-nums italic">{data.x}<span className="text-[8px] text-slate-600 ml-1">POT</span></p>
                                    </div>
                                 </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                     />
                     <Scatter 
                        name="Talentos" 
                        data={chartData} 
                        onClick={(data) => setSelectedEval({ ev: data.original, emp: data.employee })}
                        className="cursor-pointer"
                      >
                        {chartData.map((entry, index) => (
                           <Cell 
                              key={`cell-${index}`} 
                              fill={entry.y >= 6.6 && entry.x >= 6.6 ? '#10B981' : entry.y < 3.3 ? '#EF4444' : '#1e293b'} 
                              className="hover:scale-[1.8] transition-all duration-300"
                              strokeWidth={3}
                              stroke="#fff"
                           />
                        ))}
                        <LabelList dataKey="name" position="right" offset={10} style={{ fontSize: '9px', fontWeight: 'bold', fill: '#64748b', textTransform: 'uppercase', fontStyle: 'italic' }} />
                     </Scatter>
                  </ScatterChart>
               </ResponsiveContainer>
            </div>
         </div>

         <aside className="space-y-8">
            <div className="bg-white border border-slate-200 p-10 shadow-sm flex flex-col items-center">
               <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-10 italic w-full border-b border-slate-50 pb-4">Status do Ciclo</h4>
               <div className="relative w-32 h-32 mb-8">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                     <circle cx="50" cy="50" r="45" fill="none" stroke="#f1f5f9" strokeWidth="6" />
                     <circle cx="50" cy="50" r="45" fill="none" stroke="#0f172a" strokeWidth="6" strokeDasharray={`${stats.perc * 2.83} 283`} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <span className="text-3xl font-bold text-slate-900 tabular-nums italic">{stats.perc}%</span>
                  </div>
               </div>
               <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-10 shadow-sm py-1 px-4 border border-slate-50 italic">Calibração Nexus</p>
               <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="p-4 bg-slate-50 text-center border border-slate-100">
                     <p className="text-2xl font-bold text-emerald-600 italic tracking-tighter">{stats.keyTalents}</p>
                     <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest italic">Estrelas</p>
                  </div>
                  <div className="p-4 bg-slate-50 text-center border border-slate-100">
                     <p className="text-2xl font-bold text-red-500 italic tracking-tighter">{stats.risks}</p>
                     <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest italic">Risco</p>
                  </div>
               </div>
            </div>

            <div className="bg-white border border-slate-200 p-10 shadow-sm">
               <div className="flex items-center gap-4 border-b border-slate-50 pb-4 mb-8">
                  <div className="w-1.5 h-1.5 bg-slate-900"></div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 italic">Distribuição de Matriz</h4>
               </div>
               <div className="h-44 mb-8">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie 
                          data={quadrantStats} 
                          cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={4} dataKey="value" stroke="none"
                        >
                           {quadrantStats.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                     </PieChart>
                  </ResponsiveContainer>
               </div>
               <div className="space-y-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar border-t border-slate-50 pt-4">
                  {quadrantStats.map((q, i) => (
                    <div key={q.name} className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest italic group cursor-default">
                       <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                          <span className="text-slate-400 group-hover:text-slate-900 transition-colors truncate max-w-[120px]">{q.name}</span>
                       </div>
                       <span className="text-slate-900">{q.value}</span>
                    </div>
                  ))}
               </div>
            </div>
         </aside>
      </div>

      {authenticatedUser && (
        <EvaluationModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          employees={employees.filter(e => e.id !== authenticatedUser.id)} 
          onSave={saveEvaluation} 
          evaluatorId={authenticatedUser.id} 
        />
      )}

      {selectedEval && (
        <ScorecardModal 
          isOpen={!!selectedEval} 
          onClose={() => setSelectedEval(null)} 
          evaluation={selectedEval.ev} 
          employee={selectedEval.emp} 
        />
      )}
    </div>
  );
};

export default Performance;
