import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHR } from '../context/HRContext';

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const colors: Record<string, string> = {
    'Ativo': 'bg-blue-50 border-blue-100 text-blue-600',
    'Inativo': 'bg-slate-50 border-slate-200 text-slate-400',
    'Em Férias': 'bg-emerald-50 border-emerald-100 text-emerald-600',
    'Afastado': 'bg-amber-50 border-amber-100 text-amber-600',
  };

  return (
    <span className={`px-2.5 py-1 border text-[8px] font-bold uppercase tracking-widest ${colors[status] || 'bg-slate-50 border-slate-200 text-slate-400'}`}>
      {status}
    </span>
  );
};

const AdmissionModal: React.FC<{ isOpen: boolean; onClose: () => void; onSubmit: (data: any) => void }> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    department: '',
    salary: '',
    hireDate: new Date().toISOString().split('T')[0],
    email: '',
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-none w-full max-w-xl shadow-2xl overflow-hidden animate-slideIn">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Efetivar Admissão</h3>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">Novos Integrantes Nexus</p>
          </div>
          <button onClick={onClose} className="p-2 transition-colors text-slate-400 hover:text-slate-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l18 18" /></svg>
          </button>
        </div>

        <form className="p-8 space-y-6" onSubmit={(e) => {
          e.preventDefault();
          onSubmit({
            ...formData,
            salary: parseFloat(formData.salary),
            managerId: null,
            bank: { name: '-', agency: '-', account: '-' },
            dependents: [],
            status: 'Ativo',
            history: [{ date: formData.hireDate, event: 'Admissão', role: formData.role, salary: parseFloat(formData.salary) }]
          });
          onClose();
        }}>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Nome Completo</label>
              <input required type="text" className="w-full border-b border-slate-200 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 transition-colors bg-transparent" placeholder="Ex: João da Silva" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">E-mail</label>
                <input required type="email" className="w-full border-b border-slate-200 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 transition-colors bg-transparent" placeholder="user@empresa.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Data de Início</label>
                <input required type="date" className="w-full border-b border-slate-200 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 transition-colors bg-transparent" value={formData.hireDate} onChange={e => setFormData({...formData, hireDate: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Cargo</label>
                <input required type="text" className="w-full border-b border-slate-200 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 transition-colors bg-transparent" placeholder="Ex: Analista" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Departamento</label>
                <input required type="text" className="w-full border-b border-slate-200 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 transition-colors bg-transparent" placeholder="Ex: Financeiro" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Salário (R$)</label>
              <input required type="number" step="0.01" className="w-full border-b border-slate-200 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 transition-colors font-bold bg-transparent" placeholder="0,00" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} />
            </div>
          </div>

          <button type="submit" className="w-full py-4 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">Sincronizar Novos Dados</button>
        </form>
      </div>
    </div>
  );
};

const Employees: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { employees, removeEmployee, addEmployee } = useHR();
  const navigate = useNavigate();

  const filtered = employees.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.registration.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner de Diretorio Estilizado */}
      <div className="bg-slate-900 border border-slate-200 relative min-h-[220px] flex items-center px-10 overflow-hidden">
         <img 
            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1200" 
            className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale"
            alt="Directory"
         />
         <div className="relative z-10 w-full flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="text-center lg:text-left">
               <h1 className="text-3xl font-bold text-white tracking-tight">Diretório de Colaboradores</h1>
               <p className="text-sm text-slate-400 mt-2 max-w-md font-medium">Ecossistema centralizado para gestão de biografias profissionais, cargos e ciclos de vida.</p>
            </div>
            
            <div className="flex gap-4">
               <div className="relative group">
                  <input
                    type="text"
                    placeholder="Buscando..."
                    className="w-[240px] pl-10 pr-4 py-3 bg-white/10 border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest outline-none focus:bg-white focus:text-slate-900 transition-all placeholder:text-slate-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
               </div>
               <button 
                  onClick={() => setIsModalOpen(true)}
                  className="px-8 py-3 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-lg shadow-blue-500/10"
               >
                  Admitir Novo
               </button>
            </div>
         </div>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[9px] uppercase tracking-[0.2em] font-bold border-b border-slate-100">
                <th className="px-8 py-5">Colaborador</th>
                <th className="px-6 py-5">Matrícula</th>
                <th className="px-6 py-5">Cargo / Depto</th>
                <th className="px-6 py-5 text-center">Status</th>
                <th className="px-6 py-5">Remuneração</th>
                <th className="px-8 py-5 text-right">Perfil</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-[10px] border border-slate-200">
                        {emp.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm tracking-tight leading-none mb-1">{emp.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="font-mono text-[10px] text-slate-400 tracking-widest uppercase">{emp.registration}</span>
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-xs font-bold text-slate-800 tracking-tight leading-none mb-1">{emp.role}</p>
                    <p className="text-[8px] font-bold text-blue-500 uppercase tracking-widest">{emp.department}</p>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <StatusBadge status={emp.status} />
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-xs font-bold text-slate-900">R$ {emp.salary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => navigate(`/employee/${emp.id}`)}
                      className="inline-flex items-center gap-2 p-2 px-4 border border-slate-100 text-[9px] font-bold text-slate-400 uppercase tracking-widest group-hover:bg-slate-900 group-hover:text-white transition-all"
                    >
                      Acessar
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-32 text-center bg-white">
              <p className="text-slate-300 font-bold uppercase tracking-widest text-xs italic">Nenhum registro encontrado no sistema.</p>
            </div>
          )}
        </div>
      </div>

      <AdmissionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={addEmployee} />
    </div>
  );
};

export default Employees;
