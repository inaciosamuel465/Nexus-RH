import React, { useState, useMemo } from 'react';
import { useHR } from '../context/HRContext';
import { RecognitionType } from '../types';

const RECOGNITION_TYPES: Record<RecognitionType, { label: string; emoji: string; points: number; color: string; darkColor: string }> = {
  destaque_mes: { label: 'Destaque do Mês', emoji: '🏆', points: 100, color: 'bg-amber-50 border-amber-200', darkColor: 'dark:bg-amber-950/20 dark:border-amber-900/50' },
  performance: { label: 'Alta Performance', emoji: '⭐', points: 80, color: 'bg-blue-50 border-blue-200', darkColor: 'dark:bg-blue-950/20 dark:border-blue-900/50' },
  inovacao: { label: 'Inovação', emoji: '💡', points: 90, color: 'bg-purple-50 border-purple-200', darkColor: 'dark:bg-purple-950/20 dark:border-purple-900/50' },
  cultura: { label: 'Cultura & Valores', emoji: '❤️', points: 60, color: 'bg-rose-50 border-rose-200', darkColor: 'dark:bg-rose-950/20 dark:border-rose-900/50' },
  cliente: { label: 'Excelência ao Cliente', emoji: '🤝', points: 70, color: 'bg-emerald-50 border-emerald-200', darkColor: 'dark:bg-emerald-950/20 dark:border-emerald-900/50' },
};

