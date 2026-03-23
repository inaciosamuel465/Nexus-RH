import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useHR } from '../context/HRContext';
import { Employee } from '../types';

const LevelBadge: React.FC<{ level: number }> = ({ level }) => {
  const labels = ['Diretoria', 'Gestão Alpha', 'Operacional', 'Staff'];
  const colors = [
    'bg-slate-900 text-white border-slate-900',
    'bg-blue-50 border-blue-100 text-blue-600',
    'bg-slate-50 border-slate-200 text-slate-400',
    'bg-slate-50 border-slate-100 text-slate-300'
  ];
  const idx = Math.min(level, labels.length - 1);
  return (
    <span className={`px-2 py-0.5 border text-[7px] font-bold uppercase tracking-widest italic ${colors[idx]}`}>
      {labels[idx]}
    </span>
  );
};

const EmployeeNode: React.FC<{ 
  employee: Employee; 
  level: number;
  children?: React.ReactNode; 
  highlight?: boolean;
  isFocused?: boolean;
}> = ({ employee, level, children, highlight, isFocused }) => {
  const isCLevel = level === 0;

  return (
    <div className={`flex flex-col items-center flex-shrink-0 transition-all duration-700 ${isFocused ? 'opacity-100 scale-100' : 'opacity-20 grayscale scale-95'} hover:opacity-100 hover:grayscale-0 hover:scale-100 relative`}>
      <div className="relative p-6">
        <Link to={`/employee/${employee.id}`} className="block relative z-10">
          <div className={`
            w-72 p-6 border transition-all duration-500 bg-white
            ${isCLevel ? 'border-slate-900 shadow-xl' : 'border-slate-200 shadow-sm'}
            ${highlight ? 'ring-2 ring-blue-600 border-blue-600' : ''}
            group hover:border-slate-900 hover:-translate-y-2
          `}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <LevelBadge level={level} />
                <span className="font-mono text-[8px] font-bold text-slate-300 uppercase">MAT: {employee.registration}</span>
            </div>

            <div className="flex items-center gap-4">
              <div className={`
                w-12 h-12 flex items-center justify-center font-bold text-sm transition-all
                ${isCLevel ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400 border border-slate-200'}
              `}>
                {employee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-sm font-bold text-slate-900 tracking-tight truncate uppercase italic">
                  {employee.name}
                </p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate mt-0.5">
                  {employee.role}
                </p>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center text-[8px] font-bold uppercase tracking-widest">
              <span className="text-blue-600 italic">{employee.department}</span>
              <div className="flex items-center gap-2">
                 <div className={`w-1.5 h-1.5 rounded-full ${employee.status === 'Ativo' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                 <span className="text-slate-300">Sincronizado</span>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {children && (
        <div className="relative flex flex-col items-center w-full">
          <div className="w-px h-16 bg-slate-200"></div>
          <div className="flex gap-12 items-start relative pt-6 px-12">
            {/* Connector Beam */}
            <div className="absolute top-0 left-0 right-0 h-px bg-slate-200 mx-auto" style={{ width: 'calc(100% - 100px)' }}></div>
            
            {React.Children.map(children, (child) => (
              <div className="relative pt-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-10 bg-slate-200"></div>
                {child}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const OrgChart: React.FC = () => {
  const { employees } = useHR();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('Todos');

  const departments = useMemo(() => {
    const depts = new Set(employees.map(e => e.department));
    return ['Todos', ...Array.from(depts)];
  }, [employees]);

  const renderTree = (managerId: string | null, level: number = 0) => {
    const subordinates = employees.filter(e => e.managerId === managerId);
    
    if (subordinates.length === 0) return null;

    return subordinates.map(emp => {
      const isMatch = searchTerm !== '' && emp.name.toLowerCase().includes(searchTerm.toLowerCase());
      const isDeptMatch = selectedDept === 'Todos' || emp.department === selectedDept;
      
      const hasMatchingDescendant = (id: string): boolean => {
         const subs = employees.filter(e => e.managerId === id);
         return subs.some(s => (selectedDept === 'Todos' || s.department === selectedDept) || hasMatchingDescendant(s.id));
      };

      const shouldShow = isDeptMatch || hasMatchingDescendant(emp.id) || level === 0;

      if (!shouldShow && selectedDept !== 'Todos') return null;

      return (
        <EmployeeNode 
          key={emp.id} 
          employee={emp} 
          level={level}
          highlight={isMatch}
          isFocused={searchTerm === '' && selectedDept === 'Todos' ? true : (isDeptMatch || isMatch || hasMatchingDescendant(emp.id))}
        >
          {renderTree(emp.id, level + 1)}
        </EmployeeNode>
      );
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-20">
      {/* Banner Minimalista Organograma */}
      <div className="bg-slate-900 border border-slate-200 relative min-h-[200px] flex items-center px-10 overflow-hidden">
         <img 
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200" 
            className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale"
            alt="OrgChart"
         />
         <div className="relative z-10 w-full flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="text-center lg:text-left">
               <h1 className="text-3xl font-bold text-white tracking-tight">Arquitetura Organizacional</h1>
               <p className="text-sm text-slate-400 mt-2 max-w-md font-medium italic">Mapeamento dinâmico de hierarquias, reportes de comando e clusters departamentais.</p>
            </div>
            
            <div className="flex gap-4">
               <div className="flex flex-col gap-1">
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest ml-1">Filtrar Depto</span>
                  <select 
                    className="px-4 py-2 bg-white/10 border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest outline-none focus:bg-white focus:text-slate-900 transition-all"
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                  >
                    {departments.map(d => <option key={d} value={d} className="text-slate-900">{d}</option>)}
                  </select>
               </div>
               <div className="flex flex-col gap-1">
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest ml-1">Buscar Unidade</span>
                  <input 
                    type="text" 
                    placeholder="NOME..." 
                    className="px-4 py-2 bg-white/10 border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest outline-none focus:bg-white focus:text-slate-900 transition-all placeholder:text-slate-600"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
            </div>
         </div>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm overflow-auto custom-scrollbar p-20 min-h-[800px] relative">
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
         
         <div className="inline-flex flex-col items-center min-w-full relative z-10">
           {renderTree(null)}
         </div>
      </div>

      <footer className="flex justify-center gap-10">
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-slate-900"></div>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Diretoria Alpha</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500"></div>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Liderança</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-slate-100 border border-slate-200"></div>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Nodos Ativos</span>
         </div>
      </footer>
    </div>
  );
};

export default OrgChart;
