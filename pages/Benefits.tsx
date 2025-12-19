
import React, { useState, useMemo } from 'react';
import { useHR } from '../context/HRContext';
import { Benefit, BenefitType, EmployeeBenefit, Employee } from '../types';

const BenefitModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (data: any) => void;
  initialData?: Benefit;
}> = ({ isOpen, onClose, onSave, initialData }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-slideIn">
        <div className="p-8 border-b border-gray-100 bg-indigo-50/50 flex justify-between items-center">
          <h3 className="text-xl font-black text-indigo-900 uppercase tracking-tighter italic">
            {initialData ? 'Editar Benefício' : 'Novo Benefício Corporativo'}
          </h3>
          <button onClick={onClose} className="p-2 text-indigo-300 hover:bg-indigo-100 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l18 18" /></svg>
          </button>
        </div>
        <form className="p-8 space-y-6" onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          onSave({
            name: fd.get('name'),
            provider: fd.get('provider'),
            type: fd.get('type') as BenefitType,
            baseCost: Number(fd.get('cost')),
            eligibility: fd.get('eligibility'),
            description: fd.get('description')
          });
          onClose();
        }}>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Nome do Pacote</label>
              <input name="name" required defaultValue={initialData?.name} placeholder="Ex: Plano de Saúde Gold" className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold" />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Operadora</label>
                  <input name="provider" required defaultValue={initialData?.provider} placeholder="Bradesco, Alelo..." className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold" />
               </div>
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Tipo</label>
                  <select name="type" defaultValue={initialData?.type} className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold">
                    <option value="Saúde">Saúde</option>
                    <option value="Alimentação">Alimentação</option>
                    <option value="Seguro">Seguro</option>
                    <option value="Transporte">Transporte</option>
                    <option value="Educação">Educação</option>
                    <option value="Lazer">Lazer</option>
                  </select>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Custo Base (R$)</label>
                  <input name="cost" type="number" step="0.01" required defaultValue={initialData?.baseCost} placeholder="0.00" className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold" />
               </div>
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Elegibilidade</label>
                  <select name="eligibility" defaultValue={initialData?.eligibility} className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold">
                    <option value="Todos">Todos</option>
                    <option value="CLT">Apenas CLT</option>
                    <option value="Liderança">C-Level/Gerência</option>
                  </select>
               </div>
            </div>
          </div>
          <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">
            {initialData ? 'Atualizar Pacote' : 'Ativar Benefício'}
          </button>
        </form>
      </div>
    </div>
  );
};

