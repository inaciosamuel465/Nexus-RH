import React, { useState, useMemo } from 'react';
import { useHR } from '../context/HRContext';
import { AutomationRule, AutomationTrigger, AutomationAction } from '../types';

const TRIGGER_LABELS: Record<AutomationTrigger, string> = {
  ferias_vencidas: 'Férias Vencidas',
  excesso_faltas: 'Excesso de Faltas',
  avaliacao_vencida: 'Avaliação Vencida',
  aniversario: 'Aniversário de Empresa',
  risco_turnover: 'Risco de Turnover',
};

const ACTION_LABELS: Record<AutomationAction, { label: string; icon: string }> = {
  alerta_rh: { label: 'Alerta no Dashboard RH', icon: '🔔' },
  email_gestor: { label: 'Notificar Gestor', icon: '📧' },
  notificacao_sistema: { label: 'Notificação no Sistema', icon: '💻' },
  sugestao_pip: { label: 'Sugerir PIP ao RH', icon: '📝' },
};

const DEFAULT_RULES: AutomationRule[] = [
  { id: 'ar1', name: 'Alerta de Férias Vencidas', trigger: 'ferias_vencidas', action: 'alerta_rh', active: true, lastRun: '2024-11-10', executionCount: 7 },
  { id: 'ar2', name: 'Monitor de Absenteísmo', trigger: 'excesso_faltas', action: 'email_gestor', active: true, lastRun: '2024-11-09', executionCount: 3, threshold: 3 },
  { id: 'ar3', name: 'Ciclo de Avaliações Vencidas', trigger: 'avaliacao_vencida', action: 'notificacao_sistema', active: false, executionCount: 0 },
  { id: 'ar4', name: 'Aniversariantes da Semana', trigger: 'aniversario', action: 'notificacao_sistema', active: true, lastRun: '2024-11-08', executionCount: 24 },
  { id: 'ar5', name: 'Detector de Risco de Turnover', trigger: 'risco_turnover', action: 'alerta_rh', active: true, lastRun: '2024-11-10', executionCount: 2 },
  { id: 'ar6', name: 'Protocolo de PIP Automático', trigger: 'excesso_faltas', action: 'sugestao_pip', active: false, executionCount: 0, threshold: 5 },
];

const MOCK_LOGS = [
  { id: 'l1', ruleId: 'ar1', employeeId: '', executedAt: '2024-11-10T09:00:00', message: '3 colaboradores com saldo de férias zerado identificados.' },
  { id: 'l2', ruleId: 'ar2', employeeId: '', executedAt: '2024-11-09T08:30:00', message: 'Gestor de TI notificado: Carlos Lima com 4 faltas no mês.' },
  { id: 'l3', ruleId: 'ar4', employeeId: '', executedAt: '2024-11-08T07:00:00', message: '2 aniversariantes de empresa detectados para essa semana.' },
  { id: 'l4', ruleId: 'ar5', employeeId: '', executedAt: '2024-11-10T10:15:00', message: '1 colaborador com indicadores de risco elevado de turnover.' },
];

