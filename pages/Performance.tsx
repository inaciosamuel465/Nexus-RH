
import React, { useState, useMemo } from 'react';
import { useHR } from '../context/HRContext';
import { 
  ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, 
  CartesianGrid, Tooltip, Cell, LabelList, RadarChart, PolarGrid, 
  PolarAngleAxis, Radar, PieChart, Pie
} from 'recharts';
import { PerformanceEvaluation, Employee } from '../types';

const QUADRANTS = [
  { x: [0, 3.3], y: [6.6, 10], label: 'Especialista Técnico', color: 'bg-blue-50', text: 'Alto desempenho, mas baixo potencial de promoção imediata.' },
  { x: [3.3, 6.6], y: [6.6, 10], label: 'Forte Desempenho', color: 'bg-indigo-50', text: 'Pilar da equipe. Focar em retenção e novos desafios.' },
  { x: [6.6, 10], y: [6.6, 10], label: 'Talento Chave', color: 'bg-emerald-50', text: 'Estrela da organização. Sucessor imediato para liderança.' },
  { x: [0, 3.3], y: [3.3, 6.6], label: 'Questionável', color: 'bg-gray-50', text: 'Desempenho mediano com baixo potencial. Reavaliar fit.' },
  { x: [3.3, 6.6], y: [3.3, 6.6], label: 'Mantenedor Eficaz', color: 'bg-blue-50/30', text: 'Contribuição consistente. Manter motivado.' },
  { x: [6.6, 10], y: [3.3, 6.6], label: 'Enigma', color: 'bg-purple-50', text: 'Alto potencial, mas entrega inconsistente. Precisa de coaching.' },
  { x: [0, 3.3], y: [0, 3.3], label: 'Baixo Desempenho', color: 'bg-red-50', text: 'Risco de desligamento. Plano de Recuperação (PIP) urgente.' },
  { x: [3.3, 6.6], y: [0, 3.3], label: 'Dilema', color: 'bg-orange-50', text: 'Potencial moderado, mas entrega insuficiente. Falta motivação.' },
  { x: [6.6, 10], y: [0, 3.3], label: 'Potencial a Lapidar', color: 'bg-amber-50', text: 'Diamante bruto. Investir pesado em treinamento técnico.' },
];

