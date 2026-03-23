import React, { useState, useMemo } from 'react';
import { useHR } from '../context/HRContext';

const SKILLS = [
  { id: 'sk1', name: 'Comunicação', category: 'Comportamental' },
  { id: 'sk2', name: 'Liderança', category: 'Liderança' },
  { id: 'sk3', name: 'Análise de Dados', category: 'Técnica' },
  { id: 'sk4', name: 'TypeScript/React', category: 'Técnica' },
  { id: 'sk5', name: 'Gestão de Projetos', category: 'Liderança' },
  { id: 'sk6', name: 'Negociação', category: 'Comportamental' },
  { id: 'sk7', name: 'SQL/Banco de Dados', category: 'Técnica' },
  { id: 'sk8', name: 'Trabalho em Equipe', category: 'Comportamental' },
];

const SCORE_LABELS: Record<number, { label: string; bg: string; text: string; darkBg: string; darkText: string }> = {
  0: { label: 'N/A', bg: 'bg-slate-50', text: 'text-slate-200', darkBg: 'dark:bg-slate-900', darkText: 'dark:text-slate-800' },
  1: { label: 'Iniciante', bg: 'bg-red-50', text: 'text-red-500', darkBg: 'dark:bg-red-950/30', darkText: 'dark:text-red-400' },
  2: { label: 'Básico', bg: 'bg-orange-50', text: 'text-orange-500', darkBg: 'dark:bg-orange-950/30', darkText: 'dark:text-orange-400' },
  3: { label: 'Competente', bg: 'bg-amber-50', text: 'text-amber-600', darkBg: 'dark:bg-amber-950/30', darkText: 'dark:text-amber-400' },
  4: { label: 'Avançado', bg: 'bg-blue-50', text: 'text-blue-600', darkBg: 'dark:bg-blue-950/30', darkText: 'dark:text-blue-400' },
  5: { label: 'Expert', bg: 'bg-emerald-50', text: 'text-emerald-600', darkBg: 'dark:bg-emerald-950/30', darkText: 'dark:text-emerald-400' },
};

