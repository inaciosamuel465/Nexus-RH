import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useHR } from '../context/HRContext';

const KPICard: React.FC<{ title: string; value: string | number; trend?: string; subtitle?: string }> = ({ title, value, trend, subtitle }) => (
  <div className="nexus-card p-8 group hover:-translate-y-2 transition-all duration-500">
    <div>
      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em] mb-4 italic border-b border-slate-50 dark:border-slate-800 pb-2">{title}</p>
      <div className="flex items-baseline gap-3">
        <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter italic">{value}</span>
        {trend && (
          <span className={`text-[11px] font-black italic ${trend.startsWith('+') ? 'text-blue-600 dark:text-blue-400' : 'text-emerald-500 dark:text-emerald-400'}`}>
            {trend}
          </span>
        )}
      </div>
    </div>
    {subtitle && <p className="text-[9px] text-slate-500 dark:text-slate-700 mt-6 font-bold uppercase tracking-[0.2em] italic">{subtitle}</p>}
  </div>
);

const Dashboard: React.FC = () => {
  const { employees } = useHR();

  const metrics = useMemo(() => {
    const total = employees.length;
    const totalPayroll = employees.reduce((acc, curr) => acc + curr.salary, 0);
    const activeCount = employees.filter(e => e.status === 'Ativo').length;
    return { total, totalPayroll, turnover: 2.4, absentRate: 4.8, activeCount };
  }, [employees]);

  const departmentData = useMemo(() => {
    const counts: Record<string, number> = {};
    employees.forEach(e => counts[e.department] = (counts[e.department] || 0) + 1);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [employees]);

  const COLORS = ['#2563eb', '#1e293b', '#64748b', '#94a3b8', '#cbd5e1'];

  return (
    <div className="space-y-8 animate-fadeIn pb-20">
      <div className="bg-slate-900 border border-slate-200 dark:border-slate-800 relative min-h-[260px] flex items-center px-12 overflow-hidden shadow-2xl">
         <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" 
            className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale"
            alt="Office"
         />
         <div className="relative z-10 max-w-3xl animate-slideDown">
            <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase mb-4 leading-none">Capital Intellect</h1>
            <p className="text-slate-400 text-sm font-bold leading-relaxed italic max-w-xl uppercase tracking-widest opacity-80">
               Navegação analítica da rede neural corporativa. Telemetria de KPIs, evolução financeira e pulso organizacional em tempo real.
            </p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <KPICard title="Headcount Global" value={metrics.total} trend="+12" subtitle="Ingressos Sincronizados" />
        <KPICard title="Retenção (Stasis)" value={`${metrics.turnover}%`} trend="-0.4" subtitle="Fluxo de Estabilidade" />
        <KPICard title="Provisão Mensal" value={`R$ ${(metrics.totalPayroll / 1000).toFixed(0)}k`} trend="+5%" subtitle="Impacto On-Chain" />
        <KPICard title="Bio-Absenteísmo" value={`${metrics.absentRate}%`} trend="+0.2" subtitle="Nível de Presença" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 nexus-card p-12 flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 -mr-32 -mt-32 rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
          <div className="flex items-center justify-between mb-16 relative z-10">
             <div className="flex items-center gap-6">
                <div className="w-3 h-3 bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
                <h3 className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-[0.4em] italic">Telemetria de Fluxo Financeiro</h3>
             </div>
             <div className="flex items-center gap-8 text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em] italic">
                <span className="flex items-center gap-3"><div className="w-2.5 h-2.5 bg-blue-600"></div> Realizado</span>
                <span className="flex items-center gap-3"><div className="w-2.5 h-2.5 bg-slate-100 dark:bg-slate-800"></div> Projeção Nexus</span>
             </div>
          </div>
          <div className="h-96 flex-1 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { m: 'Jan', v: 42000 }, { m: 'Fev', v: 45000 }, { m: 'Mar', v: 48000 },
                { m: 'Abr', v: 47000 }, { m: 'Mai', v: 52000 }, { m: 'Jun', v: metrics.totalPayroll }
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:opacity-5" />
                <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: '900', letterSpacing: '0.1em'}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: '900'}} dx={-15} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '0px', padding: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
                   labelStyle={{ fontWeight: '900', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '10px', color: '#64748b', fontStyle: 'italic' }}
                   itemStyle={{ color: '#fff', fontWeight: '900', fontSize: '14px', letterSpacing: '-0.02em', fontStyle: 'italic' }}
                   cursor={{ stroke: '#2563eb', strokeWidth: 1 }}
                />
                <Area type="monotone" dataKey="v" stroke="#2563eb" strokeWidth={5} fillOpacity={0.1} fill="#2563eb" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="nexus-card p-12 flex flex-col h-[580px] relative overflow-hidden group">
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-slate-100 dark:bg-slate-900 -ml-24 -mb-24 rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
          <div className="flex items-center gap-6 border-b border-slate-50 dark:border-slate-800 pb-6 mb-10 relative z-10">
             <div className="w-3 h-3 bg-slate-900 dark:bg-white shadow-[0_0_10px_rgba(0,0,0,0.3)]"></div>
             <h3 className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-[0.4em] italic">Arquitetura de Unidades</h3>
          </div>
          <div className="h-72 flex items-center justify-center relative z-10">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                   <Pie 
                     data={departmentData} 
                     cx="50%" 
                     cy="50%" 
                     innerRadius={80} 
                     outerRadius={105} 
                     paddingAngle={4} 
                     dataKey="value"
                     stroke="transparent"
                   >
                      {departmentData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                   </Pie>
                   <Tooltip />
                </PieChart>
             </ResponsiveContainer>
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic leading-none">{metrics.total}</span>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.4em] italic mt-2">Entities</span>
             </div>
          </div>
          <div className="mt-12 space-y-6 flex-1 overflow-y-auto pr-4 custom-scrollbar border-t border-slate-50 dark:border-slate-800 pt-8 relative z-10">
             {departmentData.map((d, i) => (
                <div key={d.name} className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-700 italic group cursor-default hover:translate-x-3 transition-transform duration-500">
                   <div className="flex items-center gap-4">
                      <div className="w-3 h-3 shadow-lg" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                      <span className="truncate max-w-[160px] group-hover:text-slate-900 dark:group-hover:text-white transition-colors uppercase tracking-[0.2em]">{d.name}</span>
                   </div>
                   <span className="text-slate-900 dark:text-white font-black italic">{d.value}</span>
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
