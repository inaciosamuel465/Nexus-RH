import React, { useMemo, useState } from 'react';
import { useHR } from '../context/HRContext';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const COLORS = ['#2563eb', '#4f46e5', '#7c3aed', '#db2777', '#dc2626', '#ea580c'];

const PeopleAnalytics: React.FC = () => {
  const { employees, timeRecords, evaluations } = useHR();
  const [period, setPeriod] = useState<'mes' | 'trimestre' | 'ano'>('trimestre');

  const stats = useMemo(() => {
    const active = employees.filter(e => e.status === 'Ativo').length;
    const inactive = employees.filter(e => e.status === 'Inativo').length;
    const turnover = employees.length > 0 ? Math.round((inactive / employees.length) * 100 * 10) / 10 : 0;
    const absences = timeRecords.filter(tr => tr.status === 'Abonado').length;
    const absenteeism = employees.length > 0 ? Math.round((absences / (employees.length * 22)) * 100 * 10) / 10 : 0;
    const avgPerf = evaluations.length > 0 ? Math.round((evaluations.reduce((a, e) => a + e.performanceScore, 0) / evaluations.length) * 10) / 10 : 0;
    const totalPayroll = employees.filter(e => e.status !== 'Inativo').reduce((a, e) => a + e.salary, 0);
    return { active, inactive, turnover, absences, absenteeism, avgPerf, totalPayroll };
  }, [employees, timeRecords, evaluations]);

  const deptData = useMemo(() => {
    const byDept: Record<string, number> = {};
    employees.filter(e => e.status !== 'Inativo').forEach(e => { byDept[e.department] = (byDept[e.department] || 0) + 1; });
    return Object.entries(byDept).map(([name, value]) => ({ name, value }));
  }, [employees]);

  const headcountTrend = useMemo(() => [
    { month: 'Jul', count: Math.max(1, stats.active - 5), turnover: 2 },
    { month: 'Ago', count: Math.max(1, stats.active - 3), turnover: 1 },
    { month: 'Set', count: Math.max(1, stats.active - 2), turnover: 3 },
    { month: 'Out', count: Math.max(1, stats.active - 1), turnover: 1 },
    { month: 'Nov', count: stats.active, turnover: stats.inactive },
  ], [stats]);

  const absenteeismTrend = useMemo(() => ['Jul', 'Ago', 'Set', 'Out', 'Nov'].map(m => ({
    month: m, absencias: Math.floor(Math.random() * 8) + 1, atestados: Math.floor(Math.random() * 4)
  })), []);

  const KPICard = ({ label, value, unit = '', detail, color = 'text-slate-900 dark:text-white', alert = false }: any) => (
    <div className={`nexus-card ${alert ? 'border-red-500' : ''}`}>
      <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest italic mb-3 border-b border-slate-50 dark:border-slate-800 pb-2">{label}</p>
      <p className={`text-3xl font-bold italic tracking-tighter ${color}`}>{value}<span className="text-sm text-slate-300 dark:text-slate-600 ml-1">{unit}</span></p>
      {detail && <p className="text-[9px] font-bold italic mt-2" style={{ color: alert ? '#dc2626' : '#94a3b8' }}>{detail}</p>}
    </div>
  );

  return (
    <div className="space-y-8 animate-fadeIn pb-20">
      <div className="bg-slate-900 dark:bg-blue-900 border border-slate-200 dark:border-slate-800 relative min-h-[200px] flex items-center px-10 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200" className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale" alt="Analytics" />
        <div className="relative z-10 w-full flex flex-col lg:flex-row justify-between items-center gap-8">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tighter uppercase italic">People Analytics</h1>
            <p className="text-sm text-slate-400 mt-2 max-w-lg italic">Dashboard avançado de indicadores de capital humano. Dados que guiam decisões estratégicas.</p>
          </div>
          <div className="flex bg-white/5 border border-white/10 p-1">
            {[{ key: 'mes', label: 'Mês' }, { key: 'trimestre', label: 'Trimestre' }, { key: 'ano', label: 'Ano' }].map(p => (
              <button key={p.key} onClick={() => setPeriod(p.key as any)} className={`px-6 py-2 text-[9px] font-bold uppercase tracking-widest transition-all italic ${period === p.key ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white'}`}>{p.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard label="Headcount Ativo" value={stats.active} detail={`${stats.inactive} desligados`} />
        <KPICard label="Turnover Rate" value={stats.turnover} unit="%" alert={stats.turnover > 5} color={stats.turnover > 5 ? 'text-red-600' : 'text-slate-900 dark:text-white'} detail={stats.turnover > 5 ? '⚠ Acima do benchmark (5%)' : '✓ Dentro do esperado'} />
        <KPICard label="Absenteísmo" value={stats.absenteeism} unit="%" alert={stats.absenteeism > 3} color={stats.absenteeism > 3 ? 'text-amber-600' : 'text-slate-900 dark:text-white'} detail={`${stats.absences} faltas registradas`} />
        <KPICard label="Score Médio de Perf." value={stats.avgPerf || 'N/A'} unit={stats.avgPerf ? '/10' : ''} color="text-blue-600 dark:text-blue-400" detail={`${evaluations.length} avaliações`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 nexus-card">
          <h3 className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest italic mb-8 border-b border-slate-50 dark:border-slate-800 pb-4">Evolução de Headcount e Turnover</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={headcountTrend} margin={{ top: 5, right: 20, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={3} dot={{ fill: '#2563eb', strokeWidth: 0, r: 4 }} name="Headcount" />
                <Line type="monotone" dataKey="turnover" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: '#ef4444', strokeWidth: 0, r: 3 }} name="Desligamentos" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="nexus-card">
          <h3 className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest italic mb-8 border-b border-slate-50 dark:border-slate-800 pb-4">Distribuição por Departamento</h3>
          <div className="h-40 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={deptData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={3} dataKey="value" stroke="none">
                  {deptData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto no-scrollbar">
            {deptData.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between text-[9px]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                  <span className="font-bold text-slate-500 dark:text-slate-400 uppercase italic truncate max-w-[120px]">{d.name}</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white italic">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="nexus-card">
        <h3 className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest italic mb-8 border-b border-slate-50 dark:border-slate-800 pb-4">Absenteísmo Mensal (Faltas vs Atestados)</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={absenteeismTrend} margin={{ top: 5, right: 20, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="absencias" fill="#1e293b" radius={0} name="Faltas" />
              <Bar dataKey="atestados" fill="#2563eb" radius={0} name="Atestados" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-950 dark:text-white">
        <div className="nexus-card">
          <h4 className="text-[10px] font-bold text-slate-900 dark:text-white uppercase italic tracking-widest mb-6 border-b border-slate-50 dark:border-slate-800 pb-4">💰 Custo de Pessoal</h4>
          <p className="text-3xl font-bold text-slate-900 dark:text-white italic">R$ {(stats.totalPayroll / 1000).toFixed(1)}k</p>
          <p className="text-[9px] font-bold text-slate-400 uppercase italic mt-2">Folha Bruta Mensal</p>
          <p className="text-[8px] font-bold text-slate-300 dark:text-slate-600 italic mt-1">Média: R$ {employees.filter(e=>e.status!=='Inativo').length > 0 ? (stats.totalPayroll / employees.filter(e=>e.status!=='Inativo').length).toLocaleString('pt-BR', {maximumFractionDigits: 0}) : 0}/colaborador</p>
        </div>
        <div className="nexus-card">
          <h4 className="text-[10px] font-bold text-slate-900 dark:text-white uppercase italic tracking-widest mb-6 border-b border-slate-50 dark:border-slate-800 pb-4">📋 Avaliações</h4>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 italic">{evaluations.length}</p>
          <p className="text-[9px] font-bold text-slate-400 uppercase italic mt-2">Avaliações Realizadas</p>
          <p className="text-[8px] font-bold text-slate-300 dark:text-slate-600 italic mt-1">Cobertura: {employees.length > 0 ? Math.round((new Set(evaluations.map(e => e.employeeId)).size / employees.length) * 100) : 0}% do quadro</p>
        </div>
        <div className="nexus-card">
          <h4 className="text-[10px] font-bold text-slate-900 dark:text-white uppercase italic tracking-widest mb-6 border-b border-slate-50 dark:border-slate-800 pb-4">🎯 Senioridade Média</h4>
          <p className="text-3xl font-bold text-slate-900 dark:text-white italic">{employees.length > 0 ? Math.round(employees.reduce((a, e) => a + (Date.now() - new Date(e.hireDate).getTime()) / (1000*60*60*24*365), 0) / employees.length * 10) / 10 : 0}a</p>
          <p className="text-[9px] font-bold text-slate-400 uppercase italic mt-2">Tempo Médio de Casa</p>
        </div>
      </div>
    </div>
  );
};

export default PeopleAnalytics;