const CompetencyMatrix: React.FC = () => {
  const { employees } = useHR();
  const [scores, setScores] = useState<Record<string, Record<string, number>>>(() => {
    const initial: Record<string, Record<string, number>> = {};
    employees.slice(0, 8).forEach(e => {
      initial[e.id] = {};
      SKILLS.forEach(s => { initial[e.id][s.id] = Math.floor(Math.random() * 5) + 1; });
    });
    return initial;
  });
  const [filterCategory, setFilterCategory] = useState('Todas');
  const [editingCell, setEditingCell] = useState<{ empId: string; skillId: string } | null>(null);

  const displayEmployees = employees.slice(0, 8);
  const categories = ['Todas', ...Array.from(new Set(SKILLS.map(s => s.category)))];
  const filteredSkills = filterCategory === 'Todas' ? SKILLS : SKILLS.filter(s => s.category === filterCategory);

  const gapAnalysis = useMemo(() => {
    return SKILLS.map(skill => {
      const avg = displayEmployees.reduce((a, e) => a + (scores[e.id]?.[skill.id] || 0), 0) / displayEmployees.length;
      const gap = 5 - Math.round(avg * 10) / 10;
      return { skill, avg: Math.round(avg * 10) / 10, gap };
    }).sort((a, b) => b.gap - a.gap);
  }, [scores, displayEmployees]);

  return (
    <div className="space-y-8 animate-fadeIn pb-20">
      <div className="bg-slate-900 border border-slate-200 dark:border-slate-800 relative min-h-[220px] flex items-center px-10 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1434626881859-194d67b2b86f?auto=format&fit=crop&q=80&w=1200" className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale" alt="Competency" />
        <div className="relative z-10 w-full flex flex-col lg:flex-row justify-between items-center gap-8">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tighter uppercase italic">Matriz de Competências</h1>
            <p className="text-sm text-slate-400 mt-2 max-w-lg font-medium italic">Mapa de habilidades por colaborador. Identifique gaps e planeje ações de desenvolvimento Nexus.</p>
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilterCategory(cat)} className={`px-6 py-3 text-[10px] font-bold uppercase tracking-widest border transition-all italic shadow-lg ${filterCategory === cat ? 'bg-white text-slate-900 border-white' : 'text-slate-400 border-white/10 hover:bg-white/5 hover:text-white backdrop-blur-md'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3 nexus-card p-0 overflow-hidden">
          <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-slate-900 dark:bg-blue-600"></div>
              <h3 className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-widest italic">Heat Map de Habilidades Nexus</h3>
            </div>
            <p className="text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest italic tracking-tighter">Clique em uma célula para reavaliar competência</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-50 dark:border-slate-800/50">
                  <th className="text-left px-8 py-6 w-48 text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest italic">Capitais Humanos</th>
                  {filteredSkills.map(s => (
                    <th key={s.id} className="px-3 py-6 text-center min-w-[100px]">
                      <div>
                        <p className="text-[9px] font-bold text-slate-900 dark:text-white uppercase tracking-widest italic leading-tight">{s.name}</p>
                        <p className="text-[8px] font-bold text-slate-300 dark:text-slate-800 uppercase italic mt-1">{s.category}</p>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/20">
                {displayEmployees.map(emp => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors group">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold italic text-slate-400 dark:text-slate-600 shadow-inner">{emp.name[0]}</div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white uppercase italic tracking-tight leading-none">{emp.name.split(' ')[0]}</p>
                          <p className="text-[8px] font-bold text-slate-400 dark:text-slate-600 uppercase italic mt-1">{emp.department}</p>
                        </div>
                      </div>
                    </td>
                    {filteredSkills.map(skill => {
                      const score = scores[emp.id]?.[skill.id] || 0;
                      const cfg = SCORE_LABELS[score];
                      const isEditing = editingCell?.empId === emp.id && editingCell?.skillId === skill.id;
                      return (
                        <td key={skill.id} className="px-2 py-3 text-center">
                          {isEditing ? (
                            <select 
                              autoFocus 
                              defaultValue={score} 
                              onChange={e => { 
                                setScores(prev => ({ ...prev, [emp.id]: { ...prev[emp.id], [skill.id]: Number(e.target.value) } })); 
                                setEditingCell(null); 
                              }} 
                              onBlur={() => setEditingCell(null)} 
                              className="text-[10px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold italic p-2 w-24 outline-none shadow-xl"
                            >
                              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} - {SCORE_LABELS[n].label}</option>)}
                            </select>
                          ) : (
                            <button 
                              onClick={() => setEditingCell({ empId: emp.id, skillId: skill.id })} 
                              className={`w-full py-3 text-[10px] font-bold uppercase italic transition-all hover:scale-105 shadow-sm transform ${cfg.bg} ${cfg.text} ${cfg.darkBg} ${cfg.darkText}`}
                            >
                              {score}/5
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-8 border-t border-slate-50 dark:border-slate-800 flex gap-6 flex-wrap">
            {Object.entries(SCORE_LABELS).filter(([k]) => k !== '0').map(([k, v]) => (
              <div key={k} className="flex items-center gap-2">
                <div className={`w-3.5 h-3.5 shadow-sm transform rotate-45 ${v.bg} ${v.darkBg}`}></div>
                <span className={`text-[8px] font-bold uppercase italic ${v.text} ${v.darkText}`}>{k} — {v.label}</span>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="nexus-card p-10">
            <h4 className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-widest italic mb-8 border-b border-slate-50 dark:border-slate-800 pb-4 flex items-center gap-2">
              <span className="text-red-500 underline underline-offset-4">⚠️ Gaps Críticos</span>
            </h4>
            <div className="space-y-6">
              {gapAnalysis.slice(0, 6).map(({ skill, avg, gap }) => (
                <div key={skill.id} className="group">
                  <div className="flex justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase italic tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{skill.name}</span>
                    <span className={`text-[9px] font-bold italic ${gap >= 2 ? 'text-red-500' : gap >= 1 ? 'text-amber-500' : 'text-emerald-500'}`}>gap {gap.toFixed(1)}</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className={`h-full transition-all duration-1000 shadow-lg ${gap >= 2 ? 'bg-red-500 shadow-red-500/20' : gap >= 1 ? 'bg-amber-500 shadow-amber-500/20' : 'bg-emerald-500 shadow-emerald-500/20'}`} 
                      style={{ width: `${(avg / 5) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <p className="text-[8px] font-bold text-slate-300 dark:text-slate-700 italic uppercase">Qualidade Nexus: {avg}/5</p>
                    <p className="text-[8px] font-bold text-slate-900 dark:text-white italic">{(avg/5*100).toFixed(0)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 dark:bg-slate-950 border border-slate-800 dark:border-blue-900/10 p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl -mr-16 -mt-16"></div>
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest italic mb-8 border-b border-white/5 pb-4 relative z-10">Estratégia Nexus RH</h4>
            <div className="space-y-5 relative z-10">
              {gapAnalysis.slice(0, 3).map(({ skill, gap }) => (
                <div key={skill.id} className="p-5 bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-crosshair group">
                  <p className="text-[10px] font-bold text-white uppercase italic tracking-tight group-hover:text-blue-400">{skill.name}</p>
                  <p className="text-[9px] text-slate-500 italic mt-2 leading-relaxed">Prioridade Alta. Gap de {gap.toFixed(1)}pt detectado. Recomendado: Implementar Workshop de {skill.category} imediato.</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CompetencyMatrix;