const ScorecardModal: React.FC<{ isOpen: boolean; onClose: () => void; evaluation: PerformanceEvaluation; employee: Employee }> = ({ isOpen, onClose, evaluation, employee }) => {
  if (!isOpen) return null;

  const radarData = [
    { subject: 'Liderança', A: evaluation.performanceScore * 10 },
    { subject: 'Técnica', A: evaluation.potentialScore * 10 },
    { subject: 'Cultura', A: 85 },
    { subject: 'Entrega', A: evaluation.performanceScore * 9 },
    { subject: 'Comunicação', A: 70 },
  ];

  const quadrant = QUADRANTS.find(q => 
    evaluation.potentialScore >= q.x[0] && evaluation.potentialScore <= q.x[1] &&
    evaluation.performanceScore >= q.y[0] && evaluation.performanceScore <= q.y[1]
  ) || QUADRANTS[4];

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-gray-900/90 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-[4rem] w-full max-w-5xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col animate-slideIn">
        <div className="p-10 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-[2rem] bg-indigo-600 text-white flex items-center justify-center text-3xl font-black shadow-xl italic">{employee.name[0]}</div>
            <div>
              <h3 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">{employee.name}</h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{employee.role} &bull; {employee.department}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-4 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-all text-gray-400 shadow-sm"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l18 18" /></svg></button>
        </div>

        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar space-y-12">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-1 space-y-8">
                 <div className={`p-8 rounded-[3rem] border ${quadrant.color.replace('bg-', 'border-')} ${quadrant.color}`}>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-60 text-gray-900">Classificação 9-Box</p>
                    <h4 className="text-2xl font-black text-gray-900 leading-tight mb-4 italic">{quadrant.label}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed font-medium">{quadrant.text}</p>
                 </div>
                 
                 <div className="bg-gray-950 p-8 rounded-[3rem] text-white shadow-xl relative overflow-hidden">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6">Métricas de Performance</p>
                    <div className="grid grid-cols-2 gap-6">
                       <div>
                          <p className="text-3xl font-black">{evaluation.performanceScore}/10</p>
                          <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Entrega Atual</p>
                       </div>
                       <div>
                          <p className="text-3xl font-black text-purple-400">{evaluation.potentialScore}/10</p>
                          <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Potencial Futuro</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="lg:col-span-2 bg-gray-50 p-10 rounded-[4rem] border border-gray-100 relative">
                 <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8">Radar de Competências Internas</h4>
                 <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                       <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                          <PolarGrid stroke="#e2e8f0" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                          <Radar name="Score" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.3} />
                       </RadarChart>
                    </ResponsiveContainer>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                 <h4 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">Plano de Desenvolvimento (PDI)</h4>
                 <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm min-h-[160px]">
                    <p className="text-sm text-gray-600 leading-relaxed italic">"{evaluation.pdi || 'Nenhum plano traçado para este ciclo.'}"</p>
                 </div>
              </div>
              <div className="space-y-6">
                 <h4 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">Status de OKRs / Metas</h4>
                 <div className="space-y-4">
                    {[
                      { t: 'Entrega do Projeto Alpha', p: 85 },
                      { t: 'Redução de Bugs em Produção', p: 100 },
                      { t: 'Mentoria de Novos Devs', p: 40 }
                    ].map(meta => (
                      <div key={meta.t} className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between gap-6">
                         <span className="text-[11px] font-black text-gray-900 uppercase flex-1">{meta.t}</span>
                         <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-600" style={{ width: `${meta.p}%` }}></div>
                         </div>
                         <span className="text-[10px] font-black text-indigo-600">{meta.p}%</span>
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
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-[3.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-slideIn">
        <div className="p-10 border-b border-gray-100 bg-indigo-600 text-white">
          <h3 className="text-2xl font-black uppercase tracking-tighter italic">Nova Calibração 9-Box</h3>
          <p className="text-xs font-bold text-indigo-200 mt-1 uppercase tracking-widest">Protocolo de Governança Nexus</p>
        </div>
        
        <form className="p-10 space-y-8" onSubmit={(e) => {
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
          <div className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Selecionar Talento</label>
              <select value={selectedEmpId} onChange={e => setSelectedEmpId(e.target.value)} required className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-[1.5rem] font-bold outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Escolha um colaborador...</option>
                {employees.map(e => <option key={e.id} value={e.id}>{e.name} ({e.role})</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6 bg-gray-50 p-6 rounded-[2rem]">
                 <label className="text-[11px] font-black text-indigo-600 uppercase tracking-widest block text-center italic">Desempenho (Efetividade)</label>
                 <div className="flex flex-col items-center gap-4">
                    <span className="text-5xl font-black text-gray-900 tabular-nums">{perf}</span>
                    <input type="range" min="1" max="10" step="0.5" value={perf} onChange={e => setPerf(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                    <p className="text-[9px] font-bold text-gray-400 uppercase">Foco: Resultados e Entregas</p>
                 </div>
              </div>
              <div className="space-y-6 bg-gray-50 p-6 rounded-[2rem]">
                 <label className="text-[11px] font-black text-purple-600 uppercase tracking-widest block text-center italic">Potencial (Futuro)</label>
                 <div className="flex flex-col items-center gap-4">
                    <span className="text-5xl font-black text-gray-900 tabular-nums">{pot}</span>
                    <input type="range" min="1" max="10" step="0.5" value={pot} onChange={e => setPot(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600" />
                    <p className="text-[9px] font-bold text-gray-400 uppercase">Foco: Adaptabilidade e Liderança</p>
                 </div>
              </div>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Notas do Avaliador / PDI</label>
               <textarea 
                  value={pdi}
                  onChange={e => setPdi(e.target.value)}
                  placeholder="Quais as próximas etapas para este talento?" 
                  className="w-full h-24 px-6 py-4 bg-gray-50 border border-gray-200 rounded-[1.5rem] font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500"
               />
            </div>
          </div>

          <div className="flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 py-5 border border-gray-200 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all">Cancelar</button>
            <button type="submit" disabled={!selectedEmpId} className="flex-[2] py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50">Finalizar Avaliação</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Performance: React.FC = () => {
  const { employees, evaluations, currentUser, saveEvaluation, deleteEvaluation } = useHR();
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
    return { total, evaluated, keyTalents, risks, perc: Math.round((evaluated / total) * 100) };
  }, [employees, evaluations, chartData]);

  const quadrantStats = useMemo(() => {
     const counts: Record<string, number> = {};
     chartData.forEach(d => {
        const q = QUADRANTS.find(q => d.x >= q.x[0] && d.x <= q.x[1] && d.y >= q.y[0] && d.y <= q.y[1])?.label || 'Outros';
        counts[q] = (counts[q] || 0) + 1;
     });
     return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [chartData]);

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#3b82f6'];

  return (
    <div className="space-y-10 animate-fadeIn pb-24">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          </div>
          <div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter italic uppercase leading-none">Mapa de Competências</h2>
            <p className="text-gray-500 font-medium mt-2">Visão estratégica do Capital Humano e Sucessão.</p>
          </div>
        </div>
        <div className="flex gap-4">
           <div className="bg-gray-50 p-2 rounded-2xl border border-gray-100 flex items-center gap-3">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-2">Departamento:</span>
              <select value={filterDept} onChange={e => setFilterDept(e.target.value)} className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-xs font-bold outline-none cursor-pointer">
                 {depts.map(d => <option key={d}>{d}</option>)}
              </select>
           </div>
           <button 
             onClick={() => setIsModalOpen(true)}
             className="px-10 py-5 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-gray-200 hover:bg-black transition-all"
           >
             Iniciar Calibração
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
         {/* 9-Box Dinâmica com Labels Estratégicas */}
         <div className="xl:col-span-3 bg-white p-12 rounded-[4rem] border border-gray-100 shadow-sm relative">
            <div className="flex justify-between items-center mb-12">
               <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic flex items-center gap-4">
                  <div className="w-3 h-10 bg-indigo-600 rounded-full"></div>
                  Matriz de Talentos 9-Box
               </h3>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Atualizado para Ciclo {new Date().getFullYear()}</p>
            </div>

            <div className="relative h-[650px] group/chart">
               {/* Background Quadrant Grid with Labels */}
               <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none rounded-[3rem] overflow-hidden border border-gray-100">
                  {QUADRANTS.map((q, i) => (
                    <div key={i} className={`border border-gray-50 flex flex-col p-4 opacity-50 transition-opacity hover:opacity-100 ${q.color}`}>
                       <span className="text-[9px] font-black text-gray-400 uppercase tracking-tight">{q.label}</span>
                    </div>
                  ))}
               </div>
               
               {/* Axes Labels */}
               <div className="absolute -left-16 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Performance (Resultados)</div>
               <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Potencial (Futuro)</div>

               <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                     <XAxis type="number" dataKey="x" name="Potencial" domain={[0, 10]} hide />
                     <YAxis type="number" dataKey="y" name="Desempenho" domain={[0, 10]} hide />
                     <ZAxis type="number" range={[100, 100]} />
                     <Tooltip 
                        cursor={{ strokeDasharray: '3 3' }} 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white p-6 rounded-[2rem] shadow-2xl border border-indigo-100 animate-fadeIn">
                                 <p className="font-black text-lg text-gray-900 leading-none mb-1">{data.fullName}</p>
                                 <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-4">{data.role}</p>
                                 <div className="flex gap-4">
                                    <div className="flex-1 bg-gray-50 p-3 rounded-xl text-center">
                                       <p className="text-xs font-black text-gray-900">{data.y}</p>
                                       <p className="text-[7px] font-bold text-gray-400 uppercase">Perf.</p>
                                    </div>
                                    <div className="flex-1 bg-gray-50 p-3 rounded-xl text-center">
                                       <p className="text-xs font-black text-purple-600">{data.x}</p>
                                       <p className="text-[7px] font-bold text-gray-400 uppercase">Pot.</p>
                                    </div>
                                 </div>
                                 <p className="mt-4 text-[9px] font-black text-indigo-600 uppercase text-center">Clique para Scorecard Completo</p>
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
                          <Cell key={`cell-${index}`} fill={entry.y >= 6.6 && entry.x >= 6.6 ? '#10B981' : entry.y < 3.3 ? '#EF4444' : '#6366F1'} className="filter drop-shadow-xl hover:scale-125 transition-transform duration-500" />
                        ))}
                        <LabelList dataKey="name" position="top" style={{ fontSize: '11px', fontWeight: '900', fill: '#1f2937', fontStyle: 'italic', textTransform: 'uppercase' }} />
                     </Scatter>
                  </ScatterChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Painel Lateral de Indicadores e Rankings */}
         <div className="space-y-8">
            <div className="bg-gray-950 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
               <h4 className="text-[11px] font-black uppercase tracking-widest text-indigo-400 mb-10 border-b border-white/10 pb-4 italic">Resumo Executivo</h4>
               <div className="space-y-10">
                  <div>
                     <p className="text-[10px] font-bold text-indigo-300 uppercase mb-3 tracking-widest">Saúde do Ciclo</p>
                     <p className="text-5xl font-black tabular-nums">{stats.perc}<span className="text-xl opacity-40">%</span></p>
                     <div className="w-full h-2 bg-white/10 rounded-full mt-5 overflow-hidden">
                        <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${stats.perc}%` }}></div>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                     <div className="p-5 bg-white/5 rounded-3xl border border-white/5 group-hover:bg-indigo-900/40 transition-colors">
                        <p className="text-3xl font-black text-emerald-400">{stats.keyTalents}</p>
                        <p className="text-[8px] font-black text-gray-500 uppercase tracking-tighter mt-1">High Flyers</p>
                     </div>
                     <div className="p-5 bg-white/5 rounded-3xl border border-white/5 group-hover:bg-red-900/40 transition-colors">
                        <p className="text-3xl font-black text-red-400">{stats.risks}</p>
                        <p className="text-[8px] font-black text-gray-500 uppercase tracking-tighter mt-1">Gaps Críticos</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
               <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-8 flex justify-between items-center">
                  Distribuição de Quadrantes
                  <svg className="w-4 h-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
               </h4>
               <div className="h-48 mb-8">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie data={quadrantStats} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={5} dataKey="value">
                           {quadrantStats.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                     </PieChart>
                  </ResponsiveContainer>
               </div>
               <div className="space-y-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                  {quadrantStats.map((q, i) => (
                    <div key={q.name} className="flex items-center justify-between group">
                       <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                          <span className="text-[10px] font-black text-gray-900 uppercase tracking-tight">{q.name}</span>
                       </div>
                       <span className="text-[10px] font-bold text-gray-400 tabular-nums">{q.value}</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>

      <EvaluationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        employees={employees.filter(e => e.id !== currentUser.id)} 
        onSave={saveEvaluation} 
        evaluatorId={currentUser.id} 
      />

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
