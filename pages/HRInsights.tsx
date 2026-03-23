import React, { useMemo } from 'react';
import { useHR } from '../context/HRContext';

interface InsightAlert {
  id: string;
  type: 'risco' | 'atencao' | 'positivo';
  category: string;
  employeeId: string;
  employeeName: string;
  message: string;
  score: number;
}

const HRInsights: React.FC = () => {
  const { employees, evaluations, timeRecords } = useHR();

  const insights = useMemo<InsightAlert[]>(() => {
    const alerts: InsightAlert[] = [];

    employees.forEach(emp => {
      const hireDate = new Date(emp.hireDate);
      const yearsInCompany = (Date.now() - hireDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
      const hasRecentEval = evaluations.some(e => e.employeeId === emp.id && e.status === 'Finalizada');
      const lowSalary = emp.salary < 3500;

      if (yearsInCompany > 1.5 && !hasRecentEval && lowSalary) {
        alerts.push({ id: `turn-${emp.id}`, type: 'risco', category: 'Risco de Turnover', employeeId: emp.id, employeeName: emp.name, message: `Sem avaliação há +1 ano, salário abaixo do mercado e ${Math.floor(yearsInCompany)}a de empresa.`, score: Math.round(yearsInCompany * 30 + (lowSalary ? 40 : 0)) });
      }

      const thirtyDaysAgo = new Date(Date.now() - 30*24*60*60*1000).toISOString().split('T')[0];
      const recentAbsences = timeRecords.filter(tr => tr.employeeId === emp.id && tr.date >= thirtyDaysAgo && tr.status === 'Abonado').length;
      if (recentAbsences >= 2) {
        alerts.push({ id: `abs-${emp.id}`, type: 'atencao', category: 'Absenteísmo Elevado', employeeId: emp.id, employeeName: emp.name, message: `${recentAbsences} ausências registradas nos últimos 30 dias. Possível sinal de baixo engajamento.`, score: recentAbsences * 20 });
      }

      const bestEval = evaluations.filter(e => e.employeeId === emp.id).sort((a, b) => b.performanceScore - a.performanceScore)[0];
      if (bestEval && bestEval.performanceScore >= 8 && bestEval.potentialScore >= 7) {
        alerts.push({ id: `perf-${emp.id}`, type: 'positivo', category: 'Alta Performance', employeeId: emp.id, employeeName: emp.name, message: `Score de desempenho ${bestEval.performanceScore}/10 e potencial ${bestEval.potentialScore}/10. Candidato a aceleração de carreira.`, score: bestEval.performanceScore * 10 });
      }

      if (emp.vacationBalance && emp.vacationBalance <= 0) {
        alerts.push({ id: `vac-${emp.id}`, type: 'atencao', category: 'Férias Vencidas', employeeId: emp.id, employeeName: emp.name, message: `Saldo de férias zerado. Risco de passivo trabalhista.`, score: 60 });
      }
    });

    return alerts.sort((a, b) => (a.type === 'risco' ? -1 : a.type === 'atencao' ? 0 : 1) - (b.type === 'risco' ? -1 : b.type === 'atencao' ? 0 : 1));
  }, [employees, evaluations, timeRecords]);

  const stats = useMemo(() => ({
    risks: insights.filter(i => i.type === 'risco').length,
    warnings: insights.filter(i => i.type === 'atencao').length,
    positives: insights.filter(i => i.type === 'positivo').length,
  }), [insights]);

  const typeConfig = { 
    risco: { bg: 'bg-red-50 dark:bg-red-950/20', border: 'border-red-200 dark:border-red-900/50', badge: 'bg-red-600', label: 'RISCO CRÍTICO', dot: 'bg-red-500' }, 
    atencao: { bg: 'bg-amber-50 dark:bg-amber-950/20', border: 'border-amber-200 dark:border-amber-900/50', badge: 'bg-amber-500', label: 'ATENÇÃO', dot: 'bg-amber-500' }, 
    positivo: { bg: 'bg-emerald-50 dark:bg-emerald-950/20', border: 'border-emerald-200 dark:border-emerald-900/50', badge: 'bg-emerald-600', label: 'POSITIVO', dot: 'bg-emerald-500' } 
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-20">
      <div className="bg-slate-900 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 relative min-h-[200px] flex items-center px-10 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200" className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale" alt="Insights" />
        <div className="relative z-10 w-full flex flex-col lg:flex-row justify-between items-center gap-8">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tighter uppercase italic">Insights de RH + IA</h1>
            <p className="text-sm text-slate-400 mt-2 max-w-lg font-medium italic">Análise automática de dados do sistema. Alertas proativos de risco, performance e oportunidades de gestão.</p>
          </div>
          <div className="flex gap-6">
            {[{ label: 'Riscos', val: stats.risks, color: 'text-red-400' }, { label: 'Atenções', val: stats.warnings, color: 'text-amber-400' }, { label: 'Destaques', val: stats.positives, color: 'text-emerald-400' }].map(s => (
              <div key={s.label} className="text-center bg-white/5 border border-white/10 px-6 py-4">
                <p className={`text-3xl font-bold italic ${s.color}`}>{s.val}</p>
                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest italic mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[{ key: 'risco', label: 'Riscos Críticos', desc: 'Colaboradores com alto risco de saída ou impacto operacional' }, { key: 'atencao', label: 'Pontos de Atenção', desc: 'Situações que requerem acompanhamento proativo do RH' }, { key: 'positivo', label: 'Destaques Positivos', desc: 'Colaboradores com indicadores excepcionais de performance' }].map(section => (
          <div key={section.key} className="nexus-card p-0 overflow-hidden">
            <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center gap-3 bg-white dark:bg-slate-950">
              <div className={`w-2 h-2 ${typeConfig[section.key as keyof typeof typeConfig].dot}`}></div>
              <div>
                <h3 className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest italic">{section.label}</h3>
                <p className="text-[8px] text-slate-400 dark:text-slate-600 font-medium italic mt-0.5">{section.desc}</p>
              </div>
            </div>
            <div className="divide-y divide-slate-50 dark:divide-slate-800 max-h-[500px] overflow-y-auto custom-scrollbar">
              {insights.filter(i => i.type === section.key).map(alert => {
                const cfg = typeConfig[alert.type];
                return (
                  <div key={alert.id} className={`p-5 ${cfg.bg} border-l-4 ${cfg.border} transition-all hover:brightness-95 dark:hover:brightness-110`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-[10px] font-bold text-slate-900 dark:text-white uppercase italic tracking-tight">{alert.employeeName}</p>
                        <p className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest italic mt-0.5">{alert.category}</p>
                      </div>
                      <span className={`text-[7px] font-bold text-white px-2 py-0.5 uppercase italic ${cfg.badge}`}>{cfg.label}</span>
                    </div>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium italic">{alert.message}</p>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="flex-1 h-1 bg-slate-200 dark:bg-slate-800">
                        <div className="h-full bg-slate-900 dark:bg-blue-600" style={{ width: `${Math.min(alert.score, 100)}%` }}></div>
                      </div>
                      <span className="text-[8px] font-bold text-slate-400 dark:text-slate-600 italic">{Math.min(alert.score, 100)}%</span>
                    </div>
                  </div>
                );
              })}
              {insights.filter(i => i.type === section.key).length === 0 && (
                <div className="p-10 text-center bg-white dark:bg-slate-950">
                  <p className="text-[9px] font-bold text-slate-300 dark:text-slate-700 uppercase tracking-widest italic">Nenhum alerta nesta categoria</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="nexus-card">
        <div className="flex items-center gap-4 mb-8 border-b border-slate-50 dark:border-slate-800 pb-6">
          <div className="w-1.5 h-1.5 bg-blue-600"></div>
          <h3 className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest italic">Análise Consolidada de Ativos</h3>
          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-600 italic">({insights.length} indicadores ativos)</span>
        </div>
        <div className="space-y-2">
          {insights.map(alert => {
            const cfg = typeConfig[alert.type];
            return (
              <div key={alert.id} className={`flex items-center justify-between p-4 border ${cfg.border} ${cfg.bg} group hover:shadow-xl transition-all`}>
                <div className="flex items-center gap-4">
                  <div className={`w-1.5 h-1.5 ${cfg.dot} shrink-0`}></div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-900 dark:text-white uppercase italic tracking-tight">{alert.employeeName}</span>
                    <span className="text-[8px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest italic ml-4">• {alert.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium italic hidden lg:block max-w-[300px] truncate">{alert.message}</span>
                  <span className={`text-[7px] font-bold text-white px-2 py-0.5 uppercase italic ${cfg.badge}`}>{cfg.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HRInsights;