const GrantModal: React.FC<{ isOpen: boolean; onClose: () => void; employees: any[]; onGrant: (d: any) => void; grantedBy: string }> = ({ isOpen, onClose, employees, onGrant, grantedBy }) => {
  const [selectedEmp, setSelectedEmp] = useState('');
  const [type, setType] = useState<RecognitionType>('destaque_mes');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 w-full max-w-lg shadow-2xl animate-slideIn relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-rose-600"></div>
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase italic tracking-tight">Conceder Reconhecimento</h3>
          <button onClick={onClose} className="p-2 text-slate-400 dark:text-slate-600 hover:text-slate-900 dark:hover:text-white transition-colors"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        <form className="p-8 space-y-6" onSubmit={(e) => { e.preventDefault(); onGrant({ employeeId: selectedEmp, type, description, grantedBy, points: RECOGNITION_TYPES[type].points, title: RECOGNITION_TYPES[type].label, createdAt: new Date().toISOString() }); onClose(); setSelectedEmp(''); setDescription(''); }}>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">Colaborador-Alvo</label>
            <select required value={selectedEmp} onChange={e => setSelectedEmp(e.target.value)} className="w-full border-b border-slate-200 dark:border-slate-800 py-3 text-sm text-slate-900 dark:text-white font-bold outline-none focus:border-blue-600 bg-transparent italic">
              <option value="" className="dark:bg-slate-900">Selecionar Talento...</option>
              {employees.map(e => <option key={e.id} value={e.id} className="dark:bg-slate-900">{e.name} — {e.role}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">Distintivo de Honra</label>
            <div className="grid grid-cols-2 gap-3">
              {(Object.entries(RECOGNITION_TYPES) as [RecognitionType, any][]).map(([k, v]) => (
                <button key={k} type="button" onClick={() => setType(k)} className={`p-4 border text-left transition-all relative overflow-hidden group ${type === k ? 'bg-slate-900 dark:bg-blue-600 border-transparent text-white shadow-xl scale-105' : 'border-slate-100 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600'}`}>
                  <span className="text-2xl relative z-10">{v.emoji}</span>
                  <div className="relative z-10">
                    <p className={`text-[10px] font-bold uppercase italic tracking-tight mt-1 ${type === k ? 'text-white' : 'text-slate-700 dark:text-slate-300'}`}>{v.label}</p>
                    <p className={`text-[8px] font-bold ${type === k ? 'text-blue-200' : 'text-slate-400 dark:text-slate-500'}`}>+{v.points} pts</p>
                  </div>
                  {type === k && <div className="absolute top-0 right-0 w-8 h-8 bg-white/10 rotate-45 -mr-4 -mt-4"></div>}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">Manifesto de Reconhecimento</label>
            <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Descreva os feitos notáveis que motivaram esta honraria..." className="w-full border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-4 text-sm dark:text-white outline-none focus:border-blue-600 transition-all resize-none font-medium italic" />
          </div>
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600 border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 italic">Retornar</button>
            <button type="submit" disabled={!selectedEmp} className="flex-[2] py-5 bg-slate-900 dark:bg-blue-600 text-white text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-blue-700 dark:hover:bg-blue-500 transition-all shadow-[0_10px_30px_rgba(37,99,235,0.3)] disabled:opacity-50 italic">Conceder Honra</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Recognition: React.FC = () => {
  const { employees, recognitions, addRecognition, authenticatedUser } = useHR() as any;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<'todos' | RecognitionType>('todos');

  const recs = recognitions || [];
  const filtered = filterType === 'todos' ? recs : recs.filter((r: any) => r.type === filterType);

  const leaderboard = useMemo(() => {
    const byEmp: Record<string, { name: string; dept: string; points: number; count: number }> = {};
    recs.forEach((r: any) => {
      const emp = employees.find((e: any) => e.id === r.employeeId);
      if (!emp) return;
      if (!byEmp[r.employeeId]) byEmp[r.employeeId] = { name: emp.name, dept: emp.department, points: 0, count: 0 };
      byEmp[r.employeeId].points += r.points || 0;
      byEmp[r.employeeId].count++;
    });
    return Object.values(byEmp).sort((a, b) => b.points - a.points);
  }, [recs, employees]);

  return (
    <div className="space-y-8 animate-fadeIn pb-20">
      <div className="bg-slate-900 border border-slate-200 dark:border-slate-800 relative min-h-[220px] flex items-center px-10 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&q=80&w=1200" className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale" alt="Recognition" />
        <div className="relative z-10 w-full flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="animate-slideDown">
            <h1 className="text-4xl font-bold text-white tracking-tighter uppercase italic">Mural de Reconhecimento</h1>
            <p className="text-sm text-slate-400 mt-2 max-w-lg font-medium italic leading-relaxed">Cultivando a cultura de valorização Nexus. Celebre o mérito e inspire a excelência.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="px-12 py-5 bg-white text-slate-900 text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-blue-600 hover:text-white shadow-[0_15px_40px_rgba(255,255,255,0.1)] hover:shadow-[0_15px_40px_rgba(37,99,235,0.4)] transition-all duration-500 italic shrink-0 transform hover:-translate-y-1"
          >
            Conceder Honraria
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <aside className="space-y-6">
          <div className="nexus-card p-8">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.4em] italic mb-6 border-b border-slate-50 dark:border-slate-800/50 pb-4">Filtragem Estratégica</p>
            <div className="space-y-2">
              <button 
                onClick={() => setFilterType('todos')} 
                className={`w-full text-left px-5 py-4 text-[10px] font-bold uppercase italic tracking-widest transition-all shadow-sm ${filterType === 'todos' ? 'bg-slate-900 dark:bg-blue-600 text-white' : 'text-slate-400 dark:text-slate-600 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900'}`}
              >
                Todos os Atos
              </button>
              {(Object.entries(RECOGNITION_TYPES) as [RecognitionType, any][]).map(([k, v]) => (
                <button 
                  key={k} 
                  onClick={() => setFilterType(k)} 
                  className={`w-full text-left px-5 py-4 text-[10px] font-bold uppercase italic tracking-widest transition-all shadow-sm ${filterType === k ? 'bg-slate-900 dark:bg-blue-600 text-white' : 'text-slate-400 dark:text-slate-600 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900'}`}
                >
                  <span className="mr-2">{v.emoji}</span> {v.label}
                </button>
              ))}
            </div>
          </div>
          <div className="nexus-card p-8 bg-slate-900 dark:bg-slate-950 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/10 blur-3xl -mr-12 -mt-12"></div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] italic mb-6 border-b border-white/5 pb-4 relative z-10">🏆 Ranking de Mérito</p>
            {leaderboard.length === 0 ? (
              <p className="text-[10px] text-slate-500 italic text-center py-10 relative z-10">Aguardando primeiros atos de mérito...</p>
            ) : (
              <div className="space-y-6 relative z-10">
                {leaderboard.slice(0, 5).map((e, i) => (
                  <div key={e.name} className="flex items-center gap-4 py-1 border-b border-white/5 last:border-0 group">
                    <span className={`text-sm font-bold italic w-6 ${i === 0 ? 'text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]' : 'text-slate-700'}`}>{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-white uppercase italic truncate group-hover:text-blue-400 transition-colors">{e.name}</p>
                      <p className="text-[8px] font-bold text-slate-500 uppercase italic tracking-tighter">{e.count} honrarias conquistadas</p>
                    </div>
                    <span className="text-[11px] font-bold text-blue-400 italic shadow-sm">{e.points} <span className="text-[7px]">PTS</span></span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        <section className="xl:col-span-3">
          {filtered.length === 0 ? (
            <div className="nexus-card py-40 text-center flex flex-col items-center justify-center border-dashed border-2 dark:border-slate-800">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <span className="text-4xl grayscale opacity-20">🏆</span>
              </div>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.5em] italic max-w-sm leading-loose">Aguardando atos notáveis para inaugurar o mural de reconhecimentos.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filtered.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((rec: any) => {
                const emp = employees.find((e: any) => e.id === rec.employeeId);
                const grantor = employees.find((e: any) => e.id === rec.grantedBy);
                const cfg = RECOGNITION_TYPES[rec.type as RecognitionType] || RECOGNITION_TYPES.destaque_mes;
                return (
                  <div key={rec.id} className={`nexus-card transition-all duration-700 hover:scale-[1.02] shadow-xl group border-l-4 ${cfg.color} ${cfg.darkColor} p-10 relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-900/5 dark:bg-white/5 blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    <div className="flex items-start justify-between mb-8 relative z-10">
                      <div className="text-5xl drop-shadow-lg transform group-hover:rotate-12 transition-transform duration-500">{cfg.emoji}</div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold bg-slate-900 dark:bg-blue-600 text-white px-4 py-2 uppercase italic tracking-tighter shadow-lg">+{rec.points} CRÉDITOS NEXUS</span>
                        <p className="text-[8px] font-bold text-slate-300 dark:text-slate-700 uppercase italic mt-2">{new Date(rec.createdAt).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                    <div className="relative z-10">
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white uppercase italic tracking-tight mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{rec.title}</h4>
                      <p className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase italic mb-6 tracking-wide underline underline-offset-4">{emp?.name}</p>
                      <div className="bg-slate-50 dark:bg-slate-900/50 p-6 border-l-2 border-slate-200 dark:border-slate-800 italic text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                        "{rec.description}"
                      </div>
                      <div className="flex items-center gap-3 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/50">
                        <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-[10px] font-bold italic text-slate-400 uppercase">{grantor?.name?.[0] || 'R'}</div>
                        <p className="text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase italic tracking-widest">Atribuído por <span className="text-slate-900 dark:text-slate-300">{grantor?.name || 'RH Estratégico'}</span></p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <GrantModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} employees={employees} onGrant={(d) => addRecognition?.(d)} grantedBy={authenticatedUser?.id || ''} />
    </div>
  );
};

export default Recognition;