const ManageUsersModal: React.FC<{ 
  benefit: Benefit; 
  onClose: () => void; 
}> = ({ benefit, onClose }) => {
  const { employees, employeeBenefits, enrollEmployeeInBenefit, cancelEmployeeBenefit, updateEmployeeBenefit } = useHR();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCardId, setEditingCardId] = useState<string | null>(null);

  const filteredEmployees = useMemo(() => {
    return employees.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [employees, searchTerm]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-slideIn flex flex-col max-h-[85vh]">
        <div className="p-10 border-b border-gray-100 bg-gray-900 text-white flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tighter italic">Gestão de Usuários</h3>
            <p className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest">{benefit.name} &bull; {benefit.provider}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l18 18" /></svg>
          </button>
        </div>

        <div className="p-6 bg-gray-50 border-b border-gray-200">
           <div className="relative">
              <input 
                type="text" 
                placeholder="Pesquisar colaborador para adesão..." 
                className="w-full pl-12 pr-6 py-4 bg-white border border-gray-200 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {filteredEmployees.map(emp => {
            const enrollment = employeeBenefits.find(eb => eb.employeeId === emp.id && eb.benefitId === benefit.id && eb.status === 'Ativo');
            return (
              <div key={emp.id} className={`p-5 rounded-[2rem] border flex items-center justify-between transition-all ${enrollment ? 'bg-white border-blue-100 shadow-sm' : 'bg-gray-50/50 border-transparent'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm ${enrollment ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {emp.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900 leading-none mb-1">{emp.name}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">{emp.registration} &bull; {emp.department}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                   {enrollment ? (
                      <>
                        <div className="text-right">
                           <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1">Aderido em {new Date(enrollment.enrollmentDate).toLocaleDateString('pt-BR')}</p>
                           {editingCardId === enrollment.id ? (
                             <div className="flex gap-2">
                                <input 
                                  className="w-32 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-[10px] font-mono"
                                  placeholder="Nº Carteirinha"
                                  autoFocus
                                  onBlur={(e) => {
                                    updateEmployeeBenefit(enrollment.id, { cardNumber: e.target.value });
                                    setEditingCardId(null);
                                  }}
                                />
                             </div>
                           ) : (
                             <button 
                                onClick={() => setEditingCardId(enrollment.id)}
                                className="text-[10px] font-mono text-gray-400 hover:text-blue-600"
                             >
                                ID: {enrollment.cardNumber || 'Clique para definir'}
                             </button>
                           )}
                        </div>
                        <button 
                          onClick={() => cancelEmployeeBenefit(enrollment.id)}
                          className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l18 18" /></svg>
                        </button>
                      </>
                   ) : (
                      <button 
                        onClick={() => enrollEmployeeInBenefit(emp.id, benefit.id)}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                      >
                        Ativar
                      </button>
                   )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Benefits: React.FC = () => {
  const { benefits, employeeBenefits, addBenefit, updateBenefit, removeBenefit, toggleBenefitStatus, employees } = useHR();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBenefit, setEditingBenefit] = useState<Benefit | undefined>(undefined);
  const [managingBenefit, setManagingBenefit] = useState<Benefit | null>(null);

  const stats = useMemo(() => {
    const activeEnrollments = employeeBenefits.filter(eb => eb.status === 'Ativo').length;
    const totalMonthlyCost = employeeBenefits
      .filter(eb => eb.status === 'Ativo')
      .reduce((acc, eb) => {
        const benefit = benefits.find(b => b.id === eb.benefitId);
        return acc + (benefit?.baseCost || 0);
      }, 0);
    return { activeEnrollments, totalMonthlyCost };
  }, [benefits, employeeBenefits]);

  return (
    <div className="space-y-10 animate-fadeIn pb-24">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center text-white shadow-xl">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          </div>
          <div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter italic leading-none uppercase">Central de Benefícios</h2>
            <p className="text-gray-500 font-medium mt-2">Gestão estratégica de pacotes e adesão eSocial.</p>
          </div>
        </div>
        <button 
          onClick={() => { setEditingBenefit(undefined); setIsModalOpen(true); }}
          className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all"
        >
          Criar Novo Pacote
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-gray-950 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
           <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Despesa Mensal (Total)</p>
           <p className="text-4xl font-black tabular-nums">R$ {stats.totalMonthlyCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
           <div className="mt-8 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="text-[10px] font-bold text-gray-500 uppercase">{stats.activeEnrollments} Colaboradores Ativos em Algum Plano</span>
           </div>
        </div>
        
        <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm flex flex-col justify-between">
           <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Operadoras Ativas</p>
              <p className="text-3xl font-black text-gray-900">{Array.from(new Set(benefits.map(b => b.provider))).length}</p>
           </div>
           <p className="text-[10px] text-blue-600 font-bold uppercase mt-4">Interface direta com operadoras</p>
        </div>

        <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Adesão por Tipo</p>
           <div className="flex gap-2">
              <div className="flex-1 bg-red-50 p-3 rounded-2xl text-center">
                 <p className="text-lg font-black text-red-600">{benefits.filter(b => b.type === 'Saúde').length}</p>
                 <p className="text-[8px] font-bold text-red-400 uppercase tracking-tighter">Saúde</p>
              </div>
              <div className="flex-1 bg-orange-50 p-3 rounded-2xl text-center">
                 <p className="text-lg font-black text-orange-600">{benefits.filter(b => b.type === 'Alimentação').length}</p>
                 <p className="text-[8px] font-bold text-orange-400 uppercase tracking-tighter">Aliment.</p>
              </div>
              <div className="flex-1 bg-blue-50 p-3 rounded-2xl text-center">
                 <p className="text-lg font-black text-blue-600">{benefits.filter(b => b.type === 'Lazer' || b.type === 'Lazer').length}</p>
                 <p className="text-[8px] font-bold text-blue-400 uppercase tracking-tighter">Outros</p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit) => {
             const userCount = employeeBenefits.filter(eb => eb.benefitId === benefit.id && eb.status === 'Ativo').length;
             return (
               <div 
                  key={benefit.id} 
                  className={`bg-white p-8 rounded-[3rem] border transition-all hover:shadow-2xl group flex flex-col justify-between ${benefit.active ? 'border-gray-100' : 'opacity-60 bg-gray-50 border-dashed border-gray-300'}`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className={`p-4 rounded-2xl ${
                        benefit.type === 'Saúde' ? 'bg-red-50 text-red-600' :
                        benefit.type === 'Alimentação' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-7.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => { setEditingBenefit(benefit); setIsModalOpen(true); }}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button 
                          onClick={() => removeBenefit(benefit.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-black text-gray-900 mb-1">{benefit.name}</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">{benefit.provider} &bull; {benefit.eligibility}</p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-4 bg-gray-50 rounded-2xl">
                          <p className="text-[8px] text-gray-400 font-bold uppercase mb-0.5">Custo/Pessoa</p>
                          <p className="text-lg font-black text-gray-900">R$ {benefit.baseCost.toLocaleString('pt-BR')}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-2xl">
                          <p className="text-[8px] text-gray-400 font-bold uppercase mb-0.5">Ativados</p>
                          <p className="text-lg font-black text-blue-600">{userCount}</p>
                        </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                     <button 
                        onClick={() => toggleBenefitStatus(benefit.id)}
                        className={`flex-1 py-3.5 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${benefit.active ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                      >
                        {benefit.active ? 'Pausar' : 'Ativar'}
                      </button>
                      <button 
                        onClick={() => setManagingBenefit(benefit)}
                        className="flex-[2] py-3.5 bg-gray-900 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200"
                      >
                        Gerenciar Usuários
                      </button>
                  </div>
                </div>
             );
          })}
        </div>
      </div>

      <BenefitModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingBenefit(undefined); }} 
        onSave={(data) => {
          if (editingBenefit) {
            updateBenefit(editingBenefit.id, data);
          } else {
            addBenefit(data);
          }
        }} 
        initialData={editingBenefit}
      />

      {managingBenefit && (
        <ManageUsersModal 
          benefit={managingBenefit} 
          onClose={() => setManagingBenefit(null)} 
        />
      )}
    </div>
  );
};

export default Benefits;
