
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useHR } from '../context/HRContext';
import { Employee } from '../types';

const LevelBadge: React.FC<{ level: number }> = ({ level }) => {
  const labels = ['Executivo', 'Gerência', 'Operacional', 'Staff'];
  const colors = [
    'bg-indigo-900 text-indigo-100 border-indigo-700',
    'bg-blue-600 text-white border-blue-400',
    'bg-gray-100 text-gray-600 border-gray-200',
    'bg-gray-50 text-gray-400 border-gray-100'
  ];
  const idx = Math.min(level, labels.length - 1);
  return (
    <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border ${colors[idx]}`}>
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
    <div className={`flex flex-col items-center flex-shrink-0 transition-all duration-700 ${isFocused ? 'opacity-100' : 'opacity-60 grayscale-[0.5]'} hover:opacity-100 hover:grayscale-0`}>
      <div className="relative p-4 group">
        {/* Techno Glow for Highlights */}
        {(highlight || isCLevel) && (
          <div className={`absolute inset-0 blur-2xl rounded-full animate-pulse ${isCLevel ? 'bg-indigo-500/20' : 'bg-blue-500/20'}`}></div>
        )}
        
        <Link to={`/employee/${employee.id}`} className="block relative z-10">
          <div className={`
            w-64 p-5 rounded-[2rem] border transition-all duration-500
            ${isCLevel ? 'bg-indigo-950 border-indigo-800 shadow-2xl scale-105' : 'bg-white border-gray-100 shadow-sm'}
            ${highlight ? 'ring-4 ring-blue-500/30 border-blue-400' : ''}
            group-hover:shadow-2xl group-hover:border-blue-200 group-hover:-translate-y-1
          `}>
            <div className="flex items-center gap-4">
              <div className={`
                w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg shadow-inner
                ${isCLevel ? 'bg-white/10 text-white' : 'bg-blue-50 text-blue-600'}
              `}>
                {employee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="overflow-hidden flex-1">
                <div className="flex items-center justify-between mb-0.5">
                   <LevelBadge level={level} />
                   <span className={`text-[8px] font-bold ${isCLevel ? 'text-indigo-400' : 'text-gray-400'}`}>#{employee.registration}</span>
                </div>
                <p className={`text-sm font-black truncate ${isCLevel ? 'text-white' : 'text-gray-900'}`}>
                  {employee.name}
                </p>
                <p className={`text-[10px] font-bold uppercase tracking-widest truncate ${isCLevel ? 'text-indigo-300' : 'text-gray-400'}`}>
                  {employee.role}
                </p>
              </div>
            </div>
            
            <div className={`mt-4 pt-3 border-t flex justify-between items-center ${isCLevel ? 'border-white/10' : 'border-gray-50'}`}>
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${employee.status === 'Ativo' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                <span className={`text-[9px] font-black uppercase tracking-tighter ${isCLevel ? 'text-indigo-200' : 'text-gray-500'}`}>
                  {employee.department}
                </span>
              </div>
              <svg className={`w-4 h-4 ${isCLevel ? 'text-indigo-400' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </div>
          </div>
        </Link>
      </div>

      {children && (
        <div className="relative flex flex-col items-center w-full">
          <div className="w-px h-12 bg-gradient-to-b from-gray-300 to-gray-200"></div>
          <div className="flex gap-8 items-start relative pt-4 px-8">
            {/* Intelligent connector line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gray-300 mx-auto" style={{ width: 'calc(100% - 100px)' }}></div>
            
            {React.Children.map(children, (child) => (
              <div className="relative pt-4">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-4 bg-gray-300"></div>
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

  // Recursively render tree with hierarchy logic and focus
  const renderTree = (managerId: string | null, level: number = 0) => {
    const subordinates = employees.filter(e => e.managerId === managerId);
    
    if (subordinates.length === 0) return null;

    return subordinates.map(emp => {
      const isMatch = searchTerm !== '' && emp.name.toLowerCase().includes(searchTerm.toLowerCase());
      const isDeptMatch = selectedDept === 'Todos' || emp.department === selectedDept;
      
      // Lógica de visibilidade: Se filtrar por depto, ainda mostramos os pais para contexto
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
          isFocused={isDeptMatch || isMatch}
        >
          {renderTree(emp.id, level + 1)}
        </EmployeeNode>
      );
    });
  };

  return (
    <div className="space-y-6 h-full flex flex-col animate-fadeIn">
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter flex items-center gap-3">
            <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
            Mapa de Talentos Nexus
          </h2>
          <p className="text-gray-500 font-medium text-sm">Estrutura hierárquica oficial e reporte de comando eSocial.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto">
          {/* Department Selector */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Filtrar Departamento</label>
            <select 
              className="w-full md:w-48 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* Search Bar */}
          <div className="space-y-2 flex-1 md:w-80">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Localizar Profissional</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <input 
                type="text" 
                placeholder="Nome do colaborador..." 
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Chart Canvas with Pan Control */}
      <div className="flex-1 bg-white rounded-[3rem] shadow-2xl shadow-blue-900/5 border border-gray-100 overflow-auto custom-scrollbar relative">
        {/* Technical Grid Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="inline-flex flex-col items-center p-20 min-w-full min-h-full">
          {renderTree(null)}
        </div>
      </div>

      <footer className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-gray-100 flex flex-wrap justify-center gap-8 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-indigo-950 border border-indigo-700"></div>
          <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Board (C-Level)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-600 border border-blue-400"></div>
          <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Gestão Direta</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gray-100 border border-gray-200"></div>
          <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Colaboradores</span>
        </div>
        <div className="h-4 w-px bg-gray-200 mx-2"></div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-[10px] font-bold text-gray-400">Sincronizado com eSocial</span>
        </div>
      </footer>
    </div>
  );
};

export default OrgChart;
