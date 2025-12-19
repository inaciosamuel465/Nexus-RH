
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { useHR } from '../context/HRContext';

const KPICard: React.FC<{ title: string; value: string | number; trend?: string; color: string; subtitle?: string }> = ({ title, value, trend, color, subtitle }) => (
  <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-gray-100 transition-all hover:shadow-xl group">
    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">{title}</h3>
    <div className="flex items-baseline gap-2 flex-wrap">
      <span className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter italic">{value}</span>
      {trend && <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${trend.startsWith('+') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{trend}</span>}
    </div>
    {subtitle && <p className="text-[9px] md:text-[10px] font-bold text-gray-500 mt-1 uppercase tracking-tighter">{subtitle}</p>}
    <div className="mt-6 h-1 w-full bg-gray-50 rounded-full overflow-hidden">
      <div className={`h-full ${color} transition-all duration-1000`} style={{ width: '70%' }}></div>
    </div>
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

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <div className="space-y-6 md:space-y-10 animate-fadeIn pb-12">
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl md:rounded-3xl flex items-center justify-center text-white shadow-xl">
             <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          </div>
          <div>
            <h2 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tighter italic uppercase leading-none">Estratégia Nexus</h2>
            <p className="text-xs md:text-sm text-gray-500 font-medium mt-1">BI e Análise de Capital Humano.</p>
          </div>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl w-full xl:w-auto">
          <button className="flex-1 px-4 md:px-6 py-3 bg-white text-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm">Geral</button>
          <button className="flex-1 px-4 md:px-6 py-3 text-gray-400 rounded-lg text-[9px] font-black uppercase tracking-widest">Equipe</button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        <KPICard title="Headcount" value={metrics.total} trend="+12%" color="bg-indigo-600" subtitle={`${metrics.activeCount} Ativos`} />
        <KPICard title="Turnover" value={`${metrics.turnover}%`} trend="-0.4%" color="bg-emerald-500" subtitle="Rotatividade" />
        <KPICard title="Folha" value={`R$ ${(metrics.totalPayroll / 1000).toFixed(0)}k`} trend="+5%" color="bg-indigo-900" subtitle="Desembolso" />
        <KPICard title="Absenteísmo" value={`${metrics.absentRate}%`} trend="+0.2%" color="bg-orange-500" subtitle="Frequência" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
        <div className="lg:col-span-2 bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[4rem] shadow-sm border border-gray-100">
          <h3 className="text-lg md:text-xl font-black text-gray-900 uppercase tracking-tighter italic mb-8">Evolução de Custos</h3>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { m: 'Jan', v: 42000 }, { m: 'Fev', v: 45000 }, { m: 'Mar', v: 48000 },
                { m: 'Abr', v: 47000 }, { m: 'Mai', v: 52000 }, { m: 'Jun', v: metrics.totalPayroll }
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 'bold'}} />
                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="v" stroke="#4F46E5" strokeWidth={3} fill="#4F46E520" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-950 p-8 md:p-10 rounded-[2.5rem] md:rounded-[4rem] text-white flex flex-col justify-between shadow-2xl relative overflow-hidden">
           <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2 italic">Força de Trabalho</h4>
              <p className="text-gray-500 text-[10px] font-medium">Por departamento estratégico.</p>
           </div>
           <div className="h-48 md:h-56 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie data={departmentData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={5} dataKey="value">
                       {departmentData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                 </PieChart>
              </ResponsiveContainer>
           </div>
           <div className="space-y-2 mt-4">
              {departmentData.map((d, i) => (
                <div key={d.name} className="flex items-center justify-between text-[9px] font-black uppercase tracking-tighter">
                   <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                      <span className="text-gray-300 truncate max-w-[120px]">{d.name}</span>
                   </div>
                   <span>{d.value}</span>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