const Automations: React.FC = () => {
  const { employees } = useHR();
  const [rules, setRules] = useState<AutomationRule[]>(DEFAULT_RULES);
  const [runningId, setRunningId] = useState<string | null>(null);
  const [executionLogs, setExecutionLogs] = useState(MOCK_LOGS);

  const toggleRule = (id: string) => setRules(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));

  const runRule = async (rule: AutomationRule) => {
    setRunningId(rule.id);
    await new Promise(r => setTimeout(r, 1500));
    const now = new Date().toISOString();
    setRules(prev => prev.map(r => r.id === rule.id ? { ...r, lastRun: now.split('T')[0], executionCount: r.executionCount + 1 } : r));
    setExecutionLogs(prev => [{
      id: `l-${Date.now()}`, ruleId: rule.id, employeeId: '', executedAt: now,
      message: `Regra "${rule.name}" executada manualmente. ${Math.floor(Math.random() * 3) + 1} colaboradores afetados.`
    }, ...prev]);
    setRunningId(null);
  };

  const stats = { active: rules.filter(r => r.active).length, total: rules.length, executions: rules.reduce((a, r) => a + r.executionCount, 0) };

  return (
    <div className="space-y-8 animate-fadeIn pb-20">
      <div className="bg-slate-900 border border-slate-200 dark:border-slate-800 relative min-h-[220px] flex items-center px-10 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200" className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale" alt="Automations" />
        <div className="relative z-10 w-full flex flex-col lg:flex-row justify-between items-center gap-8">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tighter uppercase italic">Engenharia de Automação</h1>
            <p className="text-sm text-slate-400 mt-2 max-w-lg italic font-medium leading-relaxed">Orquestrando fluxos inteligentes para uma gestão de talentos proativa e sem atritos.</p>
          </div>
          <div className="flex gap-4">
            {[{ label: 'Fluxos Ativos', val: stats.active }, { label: 'Ações Totais', val: stats.executions }].map(s => (
              <div key={s.label} className="bg-white/5 backdrop-blur-sm border border-white/10 px-8 py-5 text-center min-w-[140px] shadow-2xl">
                <p className="text-4xl font-bold text-white italic tracking-tighter">{s.val}</p>
                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest italic mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.4em] italic pl-4 border-l-2 border-slate-900 dark:border-blue-600 mb-6">Políticas de Automação</h3>
          <div className="space-y-4">
            {rules.map(rule => (
              <div key={rule.id} className={`nexus-card transition-all duration-500 relative overflow-hidden ${rule.active ? 'border-l-4 border-l-blue-600 dark:border-l-blue-400' : 'opacity-60 grayscale-[0.5]'}`}>
                <div className="p-8 flex items-center gap-8">
                  <div className="flex flex-col items-center gap-3 shrink-0">
                    <button 
                      onClick={() => toggleRule(rule.id)} 
                      className={`w-14 h-7 rounded-none relative transition-all duration-300 shadow-inner ${rule.active ? 'bg-slate-900 dark:bg-blue-600' : 'bg-slate-200 dark:bg-slate-800'}`}
                    >
                      <div className={`w-5 h-5 bg-white shadow-lg absolute top-1 transition-all duration-500 ${rule.active ? 'left-8' : 'left-1'}`}></div>
                    </button>
                    <span className={`text-[8px] font-bold uppercase italic tracking-tighter ${rule.active ? 'text-blue-600' : 'text-slate-400'}`}>{rule.active ? 'Ativado' : 'Inativo'}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-4 mb-3">
                      <h4 className="text-base font-bold text-slate-900 dark:text-white uppercase italic tracking-tight">{rule.name}</h4>
                      {rule.threshold && <span className="text-[8px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 px-3 py-1 uppercase italic shadow-sm">Critério: {rule.threshold}</span>}
                    </div>
                    <div className="flex gap-6 flex-wrap items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase italic">Gatilho:</span>
                        <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 uppercase italic bg-slate-100 dark:bg-slate-800 px-2 py-0.5">{TRIGGER_LABELS[rule.trigger]}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase italic">Ação Nexus:</span>
                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase italic flex items-center gap-1">
                          {ACTION_LABELS[rule.action].icon} {ACTION_LABELS[rule.action].label}
                        </span>
                      </div>
                      <div className="h-4 w-px bg-slate-100 dark:bg-slate-800"></div>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase italic tracking-widest">{rule.executionCount} Execuções Efetuadas</span>
                    </div>
                    {rule.lastRun && (
                      <div className="flex items-center gap-2 mt-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase italic">Último Checkpoint: {new Date(rule.lastRun).toLocaleDateString('pt-BR')}</p>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={() => runRule(rule)} 
                    disabled={!rule.active || runningId === rule.id} 
                    className="px-8 py-4 bg-slate-900 dark:bg-blue-600/10 dark:text-blue-400 border dark:border-blue-400/20 text-white text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-blue-600 dark:hover:bg-blue-600 dark:hover:text-white transition-all duration-300 disabled:opacity-20 italic shrink-0 group"
                  >
                    {runningId === rule.id ? (
                      <span className="flex items-center gap-3">
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Processando...
                      </span>
                    ) : (
                      <span className="group-hover:tracking-[0.3em] transition-all">Forçar Execução</span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="nexus-card p-0 overflow-hidden bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
              <h4 className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-[0.3em] italic">Diário de Operações</h4>
              <p className="text-[8px] text-slate-400 uppercase italic mt-1 font-bold">Monitoramento de triggers em tempo real</p>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[600px] overflow-y-auto no-scrollbar">
              {executionLogs.map(log => {
                const rule = rules.find(r => r.id === log.ruleId);
                return (
                  <div key={log.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 shadow-[0_0_8px_rgba(37,99,235,0.5)]"></div>
                        <p className="text-[10px] font-bold text-slate-900 dark:text-white uppercase italic tracking-tight truncate max-w-[150px]">{rule?.name}</p>
                      </div>
                      <span className="text-[8px] font-bold text-slate-300 dark:text-slate-600 uppercase italic">{new Date(log.executedAt).toLocaleTimeString('pt-BR')}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium italic border-l border-slate-200 dark:border-slate-800 pl-4 py-1">
                      {log.message}
                    </p>
                    <p className="text-[9px] font-bold text-slate-300 dark:text-slate-700 uppercase italic mt-3 text-right group-hover:text-blue-600 transition-colors">
                      Status: Sucesso
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Automations;
